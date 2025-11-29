const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const { password: _, ...userWithoutPassword } = user
    return res.json({ success: true, userId: user.id, user: userWithoutPassword })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, username, phone, address } = req.body
    if (!email || !password || !fullName || !username) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        username,
        phone,
        address
      }
    })
    const { password: _, ...userWithoutPassword } = newUser
    return res.status(201).json({ success: true, userId: newUser.id, user: userWithoutPassword })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}