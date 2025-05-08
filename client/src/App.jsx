import React, { useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Auth from './components/Auth'
import Workouts from './components/Workouts'
import ProtectedRoute from './components/ProtectedRoute'
import Meals from './components/Meals.jsx'
import Header from './components/Header'
import Footer from './components/Footer'
import MealManagement from './components/MealManagement'
import WorkoutManagement from './components/WorkoutManagement'
import Reports from './components/Reports'
import axios from 'axios'
import { ThemeProvider, ThemeContext } from './context/ThemeContext'

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function AppContent({ user, setUser, meals, setMeals, plans, setPlans, handleAuth, handleMealPlanSave, handleWorkoutPlanSave }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/auth';

  return (
    <div className="app-container">
      {!hideHeaderFooter && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
          <Route
            path="/meals"
            element={
              <ProtectedRoute>
                <section className="content-section">
                  <h2>Meals</h2>
                  <Meals mealPlans={meals} />
                </section>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <section className="content-section">
                  <h2>Workouts</h2>
                  <Workouts plans={plans} />
                </section>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <section className="content-section">
                  <Reports workoutPlans={plans} />
                </section>
              </ProtectedRoute>
            }
          />
          <Route
            path="/management"
            element={
              <ProtectedRoute>
                <section className="content-section">
                  <h2>Meal Management</h2>
                  <MealManagement mealPlans={meals} onSave={handleMealPlanSave} />
                </section>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-management"
            element={
              <ProtectedRoute>
                <section className="content-section">
                  <h2>Workout Management</h2>
                  <WorkoutManagement plans={plans} onSave={handleWorkoutPlanSave} />
                </section>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/meals" replace />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('username'))
  const [meals, setMeals] = useState([])
  const [plans, setPlans] = useState([])

  const handleAuth = (data) => {
    localStorage.setItem('username', data.username)
    setUser(data.username)
  }

  React.useEffect(() => {
    if (user && localStorage.getItem('token')) {
      axios.get('/api/meals').then(res => setMeals(res.data))
      axios.get('/api/workouts').then(res => setPlans(res.data))
    }
  }, [user])

  // Handler to update meal plans after editing
  const handleMealPlanSave = async (updatedPlan, idx) => {
    const res = await axios.get('/api/meals')
    setMeals(res.data)
  }

  // Handler to update workout plans after editing
  const handleWorkoutPlanSave = async (updatedPlan, idx) => {
    const res = await axios.get('/api/workouts')
    setPlans(res.data)
  }

  return (
    <ThemeProvider>
      <Router>
        <AppContent
          user={user}
          setUser={setUser}
          meals={meals}
          setMeals={setMeals}
          plans={plans}
          setPlans={setPlans}
          handleAuth={handleAuth}
          handleMealPlanSave={handleMealPlanSave}
          handleWorkoutPlanSave={handleWorkoutPlanSave}
        />
      </Router>
    </ThemeProvider>
  )
}