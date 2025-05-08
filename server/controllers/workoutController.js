const WorkoutPlan = require('../models/WorkoutPlan');

const getWorkouts = async (req, res) => {
  const plans = await WorkoutPlan.find({ user_id: req.user.id });
  res.json(plans);
};

const updateExercise = async (req, res) => {
  const { planId, dayIndex, exIndex } = req.params;
  const { weight, reps } = req.body;
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) return res.status(404).json({message: 'plan not found'});
  const ex = plan.days[dayIndex]?.exercises[exIndex];
  if (!ex) return res.status(404).json({message: 'exercise not found'});
  ex.currentWeight = weight;
  ex.currentReps = reps;
  await plan.save();
  res.json(ex);
};

const updateWorkoutPlan = async (req, res) => {
  try {
    const updated = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Workout plan not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createWorkoutPlan = async (req, res) => {
  try {
    const plan = new WorkoutPlan(Object.assign(req.body, { user_id: req.user.id }));
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const deleted = await WorkoutPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Workout plan not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getWorkouts,
  updateExercise,
  updateWorkoutPlan,
  createWorkoutPlan,
  deleteWorkoutPlan
};