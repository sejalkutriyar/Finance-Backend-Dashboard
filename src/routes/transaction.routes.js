const express = require('express')
const router = express.Router()
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transaction.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

// Sabhi routes protected hain
router.use(authenticate)

// VIEWER bhi dekh sakta hai (apni transactions)
router.get('/', getAllTransactions)
router.get('/:id', getTransactionById)

// ANALYST aur ADMIN create kar sakte hain
router.post('/', authorize('ANALYST', 'ADMIN'), createTransaction)

// Sirf ADMIN update aur delete kar sakta hai
router.put('/:id', authorize('ADMIN'), updateTransaction)
router.delete('/:id', authorize('ADMIN'), deleteTransaction)

module.exports = router