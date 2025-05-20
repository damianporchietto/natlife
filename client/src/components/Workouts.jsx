import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ThemeContext } from '../context/ThemeContext'

export default function Workouts({ plans = [] }) {
  const [open, setOpen] = useState(null)
  const [exerciseState, setExerciseState] = useState({})
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    if (!plans.length) return
    const newState = {}
    plans.forEach(plan => {
      plan.days.forEach((day, di) => {
        day.exercises.forEach((ex, ei) => {
          const key = `${plan._id}_${di}_${ei}`
          newState[key] = {
            w: ex.currentWeight ?? '',
            r: ex.currentReps ?? '',
            btnTxt: '✓'
          }
        })
      })
    })
    setExerciseState(newState)
  }, [plans])

  const handleInputChange = (key, field, value) => {
    setExerciseState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }))
  }

  const patch = (planId, di, ei) => {
    const key = `${planId}_${di}_${ei}`
    const { w, r } = exerciseState[key]
    setExerciseState(prev => ({
      ...prev,
      [key]: { ...prev[key], btnTxt: '…' }
    }))
    axios.patch(`/api/workouts/${planId}/day/${di}/ex/${ei}`, { weight: parseFloat(w), reps: parseInt(r) })
      .then(() => setExerciseState(prev => ({
        ...prev,
        [key]: { ...prev[key], btnTxt: '✓' }
      })))
      .catch(() => setExerciseState(prev => ({
        ...prev,
        [key]: { ...prev[key], btnTxt: '!' }
      })))
  }

  if (!plans.length) return (
    <div className="empty-state">
      <p>No workout plans available. Add a workout plan to get started.</p>
    </div>
  )

  return (
    <div>
      {plans.map((plan, pi) => (
        <div key={plan._id} className="workout-plan">
          <div
            onClick={() => setOpen(open === pi ? null : pi)}
            className="workout-header"
          >
            <h3>{plan.title}</h3>
            <span>{open === pi ? '▼' : '►'}</span>
          </div>

          {open === pi && (
            <div className="workout-content">
              {plan.days.map((day, di) => (
                <div key={di}>
                  <h4 className="workout-day-title">{day.title}</h4>
                  {day.exercises.map((ex, ei) => {
                    const key = `${plan._id}_${di}_${ei}`
                    const state = exerciseState[key] || { w: '', r: '', btnTxt: '✓' }
                    return (
                      <div
                        key={ei}
                        className="exercise-row"
                      >
                        <div>{ex.name}</div>
                        <div className="exercise-input-group">
                          <label>Current Weight (kg)</label>
                          <input
                            type='number'
                            step='.5'
                            value={state.w}
                            placeholder={ex.suggestedWeight ?? ''}
                            onChange={e => handleInputChange(key, 'w', e.target.value)}
                            className="exercise-input"
                          />
                        </div>
                        <div className="exercise-input-group">
                          <label>Current Reps</label>
                          <input
                            type='number'
                            step='1'
                            value={state.r}
                            placeholder={ex.suggestedReps ?? ''}
                            onChange={e => handleInputChange(key, 'r', e.target.value)}
                            className="exercise-input"
                          />
                        </div>
                        <button
                          onClick={() => patch(plan._id, di, ei)}
                          className="exercise-button"
                        >
                          {state.btnTxt}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
