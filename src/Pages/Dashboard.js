import React, { useState, useEffect } from 'react'
import CategoryCard from '../components/CategoryCard'
import AddCategoryForm from '../components/AddCategoryForm'
import { getCategories } from '../api/api'

function Dashboard() {
    const [categories, setCategories] = useState([])
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const data = await getCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
            alert('Failed to load categories')
        }
    }

    const handleCategoryAdded = (newCategory) => {
        setCategories([...categories, newCategory])
        setShowAddCategoryForm(false)
    }

    return (
        <div>
            <h2>Category Dashboard</h2>
            <button onClick={() => setShowAddCategoryForm(true)}>Add Category</button>

            {showAddCategoryForm && (
                <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
            )}

            <div className="category-grid">
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </div>
    )
}

export default Dashboard