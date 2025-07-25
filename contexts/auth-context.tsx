"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Add routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup", "/about", "/contact", "/services", "/pricing"];

type User = {
  id: string
  name: string
  email: string
  plan: "free" | "pro" | "enterprise" | null
  workspaceName?: string
  role?: string
  onboardingCompleted?: boolean
}

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  errors?: ValidationError[];
}

interface SuccessResponse<T> {
  success: true;
  message: string;
  user: T;
  redirectTo?: string;
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const lastFetchTime = useRef(0)
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMounted = useRef(true)

  // Function to fetch user data
  const fetchUser = useCallback(async (force: boolean = false) => {
    // Skip fetching for public routes
    if (publicRoutes.includes(pathname)) {
      setIsLoading(false);
      return;
    }

    const now = Date.now()
    // Don't fetch if we've fetched in the last 30 seconds, unless forced
    if (!force && now - lastFetchTime.current < 30000) {
      return
    }

    // Clear any pending fetch
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
    }

    try {
      lastFetchTime.current = now
      const response = await fetch('/api/user/me')
      
      if (!isMounted.current) return

      if (response.ok) {
        const data = await response.json()
        
        // Only update user if data has changed
        if (JSON.stringify(data.user) !== JSON.stringify(user)) {
          setUser(data.user)
        }
      } else {
        const errorData = await response.json() as ErrorResponse
        console.error("Failed to fetch user:", errorData.message)
        if (user !== null) {
          setUser(null)
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
      if (user !== null) {
        setUser(null)
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [user, pathname])

  // Initial fetch on mount
  useEffect(() => {
    isMounted.current = true
    fetchUser(true)

    return () => {
      isMounted.current = false
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [])

  // Setup periodic check every 30 seconds if user is logged in
  useEffect(() => {
    if (user && !publicRoutes.includes(pathname)) {
      fetchTimeoutRef.current = setTimeout(() => {
        fetchUser()
      }, 30000)

      return () => {
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current)
        }
      }
    }
  }, [user, fetchUser, pathname])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        throw errorData
      }

      const successData = data as SuccessResponse<User>
      if (!successData.success || !successData.user) {
        throw new Error('Invalid response from server')
      }

      // Update user state
      setUser(successData.user)

      // Route based on onboarding status and plan
      if (successData.redirectTo) {
        router.push(successData.redirectTo)
      } else if (successData.user.onboardingCompleted) {
        let dashboard = '/dashboard'
        if (successData.user.plan === 'pro') dashboard = '/dashboard/pro'
        else if (successData.user.plan === 'enterprise') dashboard = '/dashboard/enterprise'
        router.push(dashboard)
      } else {
        router.push('/onboarding')
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, plan: "free" }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ErrorResponse
        if (errorData.errors) {
          // Convert array of errors to a single error with the first message
          throw new Error(errorData.errors[0]?.message || errorData.message)
        }
        throw new Error(errorData.message)
      }

      const successData = data as SuccessResponse<User>
      if (!successData.success || !successData.user) {
        throw new Error('Invalid response from server')
      }

      // Update user state
      setUser(successData.user)

      // Always redirect to onboarding after signup
      router.push("/onboarding")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse
        throw errorData
      }
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse
        throw errorData
      }

      const successData = await response.json() as SuccessResponse<User>
      if (!successData.success || !successData.user) {
        throw new Error('Invalid response from server')
      }

      setUser(successData.user)
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
