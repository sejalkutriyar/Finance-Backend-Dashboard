const userService = require('../services/user.service')
const { updateUserSchema } = require('../validators/user.validator')

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers()
    res.status(200).json({ success: true, data: users })
  } catch (err) {
    next(err)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const validated = updateUserSchema.parse(req.body)
    const user = await userService.updateUser(req.params.id, validated)
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser }