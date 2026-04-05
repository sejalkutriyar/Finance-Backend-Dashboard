const authService = require('../services/auth.service')
const { registerSchema, loginSchema } = require('../validators/auth.validator')

const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body)
    const result = await authService.register(validated)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body)
    const result = await authService.login(validated)
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login }