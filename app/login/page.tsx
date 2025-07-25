"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import Image from "next/image"

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

export default function LoginPage() {
  const { login, signup } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get("redirect") || "/"

  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string>("")
  const [loginFieldErrors, setLoginFieldErrors] = useState<Record<string, string>>({})
  const [signupError, setSignupError] = useState<string>("")
  const [signupFieldErrors, setSignupFieldErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const signupTabRef = useRef<HTMLButtonElement>(null)

  // Password visibility toggles
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);
  const [signupConfirmPasswordVisible, setSignupConfirmPasswordVisible] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user types
    if (loginFieldErrors[name]) {
      setLoginFieldErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user types
    if (signupFieldErrors[name]) {
      setSignupFieldErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginFieldErrors({})
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Incorrect password") {
          setLoginFieldErrors({ password: error.message })
          setLoginError("")
        } else {
          setLoginError(error.message)
          setLoginFieldErrors(prev => ({ ...prev, password: "" }))
        }
      } else if (typeof error === 'object' && error !== null) {
        const errorResponse = error as ErrorResponse
        if (errorResponse.errors) {
          const newFieldErrors: Record<string, string> = {}
          errorResponse.errors.forEach(err => {
            newFieldErrors[err.field] = err.message
          })
          if (
            Object.keys(newFieldErrors).length === 1 &&
            newFieldErrors.password === "Incorrect password"
          ) {
            setLoginFieldErrors({ password: "Incorrect password" })
            setLoginError("")
          } else {
            setLoginFieldErrors(newFieldErrors)
            setLoginError(errorResponse.message)
          }
        } else {
          setLoginError(errorResponse.message)
          setLoginFieldErrors(prev => ({ ...prev, password: "" }))
        }
      } else {
        setLoginError("An unexpected error occurred")
        setLoginFieldErrors(prev => ({ ...prev, password: "" }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError("")
    setSignupFieldErrors({})
    setIsLoading(true)

    // Client-side validation
    if (signupData.password !== signupData.confirmPassword) {
      setSignupFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }))
      setIsLoading(false)
      return
    }

    if (signupData.password.length < 8) {
      setSignupFieldErrors(prev => ({ ...prev, password: "Password must be at least 8 characters long" }))
      setIsLoading(false)
      return
    }

    if (!/[A-Z]/.test(signupData.password)) {
      setSignupFieldErrors(prev => ({ ...prev, password: "Password must contain at least one uppercase letter" }))
      setIsLoading(false)
      return
    }

    if (!/[a-z]/.test(signupData.password)) {
      setSignupFieldErrors(prev => ({ ...prev, password: "Password must contain at least one lowercase letter" }))
      setIsLoading(false)
      return
    }

    if (!/[0-9]/.test(signupData.password)) {
      setSignupFieldErrors(prev => ({ ...prev, password: "Password must contain at least one number" }))
      setIsLoading(false)
      return
    }

    if (!/[^A-Za-z0-9]/.test(signupData.password)) {
      setSignupFieldErrors(prev => ({ ...prev, password: "Password must contain at least one special character" }))
      setIsLoading(false)
      return
    }

    try {
      await signup(signupData.name, signupData.email, signupData.password)
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()
        if (errorMessage.includes("email")) {
          setSignupFieldErrors(prev => ({ ...prev, email: error.message }))
        } else if (errorMessage.includes("password")) {
          setSignupFieldErrors(prev => ({ ...prev, password: error.message }))
        } else if (errorMessage.includes("name")) {
          setSignupFieldErrors(prev => ({ ...prev, name: error.message }))
        } else {
          setSignupError(error.message)
        }
      } else if (typeof error === 'object' && error !== null) {
        const errorResponse = error as ErrorResponse
        if (errorResponse.errors) {
          const newFieldErrors: Record<string, string> = {}
          errorResponse.errors.forEach(err => {
            newFieldErrors[err.field] = err.message
          })
          setSignupFieldErrors(newFieldErrors)
        }
        setSignupError(errorResponse.message)
      } else {
        setSignupError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Clear errors when switching tabs
  const handleTabChange = (value: string) => {
    const tab = value as 'login' | 'signup';
    setActiveTab(tab);
    if (tab === 'login') {
      setSignupError("");
      setSignupFieldErrors({});
    } else {
      setLoginError("");
      setLoginFieldErrors({});
    }
  }

  const renderFieldError = (fieldName: string) => {
    if (loginFieldErrors[fieldName] || signupFieldErrors[fieldName]) {
      return (
        <p className="text-sm font-medium text-destructive mt-1">
          {loginFieldErrors[fieldName] || signupFieldErrors[fieldName]}
        </p>
      )
    }
    return null
  }

  // Helper for password requirements
  const passwordRequirements = [
    { met: signupData.password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(signupData.password), text: "One uppercase letter" },
    { met: /[a-z]/.test(signupData.password), text: "One lowercase letter" },
    { met: /[0-9]/.test(signupData.password), text: "One number" },
    { met: /[^A-Za-z0-9]/.test(signupData.password), text: "One special character" },
  ];

  const renderPasswordRequirements = () => (
    <div className="mt-2 space-y-1">
      {passwordRequirements.map((req, index) => (
        <p key={index} className={`text-xs ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}>
          {req.met ? '✓' : '○'} {req.text}
        </p>
      ))}
    </div>
  );

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-navy">Welcome to Motion Muse</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to access our AI video generator
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup" ref={signupTabRef}>Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="w-full flex items-center justify-center mb-2">
                  <Button
                    type="button"
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-4 py-1 h-10 text-sm w-full flex items-center justify-center space-x-2"
                    onClick={() => signIn("google")}
                  >
                    <Image src="/images/google-logo.svg" alt="Google logo" width={24} height={24} />
                    <span>Sign in with Google</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className={`pl-10 ${loginFieldErrors.email ? 'border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {loginFieldErrors.email && (
                    <p className="text-sm font-medium text-destructive mt-1">{loginFieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type={loginPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className={`pl-10 pr-10 ${loginFieldErrors.password ? 'border-destructive' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-2.5 text-muted-foreground focus:outline-none"
                      onClick={() => setLoginPasswordVisible(v => !v)}
                      aria-label={loginPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {loginPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginFieldErrors.password ? (
                    <p className="text-sm font-medium text-destructive mt-1">{loginFieldErrors.password}</p>
                  ) : loginError === "Incorrect password" ? (
                    <p className="text-sm font-medium text-destructive mt-1">{loginError}</p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      className="mr-2 h-4 w-4 rounded border border-input text-logo-blue focus:ring-2 focus:ring-logo-blue"
                    />
                    <label htmlFor="remember-me" className="text-sm text-muted-foreground select-none cursor-pointer">Remember me</label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-logo-blue hover:underline">
                    Forgot?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-logo-blue to-logo-green hover:from-logo-blue/90 hover:to-logo-green/90 text-white h-10"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Login"}
                </Button>

                <div className="w-full flex items-center justify-center mt-2 gap-2">
                  <span className="text-sm text-muted-foreground">New here?</span>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gradient-to-r from-logo-blue to-logo-green text-white border-0 hover:from-logo-blue/90 hover:to-logo-green/90 px-4 py-1 h-8 text-sm"
                    onClick={() => {
                      signupTabRef.current?.focus();
                      signupTabRef.current?.click();
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                {signupError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{signupError}</AlertDescription>
                  </Alert>
                )}

                <div className="w-full flex items-center justify-center mb-2">
                  <Button
                    type="button"
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-4 py-1 h-10 text-sm w-full flex items-center justify-center space-x-2"
                    onClick={() => signIn("google")}
                  >
                    <Image src="/images/google-logo.svg" alt="Google logo" width={24} height={24} />
                    <span>Sign in with Google</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      name="name"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      className={`pl-10 ${signupFieldErrors.name ? 'border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {signupFieldErrors.name && (
                    <p className="text-sm font-medium text-destructive mt-1">{signupFieldErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className={`pl-10 ${signupFieldErrors.email ? 'border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {signupFieldErrors.email && (
                    <p className="text-sm font-medium text-destructive mt-1">{signupFieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type={signupPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className={`pl-10 pr-10 ${signupFieldErrors.password ? 'border-destructive' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-2.5 text-muted-foreground focus:outline-none"
                      onClick={() => setSignupPasswordVisible(v => !v)}
                      aria-label={signupPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {signupPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupFieldErrors.password && (
                    <p className="text-sm font-medium text-destructive mt-1">{signupFieldErrors.password}</p>
                  )}
                  {signupData.password && renderPasswordRequirements()}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={signupConfirmPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      className={`pl-10 pr-10 ${signupFieldErrors.confirmPassword ? 'border-destructive' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-2.5 text-muted-foreground focus:outline-none"
                      onClick={() => setSignupConfirmPasswordVisible(v => !v)}
                      aria-label={signupConfirmPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {signupConfirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupFieldErrors.confirmPassword && (
                    <p className="text-sm font-medium text-destructive mt-1">{signupFieldErrors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-logo-blue to-logo-green hover:from-logo-blue/90 hover:to-logo-green/90 text-white h-10"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>

                <div className="w-full flex items-center justify-center mt-2 gap-2">
                  <span className="text-sm text-muted-foreground">Already have an account?</span>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gradient-to-r from-logo-blue to-logo-green text-white border-0 hover:from-logo-blue/90 hover:to-logo-green/90 px-4 py-1 h-8 text-sm"
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
