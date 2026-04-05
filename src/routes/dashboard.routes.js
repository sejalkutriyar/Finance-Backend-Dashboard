const express = require('express')
const router = express.Router()
const {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentActivity
} = require('../controllers/dashboard.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

router.use(authenticate)

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expense and net balance
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Summary data
 */
router.get('/summary', getSummary)

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get category-wise totals (ANALYST, ADMIN)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Category wise totals
 */
router.get('/categories', authorize('ANALYST', 'ADMIN'), getCategoryWiseTotals)

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends for last 6 months (ANALYST, ADMIN)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Monthly trends data
 */
router.get('/trends', authorize('ANALYST', 'ADMIN'), getMonthlyTrends)

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent 10 transactions (ANALYST, ADMIN)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Recent transactions
 */
router.get('/recent', authorize('ANALYST', 'ADMIN'), getRecentActivity)

module.exports = router