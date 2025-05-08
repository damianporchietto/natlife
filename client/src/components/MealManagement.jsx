import React, { useState } from 'react'
import axios from 'axios'
import Dialog from './Dialog'

export default function MealManagement({ mealPlans = [], onSave }) {
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})
  const [adding, setAdding] = useState(false)
  const [newPlan, setNewPlan] = useState({ day: '', meals: [] })
  const [dialog, setDialog] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'error',
    onConfirm: null, 
    isConfirmation: false 
  })

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const showDialog = (title, message, type = 'error', onConfirm = null, isConfirmation = false) => {
    setDialog({ isOpen: true, title, message, type, onConfirm, isConfirmation });
  };

  // --- Edit logic ---
  const startEdit = idx => {
    setEditing(idx)
    setEditData(JSON.parse(JSON.stringify(mealPlans[idx])))
  }
  const cancelEdit = () => {
    setEditing(null)
    setEditData({})
  }
  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }
  const handleMealChange = (mealIdx, field, value) => {
    setEditData(prev => {
      const meals = prev.meals.map((m, i) => i === mealIdx ? { ...m, [field]: value } : m)
      return { ...prev, meals }
    })
  }
  const handleItemChange = (mealIdx, itemIdx, field, value) => {
    setEditData(prev => {
      const meals = prev.meals.map((m, i) => {
        if (i !== mealIdx) return m
        const items = m.items.map((it, j) => j === itemIdx ? { ...it, [field]: value } : it)
        return { ...m, items }
      })
      return { ...prev, meals }
    })
  }
  const addMeal = () => {
    setEditData(prev => ({ ...prev, meals: [...prev.meals, { label: '', time: '', items: [] }] }))
  }
  const removeMeal = mealIdx => {
    setEditData(prev => ({ ...prev, meals: prev.meals.filter((_, i) => i !== mealIdx) }))
  }
  const addItem = mealIdx => {
    setEditData(prev => {
      const meals = prev.meals.map((m, i) =>
        i === mealIdx ? { ...m, items: [...m.items, { food: '', qty: '', unit: '', protein: '', carbs: '', fat: '' }] } : m
      )
      return { ...prev, meals }
    })
  }
  const removeItem = (mealIdx, itemIdx) => {
    setEditData(prev => {
      const meals = prev.meals.map((m, i) =>
        i === mealIdx ? { ...m, items: m.items.filter((_, j) => j !== itemIdx) } : m
      )
      return { ...prev, meals }
    })
  }
  const saveEdit = async () => {
    try {
      const res = await axios.patch(`/api/meals/${editData._id}`, editData)
      if (onSave) onSave(res.data, editing)
      setEditing(null)
      setEditData({})
      showDialog('Success', 'Meal plan saved successfully.', 'success')
    } catch (err) {
      showDialog('Error', 'Failed to save meal plan.', 'error')
    }
  }
  
  const confirmDeletePlan = (id) => {
    showDialog(
      'Confirm Deletion',
      'Are you sure you want to delete this meal plan? This action cannot be undone.',
      'warning',
      () => deletePlan(id),
      true
    )
  }
  
  const deletePlan = async (id) => {
    try {
      await axios.delete(`/api/meals/${id}`)
      if (onSave) onSave(null, null)
      showDialog('Success', 'Meal plan deleted successfully.', 'success')
    } catch (err) {
      showDialog('Error', 'Failed to delete meal plan.', 'error')
    }
  }

  // --- Add logic ---
  const handleNewPlanChange = (field, value) => {
    setNewPlan(prev => ({ ...prev, [field]: value }))
  }
  const addNewMeal = () => {
    setNewPlan(prev => ({ ...prev, meals: [...prev.meals, { label: '', time: '', items: [] }] }))
  }
  const removeNewMeal = mealIdx => {
    setNewPlan(prev => ({ ...prev, meals: prev.meals.filter((_, i) => i !== mealIdx) }))
  }
  const addNewItem = mealIdx => {
    setNewPlan(prev => {
      const meals = prev.meals.map((m, i) =>
        i === mealIdx ? { ...m, items: [...m.items, { food: '', qty: '', unit: '', protein: '', carbs: '', fat: '' }] } : m
      )
      return { ...prev, meals }
    })
  }
  const removeNewItem = (mealIdx, itemIdx) => {
    setNewPlan(prev => {
      const meals = prev.meals.map((m, i) =>
        i === mealIdx ? { ...m, items: m.items.filter((_, j) => j !== itemIdx) } : m
      )
      return { ...prev, meals }
    })
  }
  const handleNewMealChange = (mealIdx, field, value) => {
    setNewPlan(prev => {
      const meals = prev.meals.map((m, i) => i === mealIdx ? { ...m, [field]: value } : m)
      return { ...prev, meals }
    })
  }
  const handleNewItemChange = (mealIdx, itemIdx, field, value) => {
    setNewPlan(prev => {
      const meals = prev.meals.map((m, i) => {
        if (i !== mealIdx) return m
        const items = m.items.map((it, j) => j === itemIdx ? { ...it, [field]: value } : it)
        return { ...m, items }
      })
      return { ...prev, meals }
    })
  }
  const saveNewPlan = async () => {
    try {
      const res = await axios.post('/api/meals', newPlan)
      if (onSave) onSave(res.data, null)
      setNewPlan({ day: '', meals: [] })
      setAdding(false)
      showDialog('Success', 'New meal plan added successfully.', 'success')
    } catch (err) {
      showDialog('Error', 'Failed to add meal plan.', 'error')
    }
  }

  const addMealToExistingDay = (planIdx) => {
    setEditing(planIdx)
    const planToEdit = JSON.parse(JSON.stringify(mealPlans[planIdx]))
    planToEdit.meals.push({ label: '', time: '', items: [] })
    setEditData(planToEdit)
  }

  const timeInputStyle = {
    padding: '.25rem .5rem',
    borderRadius: 4,
    border: '1px solid #444',
    backgroundColor: '#2c2e33',
    color: 'white',
    marginRight: '.5rem'
  }

  // Custom Dialog Component
  const CustomDialog = () => {
    if (!dialog.isOpen) return null;
    
    // Define colors based on type
    const colors = {
      error: '#ff4d4f',
      success: '#21e6c1',
      warning: '#faad14',
      info: '#1890ff'
    };

    const overlayStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    };

    const dialogStyle = {
      backgroundColor: '#23252b',
      borderRadius: 8,
      padding: '1.5rem',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      color: '#fff'
    };

    const titleStyle = {
      color: colors[dialog.type],
      marginTop: 0,
      marginBottom: '1rem',
      fontSize: '1.25rem',
      fontWeight: 600
    };

    const messageStyle = {
      marginBottom: '1.5rem',
      lineHeight: 1.5
    };

    const buttonStyle = {
      backgroundColor: colors[dialog.type],
      color: dialog.type === 'success' ? '#18191d' : '#fff',
      border: 'none',
      borderRadius: 4,
      padding: '.5rem 1.5rem',
      fontWeight: 700,
      cursor: 'pointer',
      marginLeft: '0.5rem'
    };
    
    const buttonContainerStyle = {
      display: 'flex',
      justifyContent: 'flex-end'
    };
    
    const cancelButtonStyle = {
      backgroundColor: '#444',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      padding: '.5rem 1.5rem',
      fontWeight: 700,
      cursor: 'pointer'
    };
    
    const handleConfirm = () => {
      if (dialog.onConfirm) dialog.onConfirm();
      closeDialog();
    };

    return (
      <div style={overlayStyle} onClick={dialog.isConfirmation ? null : closeDialog}>
        <div style={dialogStyle} onClick={e => e.stopPropagation()}>
          <h3 style={titleStyle}>{dialog.title}</h3>
          <p style={messageStyle}>{dialog.message}</p>
          <div style={buttonContainerStyle}>
            {dialog.isConfirmation && (
              <button style={cancelButtonStyle} onClick={closeDialog}>Cancel</button>
            )}
            <button 
              style={buttonStyle} 
              onClick={dialog.isConfirmation ? handleConfirm : closeDialog}
            >
              {dialog.isConfirmation ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Edit Meal Plans</h2>
      <button onClick={() => setAdding(a => !a)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{adding ? 'Cancel New' : 'Add New Day'}</button>
      {adding && (
        <div style={{ background: '#23252b', color: '#fff', borderRadius: 8, margin: '1rem 0', padding: '1rem' }}>
          <input
            value={newPlan.day}
            onChange={e => handleNewPlanChange('day', e.target.value)}
            placeholder="Day Title"
            style={{ marginBottom: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444', width: '100%' }}
          />
          {newPlan.meals.map((meal, mi) => (
            <div key={mi} style={{ margin: '1rem 0', padding: '.5rem', background: '#18191d', borderRadius: 6 }}>
              <input
                value={meal.label}
                onChange={e => handleNewMealChange(mi, 'label', e.target.value)}
                placeholder="Meal Label"
                style={{ marginRight: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }}
              />
              <input
                type="time"
                value={meal.time}
                onChange={e => handleNewMealChange(mi, 'time', e.target.value)}
                style={timeInputStyle}
              />
              <button onClick={() => removeNewMeal(mi)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginLeft: '.5rem' }}>Delete Meal</button>
              {meal.items.map((item, ii) => (
                <div key={ii} style={{ margin: '.25rem 0', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  <input value={item.food} onChange={e => handleNewItemChange(mi, ii, 'food', e.target.value)} placeholder="Food" style={{ flex: 2, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={item.qty} onChange={e => handleNewItemChange(mi, ii, 'qty', e.target.value)} placeholder="Qty" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={item.unit} onChange={e => handleNewItemChange(mi, ii, 'unit', e.target.value)} placeholder="Unit" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={item.protein} onChange={e => handleNewItemChange(mi, ii, 'protein', e.target.value)} placeholder="Protein" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={item.carbs} onChange={e => handleNewItemChange(mi, ii, 'carbs', e.target.value)} placeholder="Carbs" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <input value={item.fat} onChange={e => handleNewItemChange(mi, ii, 'fat', e.target.value)} placeholder="Fat" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                  <button onClick={() => removeNewItem(mi, ii)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem' }}>Delete</button>
                </div>
              ))}
              <button onClick={() => addNewItem(mi)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Item</button>
            </div>
          ))}
          <button onClick={addNewMeal} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Meal</button>
          <button onClick={saveNewPlan} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', marginLeft: '.5rem', fontWeight: 700 }}>Save New Day</button>
        </div>
      )}
      {mealPlans.map((plan, idx) => (
        <div key={idx} style={{ background: '#23252b', color: '#fff', borderRadius: 8, margin: '1rem 0', padding: '1rem' }}>
          {editing === idx ? (
            <div>
              <input
                value={editData.day}
                onChange={e => handleChange('day', e.target.value)}
                style={{ marginBottom: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444', width: '100%' }}
              />
              {editData.meals.map((meal, mi) => (
                <div key={mi} style={{ margin: '1rem 0', padding: '.5rem', background: '#18191d', borderRadius: 6 }}>
                  <input
                    value={meal.label}
                    onChange={e => handleMealChange(mi, 'label', e.target.value)}
                    style={{ marginRight: '.5rem', padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }}
                  />
                  <input
                    type="time"
                    value={meal.time}
                    onChange={e => handleMealChange(mi, 'time', e.target.value)}
                    style={timeInputStyle}
                  />
                  <button onClick={() => removeMeal(mi)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginLeft: '.5rem' }}>Delete Meal</button>
                  {meal.items.map((item, ii) => (
                    <div key={ii} style={{ margin: '.25rem 0', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                      <input value={item.food} onChange={e => handleItemChange(mi, ii, 'food', e.target.value)} placeholder="Food" style={{ flex: 2, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={item.qty} onChange={e => handleItemChange(mi, ii, 'qty', e.target.value)} placeholder="Qty" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={item.unit} onChange={e => handleItemChange(mi, ii, 'unit', e.target.value)} placeholder="Unit" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={item.protein} onChange={e => handleItemChange(mi, ii, 'protein', e.target.value)} placeholder="Protein" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={item.carbs} onChange={e => handleItemChange(mi, ii, 'carbs', e.target.value)} placeholder="Carbs" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <input value={item.fat} onChange={e => handleItemChange(mi, ii, 'fat', e.target.value)} placeholder="Fat" style={{ flex: 1, padding: '.25rem .5rem', borderRadius: 4, border: '1px solid #444' }} />
                      <button onClick={() => removeItem(mi, ii)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.25rem .75rem' }}>Delete</button>
                    </div>
                  ))}
                  <button onClick={() => addItem(mi)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Item</button>
                </div>
              ))}
              <button onClick={addMeal} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.25rem .75rem', marginTop: '.5rem' }}>Add Meal</button>
              <button onClick={saveEdit} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', marginLeft: '.5rem', fontWeight: 700 }}>Save</button>
              <button onClick={cancelEdit} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem' }}>Cancel</button>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{plan.day}</div>
              {plan.meals.map((meal, mi) => (
                <div key={mi} style={{ margin: '.5rem 0', color: '#aaa' }}>
                  {meal.label} • {meal.time}
                  <ul style={{ margin: '.25rem 0 .25rem 1.5rem' }}>
                    {meal.items.map((item, ii) => (
                      <li key={ii}>{item.food} — {item.qty} {item.unit} (P:{item.protein} C:{item.carbs} F:{item.fat})</li>
                    ))}
                  </ul>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => startEdit(idx)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', fontWeight: 700 }}>Edit</button>
                <button onClick={() => addMealToExistingDay(idx)} style={{ background: '#21e6c1', color: '#18191d', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', fontWeight: 700, marginLeft: '.5rem' }}>Add New Meal</button>
                <button onClick={() => confirmDeletePlan(plan._id)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '.5rem 1.5rem', marginLeft: '.5rem' }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Custom Dialog */}
      <CustomDialog />
    </div>
  )
} 