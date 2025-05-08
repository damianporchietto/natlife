const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const workoutController = require('../controllers/workoutController');

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - name
 *         - sets
 *         - reps
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the exercise
 *         sets:
 *           type: number
 *           description: Number of sets
 *         reps:
 *           type: number
 *           description: Number of repetitions
 *         weight:
 *           type: number
 *           description: Weight in kg (optional)
 *     WorkoutDay:
 *       type: object
 *       properties:
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *     WorkoutPlan:
 *       type: object
 *       required:
 *         - name
 *         - days
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the workout plan
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkoutDay'
 */

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workout plans
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workout plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutPlan'
 *       401:
 *         description: Unauthorized
 */
router.get('/', workoutController.getWorkouts);

/**
 * @swagger
 * /api/workouts/{planId}/day/{dayIndex}/ex/{exIndex}:
 *   patch:
 *     summary: Update a specific exercise in a workout plan
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout plan ID
 *       - in: path
 *         name: dayIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the day in the plan
 *       - in: path
 *         name: exIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the exercise in the day
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *       404:
 *         description: Workout plan, day, or exercise not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:planId/day/:dayIndex/ex/:exIndex', workoutController.updateExercise);

/**
 * @swagger
 * /api/workouts/{id}:
 *   patch:
 *     summary: Update a workout plan
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutPlan'
 *     responses:
 *       200:
 *         description: Workout plan updated successfully
 *       404:
 *         description: Workout plan not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', workoutController.updateWorkoutPlan);

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout plan
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutPlan'
 *     responses:
 *       201:
 *         description: Workout plan created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', workoutController.createWorkoutPlan);

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete a workout plan
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout plan ID
 *     responses:
 *       200:
 *         description: Workout plan deleted successfully
 *       404:
 *         description: Workout plan not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', workoutController.deleteWorkoutPlan);

module.exports = router;