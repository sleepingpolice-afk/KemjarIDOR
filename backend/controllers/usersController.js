const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getUser = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10)
        const user = await prisma.user.findUnique({ where: { id } })

        if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
        }

        const { password, ...userWithoutPassword } = user
        return res.json({ success: true, user: userWithoutPassword })
    } catch (err) {
        console.error('Get user error:', err)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
