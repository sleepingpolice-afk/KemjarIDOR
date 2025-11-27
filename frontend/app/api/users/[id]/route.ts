export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // This endpoint returns user data for ANY user ID without verifying permissions
    // In production, you should:
    // 1. Verify the authenticated user's session/token
    // 2. Check if the authenticated user has permission to access this specific user's data
    // 3. Only return data if user ID matches the authenticated user

    const users = [
      {
        id: 1,
        fullName: "John Doe",
        username: "johndoe",
        email: "user1@example.com",
        phone: "+1-555-0101",
        address: "123 Main St, New York, NY 10001",
      },
      {
        id: 2,
        fullName: "Jane Smith",
        username: "janesmith",
        email: "user2@example.com",
        phone: "+1-555-0102",
        address: "456 Oak Ave, Los Angeles, CA 90001",
      },
      {
        id: 3,
        fullName: "Bob Johnson",
        username: "bobjohnson",
        email: "user3@example.com",
        phone: "+1-555-0103",
        address: "789 Pine Rd, Chicago, IL 60601",
      },
      {
        id: 4,
        fullName: "Alice Brown",
        username: "alicebrown",
        email: "user4@example.com",
        phone: "+1-555-0104",
        address: "321 Elm St, Houston, TX 77001",
      },
      {
        id: 5,
        fullName: "Charlie Davis",
        username: "charliedavis",
        email: "user5@example.com",
        phone: "+1-555-0105",
        address: "654 Maple Dr, Phoenix, AZ 85001",
      },
    ]

    const userId = Number.parseInt(id, 10)
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      user,
    })
  } catch (error) {
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
