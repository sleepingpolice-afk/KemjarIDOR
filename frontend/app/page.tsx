"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock } from "lucide-react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // UPDATED: Check for the token, which is the proof of being logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard") // Better to use router.push in Next.js
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("user", JSON.stringify(data.user))

        window.location.href = "/dashboard"
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-slate-900/30 blur-3xl rounded-full opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-xl mb-4 border border-slate-800 shadow-xl">
            <Lock className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Website Sus</h1>
          <p className="text-slate-400">Final Project Kemanan Jaringan</p>
        </div>

        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Login</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the secure area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3 bg-red-950/30 border border-red-900/50 rounded-lg flex gap-2 text-sm text-red-200 items-start">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2"
              >
                {loading ? "Logging in..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/register')}
                className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Create an account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}