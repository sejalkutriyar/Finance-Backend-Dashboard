const express = require('express')
const router = express.Router()
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller')
const { authenticate, authorize } = require('../middleware/auth.middleware')

// Sabhi routes ke liye authentication zaroori hai
router.use(authenticate)

// Sirf ADMIN dekh sakta hai sab users
router.get('/', authorize('ADMIN'), getAllUsers)

// Apna profile dekh sakta hai koi bhi, ADMIN kisi ka bhi
router.get('/:id', getUserById)

// Sirf ADMIN update aur delete kar sakta hai
router.put('/:id', authorize('ADMIN'), updateUser)
router.delete('/:id', authorize('ADMIN'), deleteUser)

module.exports = router