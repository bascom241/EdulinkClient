import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import Button from '../../components/ui/Button'
import FormInput from '../../components/ui/FormInput'
import Alert from '../../components/ui/Alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useRegister } from '../../api/useAuth'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})
  const [serverError, setServerError] = useState('')

  const registerMutation = useRegister()

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = 'Full name is required'
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          navigate('/verify')
        },
        onError: (error: any) => {
          setServerError(error.response?.data?.message || 'Registration failed. Please try again.')
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>Join EdLink and start learning</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {serverError && (
              <Alert
                variant="error"
                message={serverError}
                dismissible
                onClose={() => setServerError('')}
              />
            )}

            <FormInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              icon={<User className="w-5 h-5" />}
              fullWidth
            />

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              fullWidth
            />

            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5" />}
              fullWidth
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={registerMutation.isPending}
            >
              Create Account
            </Button>

            <div className="text-center text-sm">
              <span className="text-neutral-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary-700 hover:text-primary-800 font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
