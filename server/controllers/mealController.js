const MealPlan = require('../models/MealPlan');

const getMeals = async (req, res) => {
  try {
    const meals = await MealPlan.find({ user_id: req.user.id });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createMealPlan = async (req, res) => {
  try {
    const { day, meals } = req.body;
    const newMealPlan = new MealPlan({
      user_id: req.user.id,
      day,
      meals
    });
    const savedMealPlan = await newMealPlan.save();
    res.status(201).json(savedMealPlan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateMealPlan = async (req, res) => {
  try {
    const updated = await MealPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMealPlan = async (req, res) => {
  try {
    const deleted = await MealPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Meal plan not found' });
    res.json({ message: 'Meal plan deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getMeals,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan
};