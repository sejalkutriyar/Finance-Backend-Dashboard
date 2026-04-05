const prisma = require('../prisma')

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  })
}

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  })

  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  return user
}

const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({ 
    where: { id: parseInt(id) } 
  })
  
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  return await prisma.user.update({
    where: { id: parseInt(id) },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true
    }
  })
}

const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ 
    where: { id: parseInt(id) } 
  })

  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  await prisma.user.delete({ where: { id: parseInt(id) } })
  return { message: 'User deleted successfully' }
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser }