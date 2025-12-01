const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUserProfile = async (req, res) => {
    try {
        const requestedId = parseInt(req.params.id); // ID from URL
        const loggedInUserId = req.user.id;          // ID from Token (who they are)


        if (requestedId !== loggedInUserId) {
            return res.status(403).json({ 
                success: false, 
                message: "Forbidden: You cannot view this profile." 
            });
        }

        const user = await prisma.user.findUnique({ where: { id: requestedId } });
        const { password, ...cleanUser } = user;
        return res.json({ success: true, data: cleanUser });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};