import React, { useState, useEffect, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUsername('')
    navigate('/auth')
  }

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1 className="header-title">NatLife</h1>
          <p className="header-subtitle">Your nutrition & workout hub</p>
        </div>
        {username && (
          <div className="header-user-controls">
            <ThemeToggle />
            <span>{username}</span>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <nav className="header-nav">
        <NavLink to="/meals" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Meals
        </NavLink>
        <NavLink to="/workouts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Workouts
        </NavLink>
        <NavLink to="/report" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Reports
        </NavLink>
        <NavLink to="/management" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Meal Management
        </NavLink>
        <NavLink to="/workout-management" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Workout Management
        </NavLink>
      </nav>
    </header>
  )
} 