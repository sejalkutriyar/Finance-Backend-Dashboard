const transactionService = require('../services/transaction.service')
const { 
  createTransactionSchema, 
  updateTransactionSchema,
  filterSchema 
} = require('../validators/transaction.validator')

const createTransaction = async (req, res, next) => {
  try {
    const validated = createTransactionSchema.parse(req.body)
    const transaction = await transactionService.createTransaction(
      validated, 
      req.user.id
    )
    res.status(201).json({ success: true, data: transaction })
  } catch (err) {
    next(err)
  }
}

const getAllTransactions = async (req, res, next) => {
  try {
    const filters = filterSchema.parse(req.query)
    const result = await transactionService.getAllTransactions(
      filters,
      req.user.role,
      req.user.id
    )
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user.role,
      req.user.id
    )
    res.status(200).json({ success: true, data: transaction })
  } catch (err) {
    next(err)
  }
}

const updateTransaction = async (req, res, next) => {
  try {
    const validated = updateTransactionSchema.parse(req.body)
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      validated,
      req.user.role,
      req.user.id
    )
    res.status(200).json({ success: true, data: transaction })
  } catch (err) {
    next(err)
  }
}

const deleteTransaction = async (req, res, next) => {
  try {
    const result = await transactionService.deleteTransaction(
      req.params.id,
      req.user.role
    )
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
}