const MealPlan = require('../models/MealPlan');
const WorkoutPlan = require('../models/WorkoutPlan');

const generateMealsCsv = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user_id: req.user.id });
    
    if (!mealPlans.length) {
      return res.status(404).json({ error: 'No meal plans found' });
    }
    
    let csv = 'Day,Label,Time,Food,Quantity,Unit,Protein,Carbs,Fat\n';
    
    mealPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        meal.items.forEach(item => {
          csv += `"${plan.day}","${meal.label}","${meal.time}","${item.food}","${item.qty}","${item.unit}","${item.protein}","${item.carbs}","${item.fat}"\n`;
        });
      });
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=meals_report.csv');
    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Generate workout report in CSV format
const generateWorkoutCsv = async (req, res) => {
  try {
    const { planId } = req.params;
    let query = { user_id: req.user.id };
    
    if (planId) {
      query._id = planId;
    }
    
    const workoutPlans = await WorkoutPlan.find(query);
    
    if (!workoutPlans.length) {
      return res.status(404).json({ error: 'No workout plans found' });
    }
    
    let csv = 'Day,Exercise,Weight,Reps,Sets\n';
    
    workoutPlans.forEach(plan => {
      plan.days.forEach(day => {
        day.exercises.forEach(exercise => {
          csv += `"${plan.title} - ${day.title}","${exercise.name}","${exercise.currentWeight || exercise.weight}","${exercise.currentReps || exercise.reps}","${exercise.sets}"\n`;
        });
      });
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=workouts_report.csv');
    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  generateMealsCsv,
  generateWorkoutCsv
}; 