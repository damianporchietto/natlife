const mongoose = require('mongoose');

const Item = new mongoose.Schema({
    food: String, 
    qty: Number, 
    unit: String,
    protein: Number,
    carbs: Number,
    fat: Number
}, {_id: false, versionKey: false});

const Meal = new mongoose.Schema({
    time: String, 
    label: String, 
    items: [Item]
}, {_id: false, versionKey: false});

const MealPlan = mongoose.model(
    'MealPlan', 
    new mongoose.Schema({
        user_id: mongoose.Schema.Types.ObjectId, 
        day: String, 
        meals: [Meal]
    }, {versionKey: false}));

module.exports = MealPlan;