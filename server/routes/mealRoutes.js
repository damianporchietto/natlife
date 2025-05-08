const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const mealController = require('../controllers/mealController');

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     MealPlan:
 *       type: object
 *       required:
 *         - name
 *         - meals
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the meal plan
 *         meals:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               calories:
 *                 type: number
 *               protein:
 *                 type: number
 *               carbs:
 *                 type: number
 *               fat:
 *                 type: number
 */

/**
 * @swagger
 * /api/meals:
 *   get:
 *     summary: Get all meal plans
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of meal plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MealPlan'
 *       401:
 *         description: Unauthorized
 */
router.get('/', mealController.getMeals);

/**
 * @swagger
 * /api/meals:
 *   post:
 *     summary: Create a new meal plan
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealPlan'
 *     responses:
 *       201:
 *         description: Meal plan created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', mealController.createMealPlan);

/**
 * @swagger
 * /api/meals/{id}:
 *   patch:
 *     summary: Update a meal plan by ID
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealPlan'
 *     responses:
 *       200:
 *         description: Meal plan updated successfully
 *       404:
 *         description: Meal plan not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', mealController.updateMealPlan);

/**
 * @swagger
 * /api/meals/{id}:
 *   delete:
 *     summary: Delete a meal plan by ID
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal plan ID
 *     responses:
 *       200:
 *         description: Meal plan deleted successfully
 *       404:
 *         description: Meal plan not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', mealController.deleteMealPlan);

module.exports = router;