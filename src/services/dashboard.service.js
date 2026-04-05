const prisma = require('../prisma')

const getSummary = async (userRole, userId) => {
  const where = { isDeleted: false }
  
  // VIEWER aur ANALYST sirf apna data dekh sakte hain
  if (userRole === 'VIEWER' || userRole === 'ANALYST') {
    where.userId = userId
  }

  const [incomeData, expenseData] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true },
      _count: true
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
      _count: true
    })
  ])

  const totalIncome = incomeData._sum.amount || 0
  const totalExpense = expenseData._sum.amount || 0

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalTransactions: incomeData._count + expenseData._count
  }
}

const getCategoryWiseTotals = async (userRole, userId) => {
  const where = { isDeleted: false }

  if (userRole === 'VIEWER' || userRole === 'ANALYST') {
    where.userId = userId
  }

  const categories = await prisma.transaction.groupBy({
    by: ['category', 'type'],
    where,
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: 'desc' } }
  })

  return categories.map(c => ({
    category: c.category,
    type: c.type,
    total: c._sum.amount || 0,
    count: c._count
  }))
}

const getMonthlyTrends = async (userRole, userId) => {
  const where = { isDeleted: false }

  if (userRole === 'VIEWER' || userRole === 'ANALYST') {
    where.userId = userId
  }

  // Last 6 months ki transactions
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  where.date = { gte: sixMonthsAgo }

  const transactions = await prisma.transaction.findMany({
    where,
    select: {
      amount: true,
      type: true,
      date: true
    },
    orderBy: { date: 'asc' }
  })

  // Month wise group karo
  const monthlyMap = {}

  transactions.forEach(t => {
    const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: key, income: 0, expense: 0 }
    }

    if (t.type === 'INCOME') {
      monthlyMap[key].income += t.amount
    } else {
      monthlyMap[key].expense += t.amount
    }
  })

  return Object.values(monthlyMap)
}

const getRecentActivity = async (userRole, userId) => {
  const where = { isDeleted: false }

  if (userRole === 'VIEWER' || userRole === 'ANALYST') {
    where.userId = userId
  }

  return await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  })
}

module.exports = {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentActivity
}