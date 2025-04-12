import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {signup} from '../api/api'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await signup({name, email, password})
      navigate('/login') 
    } catch (error) {
      console.error('Signup failed:', error)
      alert('Signup failed: ' + error.message)
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
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
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}

export default Signup
