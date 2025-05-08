import React, { useState, useContext } from 'react'
import axios from 'axios'
import { ThemeContext } from '../context/ThemeContext'

export default function Meals ({ mealPlans = [] }) {
  const [active, setActive] = useState(0)
  const { colors } = useContext(ThemeContext)

  if (!mealPlans.length) return (
    <div className="empty-state">
      <p>No meal plans available. Add a meal plan to get started.</p>
    </div>
  )

  const DayTabs = () => (
    <div className="day-tabs">
      {mealPlans.map((p, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={`day-tab ${active === i ? 'active' : ''}`}
        >
          {p.day}
        </button>
      ))}
    </div>
  )

  const MealCards = ({ meals }) => (
    <div className="meal-cards">
      {meals.map((m, i) => (
        <div
          key={i}
          className="meal-card"
        >
          <div className="meal-header">
            {m.label} • {m.time}
          </div>
          <table className="meal-table">
            <thead>
              <tr>
                <th>Food</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
              </tr>
            </thead>
            <tbody>
              {m.items.map((it, j) => (
                <tr key={j}>
                  <td>{it.food}</td>
                  <td>{it.qty}</td>
                  <td>{it.unit}</td>
                  <td>{it.protein}</td>
                  <td>{it.carbs}</td>
                  <td>{it.fat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <DayTabs />
      <MealCards meals={mealPlans[active].meals} />
    </div>
  )
}
