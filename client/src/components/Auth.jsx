import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register'
      const res = await axios.post(endpoint, { username, password })
      setMessage(mode === 'login' ? 'Login successful!' : 'Registration successful!')
      setUsername('')
      setPassword('')
      if (mode === 'login' && res.data.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
        if (onAuth) onAuth(res.data)
        navigate('/')
      } else if (onAuth && res.data) {
        onAuth(res.data)
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: 350,
      margin: '3rem auto',
      background: '#23252b',
      padding: '2rem',
      borderRadius: 8,
      boxShadow: '0 2px 12px #0002',
      color: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {mode === 'login' ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '.75rem',
              borderRadius: 4,
              border: '1px solid #444',
              background: '#18191d',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '.75rem',
              borderRadius: 4,
              border: '1px solid #444',
              background: '#18191d',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          style={{
            width: '100%',
            padding: '.75rem',
            borderRadius: 4,
            border: 'none',
            background: '#21e6c1',
            color: '#18191d',
            fontWeight: 700,
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '.75rem'
          }}
        >
          {loading ? (mode === 'login' ? 'Logging in…' : 'Registering…') : (mode === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage('') }}
          style={{
            background: 'none',
            border: 'none',
            color: '#21e6c1',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '.95rem'
          }}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
      {message && (
        <div style={{
          background: '#18191d',
          color: message.includes('success') ? '#21e6c1' : '#ff4d4f',
          padding: '.75rem',
          borderRadius: 4,
          textAlign: 'center',
          marginTop: '.5rem',
          fontWeight: 500
        }}>{message}</div>
      )}
    </div>
  )
} 