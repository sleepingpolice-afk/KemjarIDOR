"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, LogOut, User, Mail, Phone, MapPin } from "lucide-react"

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

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    const storedToken = localStorage.getItem("token")

    if (!storedUserId || !storedToken) {
      router.push("/")
      return
    }

    setUserId(storedUserId)
    fetchUserData(storedUserId, storedToken)
  }, [router])

  const fetchUserData = async (id: string, token: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:4000/api/users/${id}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
      })

      // If token is expired or invalid, force logout
      if (response.status === 401 || response.status === 403) {
        setError("Session expired or access denied.")
        setTimeout(handleLogout, 2000) // Redirect after showing error
        return
      }

      const data = await response.json()

      if (data.success) {
        setUser(data.user || data.data) // Check if your backend sends 'user' or 'data'
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
    // Don't forget to remove the token too!
    localStorage.removeItem("token") 
    router.push("/")
  }

  if (loading && !user && !error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-slate-400 animate-pulse">Accessing secure database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">User Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
                Logged in as ID: {userId}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Main Profile Card */}
        <Card className="bg-slate-900 border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Personal data retrieved from secure server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex gap-3 text-red-200 items-start">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
                <div>
                  <p className="font-semibold text-red-400">Access Denied</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</p>
                    <p className="text-lg text-white font-medium">{user.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Username</p>
                    <p className="text-lg text-white font-medium">@{user.username}</p>
                  </div>
                </div>

                <div className="h-px bg-slate-800 my-4" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <Mail className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email Address</p>
                      <p className="text-sm text-slate-200">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <Phone className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <p className="text-sm text-slate-200">{user.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <MapPin className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-sm text-slate-200">{user.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}