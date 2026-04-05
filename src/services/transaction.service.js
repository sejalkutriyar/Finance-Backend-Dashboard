const prisma = require('../prisma')

const createTransaction = async (data, userId) => {
  return await prisma.transaction.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes || null,
      userId
    }
  })
}

const getAllTransactions = async (filters, userRole, userId) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = '1',
    limit = '10'
  } = filters

  const where = { isDeleted: false }

  // VIEWER aur ANALYST sirf apni transactions dekh sakte hain
  if (userRole === 'VIEWER' || userRole === 'ANALYST') {
    where.userId = userId
  }

  if (type) where.type = type
  if (category) where.category = { contains: category, mode: 'insensitive' }
  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = new Date(startDate)
    if (endDate) where.date.lte = new Date(endDate)
  }

  const pageNum = parseInt(page)
  const limitNum = parseInt(limit)
  const skip = (pageNum - 1) * limitNum

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limitNum,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    }),
    prisma.transaction.count({ where })
  ])

  return {
    transactions,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }
}

const getTransactionById = async (id, userRole, userId) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: parseInt(id),
      isDeleted: false
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  if (!transaction) {
    const error = new Error('Transaction not found')
    error.status = 404
    throw error
  }

  // VIEWER sirf apni transaction dekh sakta hai
  if (userRole === 'VIEWER' && transaction.userId !== userId) {
    const error = new Error('Access denied')
    error.status = 403
    throw error
  }

  return transaction
}

const updateTransaction = async (id, data, userRole, userId) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: parseInt(id), isDeleted: false }
  })

  if (!transaction) {
    const error = new Error('Transaction not found')
    error.status = 404
    throw error
  }

  // Sirf ADMIN update kar sakta hai
  if (userRole !== 'ADMIN') {
    const error = new Error('Access denied. Only ADMIN can update transactions')
    error.status = 403
    throw error
  }

  return await prisma.transaction.update({
    where: { id: parseInt(id) },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined
    }
  })
}

const deleteTransaction = async (id, userRole) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: parseInt(id), isDeleted: false }
  })

  if (!transaction) {
    const error = new Error('Transaction not found')
    error.status = 404
    throw error
  }

  // Sirf ADMIN delete kar sakta hai
  if (userRole !== 'ADMIN') {
    const error = new Error('Access denied. Only ADMIN can delete transactions')
    error.status = 403
    throw error
  }

  // Soft delete
  await prisma.transaction.update({
    where: { id: parseInt(id) },
    data: { isDeleted: true }
  })

  return { message: 'Transaction deleted successfully' }
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
}