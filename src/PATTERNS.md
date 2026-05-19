# Pattern Guide - EdLink Common Patterns & Best Practices

Documentation of common patterns, best practices, and anti-patterns used throughout the EdLink application.

## Table of Contents

1. [Form Patterns](#form-patterns)
2. [Loading States](#loading-states)
3. [Error Handling](#error-handling)
4. [Authentication Patterns](#authentication-patterns)
5. [Query Management](#query-management)
6. [State Management](#state-management)
7. [Component Patterns](#component-patterns)
8. [Do's and Don'ts](#dos-and-donts)

---

## Form Patterns

### Basic Form Pattern

Form pattern used throughout the application for consistent UX.

**Good:**
```tsx
import { useState } from 'react'
import { FormInput, Button, Alert } from '@/components/ui'

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const loginMutation = useLogin()

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        // Handle success
      },
      onError: (error: any) => {
        setServerError(
          error.response?.data?.message || 'An error occurred'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
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
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        error={errors.email}
        required
      />

      <FormInput
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        error={errors.password}
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={loginMutation.isPending}
      >
        Login
      </Button>
    </form>
  )
}
```

### Form with Modal

**Good:**
```tsx
export function CreateClassroomModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const createMutation = useCreateClassroom()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: typeof errors = {}
    if (!formData.name.trim()) newErrors.name = 'Name required'
    if (!formData.categoryId) newErrors.categoryId = 'Category required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false)
        setFormData({ name: '', description: '', categoryId: '' })
      }
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Classroom"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              isLoading={createMutation.isPending}
            >
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormInput
            label="Classroom Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            error={errors.name}
            placeholder="e.g., Advanced Mathematics"
          />
          <FormInput
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Optional description"
          />
          {/* Category select field */}
        </form>
      </Modal>
    </>
  )
}
```

**Bad:**
```tsx
// ❌ No validation
<form onSubmit={() => apiCall.mutate(data)}>
  <input value={data.email} />
  <button>Submit</button>
</form>

// ❌ Error state in component prop string
<FormInput error="Error occurred" />

// ❌ Multiple error states scattered
const emailError = formData.email ? 'Invalid' : null
const passwordError = formData.password ? 'Invalid' : null
```

---

## Loading States

### Query Loading Pattern

**Good:**
```tsx
export function ClassroomsList() {
  const { data: classrooms, isLoading, error } = useGetTeacherClassrooms()

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-neutral-200 h-40 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <Alert
        variant="error"
        title="Error"
        message="Failed to load classrooms"
      />
    )
  }

  // Show empty state
  if (!classrooms?.length) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <p className="text-neutral-600">No classrooms yet</p>
        <Button className="mt-4">Create Classroom</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {classrooms.map(cls => (
        <ClassroomCard key={cls.id} classroom={cls} />
      ))}
    </div>
  )
}
```

### Mutation Loading Pattern

**Good:**
```tsx
export function UploadResourceForm() {
  const [file, setFile] = useState<File | null>(null)
  const uploadMutation = useAddResource()

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={uploadMutation.isPending}
      />
      <Button
        onClick={() => {
          if (file) {
            const formData = new FormData()
            formData.append('file', file)
            uploadMutation.mutate(formData)
          }
        }}
        isLoading={uploadMutation.isPending}
      >
        Upload
      </Button>
      {uploadMutation.isPending && <Loader size="sm" message="Uploading..." />}
    </div>
  )
}
```

**Bad:**
```tsx
// ❌ No loading state indicator
<Button onClick={() => mutation.mutate(data)}>Save</Button>

// ❌ Misleading loading state
const [isLoading, setIsLoading] = useState(false)
const mutation = useMutation()
// Never update isLoading based on mutation.isPending

// ❌ No disabled state during loading
<input onChange={handleChange} /> {/* Can still type while uploading */}
```

---

## Error Handling

### Global Error Handler Pattern

**Good:**
```tsx
export function useErrorHandler() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleError = (error: any) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    switch (status) {
      case 400:
        return showAlert('Invalid input. Please check your data.')
      case 401:
        // Token expired
        logout()
        navigate('/login')
        return
      case 403:
        return showAlert('You do not have permission for this action')
      case 404:
        return showAlert('Resource not found')
      case 429:
        return showAlert('Too many requests. Please try again later.')
      case 500:
        return showAlert('Server error. Please try again later.')
      default:
        return showAlert(message || 'An unexpected error occurred')
    }
  }

  return handleError
}

// Usage in component
const handleError = useErrorHandler()

mutation.mutate(data, {
  onError: handleError
})
```

### Try-Catch with Mutations

**Good:**
```tsx
export function useClassroomCreation() {
  const mutation = useCreateClassroom()

  const createWithErrorHandling = async (formData: FormData) => {
    return new Promise((resolve, reject) => {
      mutation.mutate(formData, {
        onSuccess: (data) => {
          showAlert('Classroom created successfully')
          resolve(data)
        },
        onError: (error: AxiosError) => {
          const message = (error.response?.data as any)?.message
          showAlert(message || 'Failed to create classroom')
          reject(error)
        }
      })
    })
  }

  return { createWithErrorHandling, isPending: mutation.isPending }
}
```

**Bad:**
```tsx
// ❌ No error handling
const handleSubmit = () => {
  mutation.mutate(data)
}

// ❌ Generic error handling
onError: () => showAlert('Error!')

// ❌ Error message not user-friendly
console.error(error.message) // Shows technical details
```

---

## Authentication Patterns

### Protected Route Pattern

**Good:**
```tsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { useCurrentUser } from '@/api/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const { isLoading } = useCurrentUser()

  if (isLoading) {
    return <Loader fullScreen message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export function RoleProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode
  requiredRole: 'ROLE_TEACHER' | 'ROLE_USER'
}) {
  const { user } = useAuthStore()

  if (user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
```

### Auth Store Pattern

**Good:**
```tsx
// In store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuthData: (token, user) => {
        localStorage.setItem('accessToken', token)
        set({ token, user, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        set({ token: null, user: null, isAuthenticated: false })
      },

      updateRole: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role: role as any } : null
        }))
      }
    }),
    { name: 'auth-storage' }
  )
)

// Usage in components
export function UserMenu() {
  const { user, logout } = useAuthStore()

  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## Query Management

### Query Key Pattern

**Good:**
```tsx
// Hierarchical query keys
const queryKeys = {
  user: {
    all: ['user'] as const,
    profile: () => ['user', 'profile'] as const,
    current: () => ['user', 'current'] as const,
  },
  classrooms: {
    all: ['classrooms'] as const,
    teacher: () => ['classrooms', 'teacher'] as const,
    student: () => ['classrooms', 'student'] as const,
    byId: (id: string) => ['classroom', id] as const,
    stats: (id: string) => ['classroom', id, 'stats'] as const,
  },
  categories: {
    all: ['categories'] as const,
  }
}

// Usage
const { data } = useQuery({
  queryKey: queryKeys.classrooms.teacher(),
  queryFn: () => getTeacherClassrooms()
})

// Invalidation
queryClient.invalidateQueries({
  queryKey: queryKeys.classrooms.all
})
```

### Optimistic Updates Pattern

**Good:**
```tsx
export function useOptimisticClassroomUpdate() {
  const queryClient = useQueryClient()
  const mutation = useUpdateClassroom()

  return mutation.mutate(
    data,
    {
      onMutate: async (newData) => {
        // Cancel previous queries
        await queryClient.cancelQueries({
          queryKey: ['classroom', newData.id]
        })

        // Get previous data
        const previousData = queryClient.getQueryData([
          'classroom',
          newData.id
        ])

        // Update UI optimistically
        queryClient.setQueryData(['classroom', newData.id], newData)

        // Return rollback function
        return { previousData }
      },
      onError: (err, newData, context: any) => {
        // Rollback on error
        queryClient.setQueryData(
          ['classroom', newData.id],
          context.previousData
        )
      },
      onSettled: (data, error, variables) => {
        // Refetch to ensure sync
        queryClient.invalidateQueries({
          queryKey: ['classroom', variables.id]
        })
      }
    }
  )
}
```

**Bad:**
```tsx
// ❌ No query key structure
useQuery({ queryKey: ['data'], queryFn: () => api.get(...) })

// ❌ No optimistic updates
mutation.mutate(data) // UI lags behind server

// ❌ No invalidation after mutations
mutation.mutate(data, {
  onSuccess: () => {
    // UI doesn't update
  }
})
```

---

## State Management

### Component State vs Global State

**Good:**
```tsx
// Local state for UI
const [isModalOpen, setIsModalOpen] = useState(false)
const [activeTab, setActiveTab] = useState('overview')

// Global state for auth
const { user, logout } = useAuthStore()

// API state from queries
const { data: classrooms } = useGetTeacherClassrooms()
```

**Bad:**
```tsx
// ❌ Storing server data in useState
const [classrooms, setClassrooms] = useState([])

// ❌ Global state for UI toggles
useAuthStore.setState({ sidebarOpen: true })

// ❌ Multiple sources of truth
const [user, setUser] = useState()
const { user } = useAuthStore() // Different data
```

---

## Component Patterns

### Custom Hook Pattern

**Good:**
```tsx
export function useClassroomActions(classroomId: string) {
  const queryClient = useQueryClient()
  const createMutation = useCreateClassroom()
  const { mutate: deleteClassroom } = useDeleteClassroom()

  const createClassroom = (data: CreateClassroomData) => {
    return new Promise((resolve, reject) => {
      createMutation.mutate(data, {
        onSuccess: (result) => {
          queryClient.invalidateQueries({
            queryKey: ['classrooms']
          })
          resolve(result)
        },
        onError: reject
      })
    })
  }

  const removeClassroom = (id: string) => {
    return new Promise((resolve, reject) => {
      deleteClassroom(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['classrooms']
          })
          resolve(null)
        },
        onError: reject
      })
    })
  }

  return {
    createClassroom,
    removeClassroom,
    isCreating: createMutation.isPending,
    isDeleting: false
  }
}

// Usage
export function TeacherClassrooms() {
  const { createClassroom, removeClassroom, isCreating } = useClassroomActions()

  return (
    <button onClick={() => createClassroom(data)} disabled={isCreating}>
      Create
    </button>
  )
}
```

### Compound Component Pattern

**Good:**
```tsx
export function Card({ children }: Props) {
  return <div className="bg-white rounded border">{children}</div>
}

export function CardHeader({ children }: Props) {
  return <div className="border-b pb-4">{children}</div>
}

export function CardTitle({ children }: Props) {
  return <h2 className="text-2xl font-bold">{children}</h2>
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  {/* Content */}
</Card>
```

---

## Do's and Don'ts

### ✅ Do's

1. **Do use TypeScript for type safety**
   ```tsx
   interface ClassroomFormData {
     name: string
     categoryId: string
   }
   ```

2. **Do validate input on both frontend and backend**
   ```tsx
   if (!email.includes('@')) {
     setErrors({email: 'Invalid email'})
   }
   ```

3. **Do show loading states**
   ```tsx
   <Button isLoading={mutation.isPending}>Save</Button>
   ```

4. **Do handle all error states**
   ```tsx
   if (error) return <Alert variant="error" />
   ```

5. **Do use semantic HTML**
   ```tsx
   <button role="button">Click me</button>
   <form onSubmit={handleSubmit}>
   ```

6. **Do optimize queries**
   ```tsx
   useQuery({
     queryKey: ['classrooms'],
     staleTime: 1000 * 60 * 5 // 5 minutes
   })
   ```

7. **Do use const for React components**
   ```tsx
   const MyComponent = () => <div>Content</div>
   ```

### ❌ Don'ts

1. **Don't use `any` type excessively**
   ```tsx
   // Bad
   const data: any = apiResponse
   
   // Good
   const data: Classroom[] = apiResponse
   ```

2. **Don't make API calls in render**
   ```tsx
   // Bad
   const MyComponent = () => {
     const data = fetch('/api/data') // Runs every render
   }
   
   // Good
   const { data } = useQuery({ queryKey: ['data'] })
   ```

3. **Don't mutate state directly**
   ```tsx
   // Bad
   classrooms.push(newClassroom)
   
   // Good
   setClassrooms([...classrooms, newClassroom])
   ```

4. **Don't use index as key in lists**
   ```tsx
   // Bad
   {items.map((item, index) => <div key={index}>{item}</div>)}
   
   // Good
   {items.map((item) => <div key={item.id}>{item}</div>)}
   ```

5. **Don't forget error boundaries**
   ```tsx
   // Always have try-catch or error states
   if (error) return <ErrorFallback />
   ```

6. **Don't hardcode strings**
   ```tsx
   // Bad
   const message = "Loading..."
   
   // Good
   const MESSAGES = {
     LOADING: "Loading..."
   }
   ```

7. **Don't skip dependency arrays**
   ```tsx
   // Bad
   useEffect(() => {
     fetchData()
   })
   
   // Good
   useEffect(() => {
     fetchData()
   }, [classroomId])
   ```

---

## Summary

These patterns ensure:
- **Consistency** across the codebase
- **Maintainability** through clear structure
- **User Experience** with proper loading/error states
- **Type Safety** through TypeScript
- **Performance** through query optimization
- **Accessibility** through semantic HTML

Always follow these patterns when adding new features!
