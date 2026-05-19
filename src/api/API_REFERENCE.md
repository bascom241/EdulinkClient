# API Reference - EdLink React Query Hooks

Complete documentation for all 18 API hooks for authentication, classroom management, and data fetching.

## Table of Contents

1. [Authentication Hooks](#authentication-hooks)
2. [Classroom Hooks](#classroom-hooks)
3. [Error Handling](#error-handling)
4. [Query Key Structure](#query-key-structure)
5. [Request/Response Types](#requestresponse-types)

---

## Authentication Hooks

All authentication hooks are in `src/api/useAuth.ts` and use React Query mutations/queries.

### useLogin

Authenticates a user with email and password.

**Type Signature:**
```typescript
export const useLogin = (): UseMutationResult<
  { token: string; user: User },
  Error,
  LoginRequest
>
```

**Request Type:**
```typescript
interface LoginRequest {
  email: string
  password: string
}
```

**Response Type:**
```typescript
{
  token: string
  user: User
}
```

**Usage Example:**
```tsx
import { useLogin } from '@/api/useAuth'
import { useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  const handleLogin = () => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log('Logged in as:', data.user.email)
          // Navigate to dashboard
        },
        onError: (error) => {
          console.error('Login failed:', error.message)
        }
      }
    )
  }

  return (
    <button onClick={handleLogin} disabled={loginMutation.isPending}>
      {loginMutation.isPending ? 'Logging in...' : 'Login'}
    </button>
  )
}
```

**Error Handling:**
```tsx
const loginMutation = useLogin()

const handleSubmit = async (credentials) => {
  try {
    loginMutation.mutate(credentials, {
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          showAlert('Invalid email or password')
        } else if (error.response?.status === 429) {
          showAlert('Too many login attempts. Please try again later.')
        } else {
          showAlert('Login failed. Please try again.')
        }
      }
    })
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
```

---

### useRegister

Creates a new user account.

**Type Signature:**
```typescript
export const useRegister = (): UseMutationResult<
  { token: string; user: User },
  Error,
  RegisterRequest
>
```

**Request Type:**
```typescript
interface RegisterRequest {
  email: string
  password: string
  name: string
}
```

**Usage Example:**
```tsx
import { useRegister } from '@/api/useAuth'
import { useState } from 'react'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const registerMutation = useRegister()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    registerMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log('Account created:', data.user.name)
        // Navigate to email verification
      },
      onError: (error) => {
        if (error.response?.data?.message?.includes('already exists')) {
          showAlert('Email is already registered')
        }
      }
    })
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        type="email"
      />
      <input
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        type="password"
      />
      <input
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Full Name"
      />
      <button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  )
}
```

---

### useVerify

Verifies user email with verification code.

**Type Signature:**
```typescript
export const useVerify = (): UseMutationResult<
  { success: boolean; message: string },
  Error,
  VerifyRequest
>
```

**Request Type:**
```typescript
interface VerifyRequest {
  email: string
  verificationCode: string
}
```

**Usage Example:**
```tsx
import { useVerify } from '@/api/useAuth'
import { useState } from 'react'

export function EmailVerification() {
  const [code, setCode] = useState('')
  const verifyMutation = useVerify()

  const handleVerify = () => {
    verifyMutation.mutate(
      { email: 'user@example.com', verificationCode: code },
      {
        onSuccess: () => {
          showAlert('Email verified successfully!')
          navigate('/dashboard')
        }
      }
    )
  }

  return (
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter verification code"
      />
      <button onClick={handleVerify}>Verify Email</button>
    </div>
  )
}
```

---

### useCurrentUser

Fetches the currently authenticated user's profile.

**Type Signature:**
```typescript
export const useCurrentUser = (): UseQueryResult<User, Error>
```

**Response Type:**
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'ROLE_TEACHER' | 'ROLE_USER'
  verified: boolean
}
```

**Usage Example:**
```tsx
import { useCurrentUser } from '@/api/useAuth'

export function UserProfile() {
  const { data: user, isLoading, error } = useCurrentUser()

  if (isLoading) return <div>Loading profile...</div>
  if (error) return <div>Failed to load profile</div>

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Verified: {user?.verified ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

**Query Caching:**
```tsx
// Stale time: 5 minutes (300,000ms)
// Data is considered fresh for 5 minutes after fetching
// Automatic refetch on window focus after stale time
```

---

### useRefreshToken

Refreshes the access token for maintaining session.

**Type Signature:**
```typescript
export const useRefreshToken = (): UseMutationResult<
  { token: string },
  Error,
  void
>
```

**Usage Example:**
```tsx
import { useRefreshToken } from '@/api/useAuth'
import { useAuthStore } from '@/features/auth/store'

export function useTokenRefresh() {
  const refreshMutation = useRefreshToken()
  const { setToken } = useAuthStore()

  const refresh = async () => {
    try {
      refreshMutation.mutate(undefined, {
        onSuccess: (data) => {
          setToken(data.token)
          console.log('Token refreshed')
        }
      })
    } catch (error) {
      console.error('Token refresh failed')
    }
  }

  return refresh
}
```

---

### useForgotPassword

Initiates password reset process.

**Type Signature:**
```typescript
export const useForgotPassword = (): UseMutationResult<
  { message: string },
  Error,
  string
>
```

**Usage Example:**
```tsx
import { useForgotPassword } from '@/api/useAuth'
import { useState } from 'react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const forgotPasswordMutation = useForgotPassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        showAlert('Check your email for password reset link')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button type="submit" disabled={forgotPasswordMutation.isPending}>
        Send Reset Link
      </button>
    </form>
  )
}
```

---

### useUpdateRole

Updates user's role (teacher/student).

**Type Signature:**
```typescript
export const useUpdateRole = (): UseMutationResult<
  { user: User },
  Error,
  string
>
```

**Usage Example:**
```tsx
import { useUpdateRole } from '@/api/useAuth'

export function RoleSelector() {
  const updateRoleMutation = useUpdateRole()

  const handleRoleChange = (newRole: string) => {
    updateRoleMutation.mutate(newRole, {
      onSuccess: () => {
        showAlert('Role updated successfully')
      }
    })
  }

  return (
    <div>
      <button onClick={() => handleRoleChange('ROLE_TEACHER')}>
        Become a Teacher
      </button>
      <button onClick={() => handleRoleChange('ROLE_USER')}>
        Switch to Student
      </button>
    </div>
  )
}
```

---

## Classroom Hooks

All classroom hooks are in `src/api/useClassroom.ts`.

### useCreateClassroom

Creates a new classroom.

**Type Signature:**
```typescript
export const useCreateClassroom = (): UseMutationResult<
  Classroom,
  Error,
  { name: string; description?: string; categoryId: string }
>
```

**Request Type:**
```typescript
{
  name: string          // Classroom name
  description?: string  // Optional description
  categoryId: string    // Category ID
}
```

**Response Type:**
```typescript
interface Classroom {
  id: string
  name: string
  description?: string
  categoryId: string
  category?: Category
  teacherId: string
  studentCount: number
  resourceCount: number
  joinCode?: string
  createdAt: string
  updatedAt: string
}
```

**Usage Example:**
```tsx
import { useCreateClassroom, useGetCategories } from '@/api/useClassroom'
import { useState } from 'react'

export function CreateClassroomForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: ''
  })
  const createMutation = useCreateClassroom()
  const { data: categories } = useGetCategories()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    
    createMutation.mutate(formData, {
      onSuccess: (classroom) => {
        showAlert(`Classroom "${classroom.name}" created!`)
        navigate(`/classroom/${classroom.id}`)
      }
    })
  }

  return (
    <form onSubmit={handleCreate}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Classroom name"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Description"
      />
      <select
        value={formData.categoryId}
        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
      >
        {categories?.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <button type="submit" disabled={createMutation.isPending}>Create</button>
    </form>
  )
}
```

---

### useGetCategories

Fetches all available classroom categories.

**Type Signature:**
```typescript
export const useGetCategories = (): UseQueryResult<Category[], Error>
```

**Response Type:**
```typescript
interface Category {
  id: string
  name: string
  description?: string
}
```

**Usage Example:**
```tsx
import { useGetCategories } from '@/api/useClassroom'

export function CategoryList() {
  const { data: categories, isLoading } = useGetCategories()

  if (isLoading) return <div>Loading categories...</div>

  return (
    <ul>
      {categories?.map(cat => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  )
}
```

**Query Caching:**
```tsx
// Stale time: 10 minutes
// Categories don't change frequently, so long cache time is appropriate
```

---

### useCreateCategory

Creates a new classroom category.

**Type Signature:**
```typescript
export const useCreateCategory = (): UseMutationResult<
  Category,
  Error,
  { name: string; description?: string }
>
```

**Usage Example:**
```tsx
import { useCreateCategory } from '@/api/useClassroom'

export function NewCategoryForm() {
  const [name, setName] = useState('')
  const createCategoryMutation = useCreateCategory()

  const handleCreate = () => {
    createCategoryMutation.mutate(
      { name },
      {
        onSuccess: () => {
          showAlert('Category created')
          setName('')
        }
      }
    )
  }

  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
      />
      <button onClick={handleCreate}>Create</button>
    </>
  )
}
```

---

### useGetTeacherClassrooms

Fetches all classrooms created by the current teacher.

**Type Signature:**
```typescript
export const useGetTeacherClassrooms = (): UseQueryResult<Classroom[], Error>
```

**Usage Example:**
```tsx
import { useGetTeacherClassrooms } from '@/api/useClassroom'

export function TeacherClassrooms() {
  const { data: classrooms, isLoading, error } = useGetTeacherClassrooms()

  if (isLoading) return <div>Loading classrooms...</div>
  if (error) return <div>Error loading classrooms</div>

  return (
    <div>
      <h2>My Classrooms ({classrooms?.length})</h2>
      {classrooms?.map(cls => (
        <div key={cls.id}>
          <h3>{cls.name}</h3>
          <p>{cls.studentCount} students</p>
          <p>{cls.resourceCount} resources</p>
        </div>
      ))}
    </div>
  )
}
```

---

### useGetStudentClassrooms

Fetches all classrooms the current student has joined.

**Type Signature:**
```typescript
export const useGetStudentClassrooms = (): UseQueryResult<Classroom[], Error>
```

**Usage Example:**
```tsx
import { useGetStudentClassrooms } from '@/api/useClassroom'

export function StudentClassrooms() {
  const { data: classrooms } = useGetStudentClassrooms()

  return (
    <div>
      {classrooms?.map(cls => (
        <ClassroomCard key={cls.id} classroom={cls} />
      ))}
    </div>
  )
}
```

---

### useGetAllClassrooms

Fetches all available classrooms in the system.

**Type Signature:**
```typescript
export const useGetAllClassrooms = (): UseQueryResult<Classroom[], Error>
```

**Usage Example:**
```tsx
import { useGetAllClassrooms } from '@/api/useClassroom'

export function BrowseClassrooms() {
  const { data: allClassrooms } = useGetAllClassrooms()

  return (
    <div>
      <h2>Available Classrooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allClassrooms?.map(cls => (
          <ClassroomPreview key={cls.id} classroom={cls} />
        ))}
      </div>
    </div>
  )
}
```

---

### useGetClassroom

Fetches a single classroom by ID.

**Type Signature:**
```typescript
export const useGetClassroom = (id: string): UseQueryResult<Classroom, Error>
```

**Usage Example:**
```tsx
import { useGetClassroom } from '@/api/useClassroom'
import { useParams } from 'react-router-dom'

export function ClassroomDetail() {
  const { classroomId } = useParams()
  const { data: classroom, isLoading } = useGetClassroom(classroomId!)

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>{classroom?.name}</h1>
      <p>{classroom?.description}</p>
      <div>Students: {classroom?.studentCount}</div>
      <div>Resources: {classroom?.resourceCount}</div>
    </div>
  )
}
```

---

### useJoinClassroom

Allows a student to join a classroom with a join code.

**Type Signature:**
```typescript
export const useJoinClassroom = (): UseMutationResult<
  { classroom: Classroom },
  Error,
  string
>
```

**Usage Example:**
```tsx
import { useJoinClassroom } from '@/api/useClassroom'
import { useState } from 'react'

export function JoinClassroomForm() {
  const [joinCode, setJoinCode] = useState('')
  const joinMutation = useJoinClassroom()

  const handleJoin = () => {
    joinMutation.mutate(joinCode, {
      onSuccess: (data) => {
        showAlert(`Joined "${data.classroom.name}"`)
        navigate(`/classroom/${data.classroom.id}`)
      },
      onError: () => {
        showAlert('Invalid classroom code')
      }
    })
  }

  return (
    <div>
      <input
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        placeholder="Enter classroom code"
      />
      <button onClick={handleJoin} disabled={joinMutation.isPending}>
        Join Classroom
      </button>
    </div>
  )
}
```

---

### useGenerateJoinLink

Generates a shareable join link for a classroom.

**Type Signature:**
```typescript
export const useGenerateJoinLink = (): UseMutationResult<
  { link: string; code: string },
  Error,
  string
>
```

**Usage Example:**
```tsx
import { useGenerateJoinLink } from '@/api/useClassroom'

export function ShareClassroom({ classroomId }: { classroomId: string }) {
  const generateMutation = useGenerateJoinLink()
  const [link, setLink] = useState<string>()

  const handleGenerateLink = () => {
    generateMutation.mutate(classroomId, {
      onSuccess: (data) => {
        setLink(data.link)
        navigator.clipboard.writeText(data.link)
        showAlert('Link copied to clipboard!')
      }
    })
  }

  return (
    <>
      <button onClick={handleGenerateLink}>Generate Link</button>
      {link && <p>Link: {link}</p>}
    </>
  )
}
```

---

### useGetClassroomStats

Fetches statistics for a specific classroom.

**Type Signature:**
```typescript
export const useGetClassroomStats = (classroomId: string): UseQueryResult<ClassroomStats, Error>
```

**Response Type:**
```typescript
interface ClassroomStats {
  totalClasses: number
  totalStudents: number
  activeStudents: number
}
```

**Usage Example:**
```tsx
import { useGetClassroomStats } from '@/api/useClassroom'

export function ClassroomStats({ classroomId }: { classroomId: string }) {
  const { data: stats } = useGetClassroomStats(classroomId)

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p>Total Classes</p>
        <p className="text-2xl">{stats?.totalClasses}</p>
      </div>
      <div>
        <p>Total Students</p>
        <p className="text-2xl">{stats?.totalStudents}</p>
      </div>
      <div>
        <p>Active Students</p>
        <p className="text-2xl">{stats?.activeStudents}</p>
      </div>
    </div>
  )
}
```

**Query Caching:**
```tsx
// Stale time: 1 minute
// Stats are frequently updated, so short cache time
```

---

### useAddResource

Adds a resource (file/document) to a classroom.

**Type Signature:**
```typescript
export const useAddResource = (): UseMutationResult<
  { resource: Resource },
  Error,
  FormData
>
```

**Usage Example:**
```tsx
import { useAddResource } from '@/api/useClassroom'
import { useRef } from 'react'

export function UploadResource({ classroomId }: { classroomId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useAddResource()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('classroomId', classroomId)

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        showAlert('Resource uploaded successfully')
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    })
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={uploadMutation.isPending}
      />
      {uploadMutation.isPending && <p>Uploading...</p>}
    </>
  )
}
```

---

### useAddTimeTable

Adds a session/class schedule to a classroom.

**Type Signature:**
```typescript
export const useAddTimeTable = (): UseMutationResult<
  { session: Session },
  Error,
  any
>
```

**Usage Example:**
```tsx
import { useAddTimeTable } from '@/api/useClassroom'
import { useState } from 'react'

export function AddSession({ classroomId }: { classroomId: string }) {
  const [sessionData, setSessionData] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
  })
  const addSessionMutation = useAddTimeTable()

  const handleAddSession = () => {
    addSessionMutation.mutate({
      classroomId,
      ...sessionData
    }, {
      onSuccess: () => {
        showAlert('Session added')
      }
    })
  }

  return (
    <div>
      <select
        value={sessionData.day}
        onChange={(e) => setSessionData({...sessionData, day: e.target.value})}
      >
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <input
        type="time"
        value={sessionData.startTime}
        onChange={(e) => setSessionData({...sessionData, startTime: e.target.value})}
      />
      <input
        type="time"
        value={sessionData.endTime}
        onChange={(e) => setSessionData({...sessionData, endTime: e.target.value})}
      />
      <button onClick={handleAddSession}>Add Session</button>
    </div>
  )
}
```

---

## Error Handling

### Common Error Patterns

```tsx
import { useLogin } from '@/api/useAuth'
import { AxiosError } from 'axios'

export function useAuthWithErrorHandling() {
  const loginMutation = useLogin()

  const handleLogin = async (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            resolve(data)
          },
          onError: (error: AxiosError) => {
            // Handle specific error codes
            const status = error.response?.status
            const data = error.response?.data as any

            switch (status) {
              case 400:
                reject({ message: 'Invalid input' })
                break
              case 401:
                reject({ message: 'Invalid credentials' })
                break
              case 404:
                reject({ message: 'User not found' })
                break
              case 429:
                reject({ message: 'Too many attempts. Please try later.' })
                break
              case 500:
                reject({ message: 'Server error. Please try again.' })
                break
              default:
                reject({ message: data?.message || 'An error occurred' })
            }
          }
        }
      )
    })
  }

  return { handleLogin, isLoading: loginMutation.isPending }
}
```

### Global Error Boundary

```tsx
import { useQueryClient } from '@tanstack/react-query'

export function useGlobalErrorHandler() {
  const queryClient = useQueryClient()

  const handleError = (error: any) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    
    // Show toast/alert
    showAlert(error.response?.data?.message || 'An error occurred')
  }

  return handleError
}
```

---

## Query Key Structure

Query keys are organized hierarchically for better cache management:

```typescript
// Authentication
['user', 'current']                     // Current user profile
['user', 'profile']                     // User profile cache key

// Classrooms
['classrooms']                          // Generic classrooms
['classrooms', 'teacher']               // Teacher's classrooms
['classrooms', 'student']               // Student's classrooms
['classrooms', 'all']                   // All classrooms
['classroom', id]                       // Single classroom
['classroom', id, 'stats']              // Classroom stats

// Categories
['categories']                          // All categories
```

### Invalidating Queries

```tsx
import { useQueryClient } from '@tanstack/react-query'
import { useCreateClassroom } from '@/api/useClassroom'

export function useClassroomMutations() {
  const queryClient = useQueryClient()
  const createMutation = useCreateClassroom()

  const onSuccess = () => {
    // Invalidate all classroom queries
    queryClient.invalidateQueries({ queryKey: ['classrooms'] })
    
    // Or invalidate specific queries
    queryClient.invalidateQueries({ queryKey: ['classrooms', 'teacher'] })
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  return { createMutation, onSuccess }
}
```

---

## Request/Response Types

### Common Types

```typescript
// User
interface User {
  id: string
  email: string
  name: string
  role: 'ROLE_TEACHER' | 'ROLE_USER'
  verified: boolean
}

// Category
interface Category {
  id: string
  name: string
  description?: string
}

// Classroom
interface Classroom {
  id: string
  name: string
  description?: string
  categoryId: string
  category?: Category
  teacherId: string
  studentCount: number
  resourceCount: number
  joinCode?: string
  createdAt: string
  updatedAt: string
}

// Stats
interface ClassroomStats {
  totalClasses: number
  totalStudents: number
  activeStudents: number
}
```

### API Client Configuration

The API client is configured in `src/api/client.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Features:
// - Automatic bearer token injection
// - 401 error handling (logout on expired token)
// - Axios instance reuse for efficiency
```

---

## Tips & Best Practices

1. **Always handle loading states**
   ```tsx
   const { data, isLoading, error } = useQuery(...)
   if (isLoading) return <Loader />
   if (error) return <Alert variant="error" />
   ```

2. **Use stale time appropriately**
   - User profile: 5 minutes
   - Categories: 10 minutes
   - Stats: 1 minute (frequently updated)

3. **Batch operations when possible**
   ```tsx
   // Good: Single query for multiple classrooms
   const classrooms = useGetTeacherClassrooms()
   
   // Less efficient: Multiple queries
   useGetClassroom(id1)
   useGetClassroom(id2)
   useGetClassroom(id3)
   ```

4. **Implement optimistic updates**
   ```tsx
   mutation.mutate(data, {
     onMutate: (newData) => {
       // Update UI before server confirms
       queryClient.setQueryData(['item'], newData)
     },
     onError: () => {
       // Revert on error
       queryClient.invalidateQueries({ queryKey: ['item'] })
     }
   })
   ```

5. **Combine multiple hooks efficiently**
   ```tsx
   const currentUser = useCurrentUser()
   const classrooms = useGetTeacherClassrooms()
   
   if (currentUser.isLoading || classrooms.isLoading) {
     return <Loader />
   }
   ```
