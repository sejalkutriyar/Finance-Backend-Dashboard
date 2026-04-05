const express = require('express')
const router = express.Router()
const {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentActivity
} = require('../controllers/dashboard.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

// Sabhi routes protected hain
router.use(authenticate)

// VIEWER sirf summary dekh sakta hai
router.get('/summary', getSummary)

// ANALYST aur ADMIN ke liye
router.get('/categories', authorize('ANALYST', 'ADMIN'), getCategoryWiseTotals)
router.get('/trends', authorize('ANALYST', 'ADMIN'), getMonthlyTrends)
router.get('/recent', authorize('ANALYST', 'ADMIN'), getRecentActivity)

module.exports = router