'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Fetch the user's role
        const res = await fetch('/api/user')
        const userData = await res.json()

        // Route based on user role
        switch (userData.role) {
          case 'USER':
            router.push('/user/dashboard')
            break
          case 'SERVICE_PROVIDER':
            router.push('/service-provider/dashboard')
            break
          case 'ADMIN':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/')
        }
      }
    } catch (error) {
      setError('An error occurred during login')
    }
  }

  return (
<div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
  <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
    <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Login to Your Account</div>
    
    {/* Error display */}
    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    
    {/* Login form */}
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div className="flex flex-col">
        <Label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Email Address:</Label>
        <div className="relative">
          <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" 
            placeholder="Enter your email" 
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Password:</label>
        <div className="relative">
          <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" 
            placeholder="Enter your password"
          />
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
        <span className="mr-2 uppercase">Login</span>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </Button>
    </form>
    
    {/* Sign-up link */}
    <div className="flex justify-center items-center mt-6">
      <a href="/register" target="_blank" className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <span className="ml-2">You dont have an account?</span>
      </a>
    </div>
  </div>
</div>


  )
}