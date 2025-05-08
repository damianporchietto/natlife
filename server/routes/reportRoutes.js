const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Apply auth middleware to all report routes
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: string
 *           description: CSV data as a string
 *         filename:
 *           type: string
 *           description: Suggested filename for the report
 */

/**
 * @swagger
 * /api/reports/meals:
 *   get:
 *     summary: Generate meals report in CSV format
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV report generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=meals-report.csv
 *       401:
 *         description: Unauthorized
 */
router.get('/meals', reportController.generateMealsCsv);

/**
 * @swagger
 * /api/reports/workouts:
 *   get:
 *     summary: Generate all workouts report in CSV format
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV report generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=workouts-report.csv
 *       401:
 *         description: Unauthorized
 */
router.get('/workouts', reportController.generateWorkoutCsv);

/**
 * @swagger
 * /api/reports/workouts/{planId}:
 *   get:
 *     summary: Generate specific workout plan report in CSV format
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout plan ID
 *     responses:
 *       200:
 *         description: CSV report generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=workout-plan-report.csv
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout plan not found
 */
router.get('/workouts/:planId', reportController.generateWorkoutCsv);

module.exports = router; 