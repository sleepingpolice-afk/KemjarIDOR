const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    const users = [
        {
            id: 1,
            fullName: "John Doe",
            username: "johndoe",
            email: "user1@example.com",
            phone: "+1-555-0101",
            address: "123 Main St, New York, NY 10001",
            password: 'password123'
        },
        {
            id: 2,
            fullName: "Jane Smith",
            username: "janesmith",
            email: "user2@example.com",
            phone: "+1-555-0102",
            address: "456 Oak Ave, Los Angeles, CA 90001",
            password: 'password456'
        },
        {
            id: 3,
            fullName: "Bob Johnson",
            username: "bobjohnson",
            email: "user3@example.com",
            phone: "+1-555-0103",
            address: "789 Pine Rd, Chicago, IL 60601",
            password: 'password789'
        },
        {
            id: 4,
            fullName: "Alice Brown",
            username: "alicebrown",
            email: "user4@example.com",
            phone: "+1-555-0104",
            address: "321 Elm St, Houston, TX 77001",
            password: 'password123'
        },
        {
            id: 5,
            fullName: "Charlie Davis",
            username: "charliedavis",
            email: "user5@example.com",
            phone: "+1-555-0105",
            address: "654 Maple Dr, Phoenix, AZ 85001",
            password: 'password123'
        },
    ]

    const DEFAULT_PASSWORD = 'password123'

    for (const u of users) {
        const rawPassword = u.password || DEFAULT_PASSWORD
        const hashed = await bcrypt.hash(rawPassword, 10)
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                password: hashed,
                fullName: u.fullName,
                username: u.username,
                phone: u.phone,
                address: u.address
            }
        })
    }

    console.log('Seed finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
