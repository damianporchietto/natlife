import React, { useState } from 'react'
import axios from 'axios'

export default function WorkoutManagement({ plans = [], onSave }) {
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})
  const [adding, setAdding] = useState(false)
  const [newPlan, setNewPlan] = useState({ title: '', days: [] })

  const startEdit = idx => {
    setEditing(idx)
    setEditData(JSON.parse(JSON.stringify(plans[idx])))
  }
  const cancelEdit = () => {
    setEditing(null)
    setEditData({})
  }
  const handlePlanChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }
  const handleDayChange = (dayIdx, field, value) => {
    setEditData(prev => {
      const days = prev.days.map((d, i) => i === dayIdx ? { ...d, [field]: value } : d)
      return { ...prev, days }
    })
  }
  const handleExerciseChange = (dayIdx, exIdx, field, value) => {
    setEditData(prev => {
      const days = prev.days.map((d, i) => {
        if (i !== dayIdx) return d
        const exercises = d.exercises.map((ex, j) => j === exIdx ? { ...ex, [field]: value } : ex)
        return { ...d, exercises }
      })
      return { ...prev, days }
    })
  }
  const addDay = () => {
    setEditData(prev => ({ ...prev, days: [...prev.days, { title: '', exercises: [] }] }))
  }
  const removeDay = dayIdx => {
    setEditData(prev => ({ ...prev, days: prev.days.filter((_, i) => i !== dayIdx) }))
  }
  const addExercise = dayIdx => {
    setEditData(prev => {
      const days = prev.days.map((d, i) =>
        i === dayIdx ? { ...d, exercises: [...d.exercises, { name: '', suggestedWeight: '', suggestedReps: '', currentWeight: '', currentReps: '' }] } : d
      )
      return { ...prev, days }
    })
  }
  const removeExercise = (dayIdx, exIdx) => {
    setEditData(prev => {
      const days = prev.days.map((d, i) =>
        i === dayIdx ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) } : d
      )
      return { ...prev, days }
    })
  }
  const saveEdit = async () => {
    try {
      const res = await axios.patch(`/api/workouts/${editData._id}`, editData)
      if (onSave) onSave(res.data, editing)
    } catch (err) {
      alert('Failed to save workout plan')
    }
    setEditing(null)
    setEditData({})
  }
  const deletePlan = async (id) => {
    if (!window.confirm('Delete this workout plan?')) return
    try {
      await axios.delete(`/api/workouts/${id}`)
      if (onSave) onSave(null, null)
    } catch (err) {
      alert('Failed to delete workout plan')
    }
  }

  const handleNewPlanChange = (field, value) => {
    setNewPlan(prev => ({ ...prev, [field]: value }))
  }
  const addNewDay = () => {
    setNewPlan(prev => ({ ...prev, days: [...prev.days, { title: '', exercises: [] }] }))
  }
  const addNewExercise = (dayIdx) => {
    setNewPlan(prev => {
      const days = prev.days.map((d, i) =>
        i === dayIdx ? { ...d, exercises: [...d.exercises, { name: '', suggestedWeight: '', suggestedReps: '', currentWeight: '', currentReps: '' }] } : d
      )
      return { ...prev, days }
    })
  }
  const handleNewDayChange = (dayIdx, field, value) => {
    setNewPlan(prev => {
      const days = prev.days.map((d, i) => i === dayIdx ? { ...d, [field]: value } : d)
      return { ...prev, days }
    })
  }
  const handleNewExerciseChange = (dayIdx, exIdx, field, value) => {
    setNewPlan(prev => {
      const days = prev.days.map((d, i) => {
        if (i !== dayIdx) return d
        const exercises = d.exercises.map((ex, j) => j === exIdx ? { ...ex, [field]: value } : ex)
        return { ...d, exercises }
      })
      return { ...prev, days }
    })
  }
  const removeNewDay = dayIdx => {
    setNewPlan(prev => ({ ...prev, days: prev.days.filter((_, i) => i !== dayIdx) }))
  }
  const removeNewExercise = (dayIdx, exIdx) => {
    setNewPlan(prev => {
      const days = prev.days.map((d, i) =>
        i === dayIdx ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) } : d
      )
      return { ...prev, days }
    })
  }
  const saveNewPlan = async () => {
    try {
      const res = await axios.post('/api/workouts', newPlan)
      if (onSave) onSave(res.data, null)
      setNewPlan({ title: '', days: [] })
      setAdding(false)
    } catch (err) {
      alert('Failed to add workout plan')
    }
  }

  return (
    <div>
      <h2>Workout Plan Management</h2>
      <button onClick={() => setAdding(a => !a)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{adding ? 'Cancel New' : 'Add New Plan'}</button>
      {adding && (
        <div style={{ background: '#23252b', color: '#fff', borderRadius: 8, margin: '1rem 0', padding: '1rem' }}>
          <input
            value={newPlan.title}
            onChange={e => handleNewPlanChange('title', e.target.value)}
            placeholder="Plan Title"
            style={{ marginBottom: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444', width: '100%' }}
          />
          {newPlan.days.map((day, di) => (
            <div key={di} style={{ margin: '1rem 0', padding: '.5rem', background: '#18191d', borderRadius: 6 }}>
              <input
                value={day.title}
                onChange={e => handleNewDayChange(di, 'title', e.target.value)}
                placeholder="Day Title"
                style={{ marginRight: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }}
              />
              <button onClick={() => removeNewDay(di)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginLeft: '.5rem' }}>Delete Day</button>
              {day.exercises.map((ex, ei) => (
                <div key={ei} style={{ margin: '.5rem 0', display: 'flex', gap: '.5rem' }}>
                  <input value={ex.name} onChange={e => handleNewExerciseChange(di, ei, 'name', e.target.value)} placeholder="Exercise Name" style={{ flex: 2, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={ex.suggestedWeight} onChange={e => handleNewExerciseChange(di, ei, 'suggestedWeight', e.target.value)} placeholder="Suggested Weight" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={ex.suggestedReps} onChange={e => handleNewExerciseChange(di, ei, 'suggestedReps', e.target.value)} placeholder="Suggested Reps" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={ex.currentWeight} onChange={e => handleNewExerciseChange(di, ei, 'currentWeight', e.target.value)} placeholder="Current Weight" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={ex.currentReps} onChange={e => handleNewExerciseChange(di, ei, 'currentReps', e.target.value)} placeholder="Current Reps" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <button onClick={() => removeNewExercise(di, ei)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem' }}>Delete</button>
                </div>
              ))}
              <button onClick={() => addNewExercise(di)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Exercise</button>
            </div>
          ))}
          <button onClick={addNewDay} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Day</button>
          <button onClick={saveNewPlan} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', marginLeft: '.5rem', fontWeight: 700 }}>Save New Plan</button>
        </div>
      )}
      {plans.map((plan, idx) => (
        <div key={plan._id} style={{ background: '#23252b', color: '#fff', borderRadius: 8, margin: '1rem 0', padding: '1rem' }}>
          {editing === idx ? (
            <div>
              <input
                value={editData.title}
                onChange={e => handlePlanChange('title', e.target.value)}
                style={{ marginBottom: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444', width: '100%' }}
              />
              {editData.days.map((day, di) => (
                <div key={di} style={{ margin: '1rem 0', padding: '.5rem', background: '#18191d', borderRadius: 6 }}>
                  <input
                    value={day.title}
                    onChange={e => handleDayChange(di, 'title', e.target.value)}
                    style={{ marginRight: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }}
                  />
                  <button onClick={() => removeDay(di)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginLeft: '.5rem' }}>Delete Day</button>
                  {day.exercises.map((ex, ei) => (
                    <div key={ei} style={{ margin: '.5rem 0', display: 'flex', gap: '.5rem' }}>
                      <input value={ex.name} onChange={e => handleExerciseChange(di, ei, 'name', e.target.value)} placeholder="Exercise Name" style={{ flex: 2, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={ex.suggestedWeight} onChange={e => handleExerciseChange(di, ei, 'suggestedWeight', e.target.value)} placeholder="Suggested Weight" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={ex.suggestedReps} onChange={e => handleExerciseChange(di, ei, 'suggestedReps', e.target.value)} placeholder="Suggested Reps" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={ex.currentWeight} onChange={e => handleExerciseChange(di, ei, 'currentWeight', e.target.value)} placeholder="Current Weight" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={ex.currentReps} onChange={e => handleExerciseChange(di, ei, 'currentReps', e.target.value)} placeholder="Current Reps" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <button onClick={() => removeExercise(di, ei)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem' }}>Delete</button>
                    </div>
                  ))}
                  <button onClick={() => addExercise(di)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Exercise</button>
                </div>
              ))}
              <button onClick={addDay} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Day</button>
              <button onClick={saveEdit} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', marginLeft: '.5rem', fontWeight: 700 }}>Save</button>
              <button onClick={cancelEdit} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', marginLeft: '.5rem' }}>Cancel</button>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{plan.title}</div>
              {plan.days.map((day, di) => (
                <div key={di} style={{ margin: '.5rem 0', color: '#aaa' }}>
                  {day.title}
                  <ul style={{ margin: '.25rem 0 .25rem 1.5rem' }}>
                    {day.exercises.map((ex, ei) => (
                      <li key={ei}>{ex.name} — {ex.suggestedWeight}kg/{ex.suggestedReps} reps</li>
                    ))}
                  </ul>
                </div>
              ))}
              <button onClick={() => startEdit(idx)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', fontWeight: 700 }}>Edit</button>
              <button onClick={() => deletePlan(plan._id)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', marginLeft: '.5rem' }}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 