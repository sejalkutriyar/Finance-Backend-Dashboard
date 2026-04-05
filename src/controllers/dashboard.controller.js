const dashboardService = require('../services/dashboard.service')

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary(
      req.user.role,
      req.user.id
    )
    res.status(200).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

const getCategoryWiseTotals = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryWiseTotals(
      req.user.role,
      req.user.id
    )
    res.status(200).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyTrends(
      req.user.role,
      req.user.id
    )
    res.status(200).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

const getRecentActivity = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecentActivity(
      req.user.role,
      req.user.id
    )
    res.status(200).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentActivity
}