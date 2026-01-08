import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SignupForm from '../components/auth/SignupForm'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Sign Up</h1>
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

