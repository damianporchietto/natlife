const mongoose = require('mongoose');

const Exercise = new mongoose.Schema({
  name: String,
  suggestedWeight: Number,
  suggestedReps: Number,
  currentWeight: Number,
  currentReps: Number
}, {_id: false, versionKey: false});

const Day = new mongoose.Schema({
  title: String, 
  exercises: [Exercise]
}, {_id: false, versionKey: false});

const WorkoutPlan = mongoose.model(
  'WorkoutPlan', 
  new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId, 
    title: String, 
    days: [Day]}, {versionKey: false}));

module.exports = WorkoutPlan;