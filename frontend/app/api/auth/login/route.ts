export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // This demonstrates a simulated user database
    const users = [
      {
        id: 1,
        email: "user1@example.com",
        password: "password123",
        fullName: "John Doe",
        username: "johndoe",
        phone: "+1-555-0101",
        address: "123 Main St, New York, NY 10001",
      },
      {
        id: 2,
        email: "user2@example.com",
        password: "password456",
        fullName: "Jane Smith",
        username: "janesmith",
        phone: "+1-555-0102",
        address: "456 Oak Ave, Los Angeles, CA 90001",
      },
      {
        id: 3,
        email: "user3@example.com",
        password: "password789",
        fullName: "Bob Johnson",
        username: "bobjohnson",
        phone: "+1-555-0103",
        address: "789 Pine Rd, Chicago, IL 60601",
      },
    ]

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return Response.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return Response.json({
      success: true,
      userId: user.id,
      user: userWithoutPassword,
    })
  } catch (error) {
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
