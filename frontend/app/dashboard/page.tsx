"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, LogOut, Edit2 } from "lucide-react"

interface UserData {
  id: number
  fullName: string
  username: string
  email: string
  phone: string
  address: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [eidtUserId, setEditUserId] = useState("")

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (!storedUserId) {
      router.push("/")
      return
    }

    setUserId(storedUserId)
    setEditUserId(storedUserId)
    fetchUserData(storedUserId)
  }, [router])

  const fetchUserData = async (id: string) => {
    setLoading(true)
    setError("")

    try {
      // without proper authorization checks. Any user can change the ID and fetch other users' data
      const response = await fetch(`/api/users/${id}`)
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      } else {
        setError(data.message || "Failed to fetch user data")
      }
    } catch (err) {
      setError("An error occurred while fetching user data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleIdorTest = () => {
    if (eidtUserId) {
      setEditUserId(eidtUserId)
      fetchUserData(eidtUserId)
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading user data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">User Dashboard</h1>
            <p className="text-slate-600 mt-1">Logged in as User ID: {userId}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {user && (
          <>
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>User data fetched from the database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Full Name</p>
                    <p className="text-lg text-slate-900 font-semibold">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Username</p>
                    <p className="text-lg text-slate-900 font-semibold">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Email</p>
                    <p className="text-lg text-slate-900 font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Phone</p>
                    <p className="text-lg text-slate-900 font-semibold">{user.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-slate-600">Address</p>
                    <p className="text-lg text-slate-900 font-semibold">{user.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
