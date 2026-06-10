import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import Button from '../../components/ui/Button'
import FormInput from '../../components/ui/FormInput'
import Alert from '../../components/ui/Alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useLogin } from '../../api/useAuth'
import { useAuthStore } from './store'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setAuthData } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState('')

  const loginMutation = useLogin()

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.token && data.user) {
            setAuthData(data.token, data.user)
            navigate('/dashboard')
          }
        },
        onError: (error: any) => {
          console.log(error)
          setServerError(error.response?.data?.message || 'Login failed. Please try again.')
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your EdLink account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {serverError && (
              <Alert
                variant="error"
                message={serverError}
                dismissible
                onClose={() => setServerError('')}
              />
            )}

            <FormInput
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              fullWidth
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              fullWidth
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loginMutation.isPending}
            >
              Sign In
            </Button>

            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-primary-700 hover:text-primary-800 font-medium"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary-700 hover:text-primary-800 font-medium"
              >
                Create account
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
