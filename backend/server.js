const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require('cors')

const app = express()
const port = 5000

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}))
app.use(express.json())

const JWT_SECRET = 'your-secret-key'


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('Connected to the database.')
})


db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`)


db.run(`
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        itemCount INTEGER NOT NULL,
        imageUrl TEXT NOT NULL
    )
`)


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.post('/auth/signup', async (req, res) => {
    const { name, email, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], (err) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({ message: 'Failed to create user' })
            }
            res.status(201).json({ message: 'User created successfully' })
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to create user' })
    }
})


app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({ message: 'Failed to login' })
        }

        if (!user) {
            return res.status(400).json({ message: 'Cannot find user' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })
                res.json({ message: 'Logged in successfully', token: token, user: { id: user.id, email: user.email } })
            } else {
                res.status(401).json({ message: 'Incorrect password' })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Failed to login' })
        }
    })
})


app.get('/categories', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM categories`, [], (err, rows) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({ message: 'Failed to retrieve categories' })
        }
        res.json(rows)
    })
})

app.post('/categories', authenticateToken, (req, res) => {
    const { name, itemCount, imageUrl } = req.body

    db.run(`INSERT INTO categories (name, itemCount, imageUrl) VALUES (?, ?, ?)`, [name, itemCount, imageUrl], (err) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({ message: 'Failed to create category' })
        }
        res.status(201).json({ message: 'Category created successfully' })
    })
})

app.put('/categories/:id', authenticateToken, (req, res) => {
    const { name, itemCount, imageUrl } = req.body
    const { id } = req.params

    db.run(`UPDATE categories SET name = ?, itemCount = ?, imageUrl = ? WHERE id = ?`, [name, itemCount, imageUrl, id], (err) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({ message: 'Failed to update category' })
        }
        res.json({ message: 'Category updated successfully' })
    })
})

app.delete('/categories/:id', authenticateToken, (req, res) => {
    const { id } = req.params

    db.run(`DELETE FROM categories WHERE id = ?`, [id], (err) => {
        if (err) {
            console.error(err.message)
            return res.status(500).json({ message: 'Failed to delete category' })
        }
        res.json({ message: 'Category deleted successfully' })
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})