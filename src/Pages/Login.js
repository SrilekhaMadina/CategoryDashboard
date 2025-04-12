import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {login} from '../api/api'

function Login({onLogin}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const data = await login({email, password})
      localStorage.setItem('token', data.token) 
      onLogin(data.user) 
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed: ' + error.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type='submit'>Log In</button>
      </form>
    </div>
  )
}

export default Login
