import React, {useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({token})
    }
    setLoading(false)
  }, [])

  const handleLogin = userData => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login onLogin={handleLogin} />} />
          <Route
            path='/dashboard'
            element={user ? <Dashboard /> : <Navigate to='/login' />}
          />
          <Route path='/' element={<Navigate to='/dashboard' />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
