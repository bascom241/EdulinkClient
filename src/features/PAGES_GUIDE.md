# Pages Guide - EdLink Feature Pages

Complete documentation for all feature pages in the EdLink application, including user flows, key features, and customization examples.

## Table of Contents

1. [Login Page](#login-page)
2. [Register Page](#register-page)
3. [Dashboard](#dashboard)
4. [Teacher Classrooms](#teacher-classrooms)
5. [Classroom Detail](#classroom-detail)
6. [Flow Diagrams](#flow-diagrams)

---

## Login Page

**Location:** `src/features/auth/LoginPage.tsx`

### Purpose
Authenticates existing users into the application with email and password.

### Key Features

- Email and password validation
- Server-side error handling
- Loading state management
- Remember me functionality (optional)
- Link to registration page
- Password recovery link
- Form validation feedback

### User Flow

```
User visits /login
    ↓
Enters email and password
    ↓
Form validates inputs
    ↓
Submits to backend
    ↓
Backend authenticates
    ↓
On success: Store token + navigate to /dashboard
On error: Show error alert
```

### Props & State

```typescript
interface LoginPageProps {}

// Internal state
{
  email: string
  password: string
  errors: { email?: string; password?: string }
  serverError: string
  isLoading: boolean
}
```

### Component Structure

```tsx
LoginPage
├── Card (Form container)
├── CardHeader (Title + description)
├── CardContent
│   ├── Alert (Error message)
│   ├── FormInput (Email)
│   ├── FormInput (Password)
│   ├── Button (Login)
│   └── Links (Register, Forgot password)
```

### Usage Example

```tsx
import { LoginPage } from '@/features/auth/LoginPage'

export function AuthLayout() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
```

### Validation Rules

```typescript
Email validation:
- Required
- Must be valid email format
- Match regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Password validation:
- Required
- Minimum 6 characters
- Error shown immediately on blur
```

### Integration Points

```tsx
// Authentication
import { useLogin } from '@/api/useAuth'
import { useAuthStore } from './store'

// On successful login:
- Save token to localStorage
- Save user data to Zustand store
- Navigate to /dashboard
- Redirect authenticated users to /dashboard
```

### Customization

Change color scheme:
```tsx
// In LoginPage.tsx
const bgGradient = 'bg-gradient-to-br from-primary-50 to-white'
// Change to: 'bg-gradient-to-br from-blue-50 to-white'
```

Add remember me:
```tsx
const [rememberMe, setRememberMe] = useState(false)

// On login success
if (rememberMe) {
  localStorage.setItem('rememberEmail', email)
}
```

---

## Register Page

**Location:** `src/features/auth/RegisterPage.tsx`

### Purpose
Allows new users to create an account with email, password, and name.

### Key Features

- Email availability validation
- Password strength requirements
- Password confirmation field
- Form validation with real-time feedback
- Server-side error handling
- Link to login page
- Auto-login after successful registration

### User Flow

```
User visits /register
    ↓
Enters email, password, name
    ↓
Frontend validation
    ↓
Submits to backend
    ↓
Backend creates account
    ↓
On success: Auto-login + navigate to /dashboard
On error: Show specific error message
```

### Registration Form Fields

```typescript
{
  name: string          // Full name
  email: string         // Email address
  password: string      // Password (min 6 chars)
  confirmPassword: string // Must match password
}
```

### Component Structure

```tsx
RegisterPage
├── Card (Form container)
├── CardHeader (Title + description)
├── CardContent
│   ├── Alert (Error message)
│   ├── FormInput (Name)
│   ├── FormInput (Email)
│   ├── FormInput (Password)
│   ├── FormInput (Confirm password)
│   ├── Button (Register)
│   └── Link (Back to login)
```

### Usage Example

```tsx
import { RegisterPage } from '@/features/auth/RegisterPage'

export function AuthFlow() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}
```

### Validation Rules

```typescript
Name validation:
- Required
- Minimum 2 characters
- Maximum 50 characters

Email validation:
- Required
- Valid email format
- Check availability on backend

Password validation:
- Required
- Minimum 6 characters
- Recommended: uppercase + number

Password confirmation:
- Must exactly match password field
```

### Email Verification Flow (Optional)

```tsx
// After registration, user is redirected to:
// /verify-email?email=user@example.com

// User receives code via email
// User enters verification code
// On success: Full account activation
```

### Customization

Add password strength meter:
```tsx
const getPasswordStrength = (password: string) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  return strength
}

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
<div className="text-sm">{strengthLabels[getPasswordStrength(password)]}</div>
```

Add terms acceptance:
```tsx
const [termsAccepted, setTermsAccepted] = useState(false)

// In form validation
if (!termsAccepted) {
  return showAlert('Please accept terms and conditions')
}
```

---

## Dashboard

**Location:** `src/features/Dashboard.tsx`

### Purpose
Main overview page displaying key statistics, charts, and quick access to major features.

### Key Features

- Welcome message with user name
- Key statistics cards (Classes, Students, Assignments, Resources)
- Activity charts (Line and bar charts using Recharts)
- Role-based content (Teacher vs Student view)
- Quick action buttons
- Recent activity list
- Responsive grid layout

### Dashboard Sections

#### Welcome Section
```tsx
<h1>Welcome back, {user?.name}! 👋</h1>
<p>{user?.role === 'ROLE_TEACHER' ? 'Here's your teaching overview' : 'Here's your learning overview'}</p>
```

#### Statistics Cards
```tsx
- Total Classes: 12
- Students: 248
- Assignments: 32
- Resources: 156
```

#### Charts
- Line Chart: Student activity over time
- Bar Chart: Resource distribution

#### Quick Actions
- Create Classroom (Teachers only)
- Join Classroom (Students only)
- View Classrooms
- Browse Resources

### Component Structure

```tsx
Dashboard
├── Welcome Section
├── Statistics Grid
│   ├── Card (Total Classes)
│   ├── Card (Students)
│   ├── Card (Assignments)
│   └── Card (Resources)
├── Charts Section
│   ├── LineChart (Activity)
│   └── BarChart (Resources)
├── Recent Activity
│   └── Activity List
└── Quick Actions
```

### Usage Example

```tsx
import Dashboard from '@/features/Dashboard'

export function MainLayout() {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  )
}
```

### Data Integration

```tsx
// Mock data (replace with API calls)
const chartData = [
  { name: 'Mon', students: 40, resources: 24 },
  { name: 'Tue', students: 30, resources: 13 },
  // ... more data
]

// Real integration:
const { data: classrooms } = useGetTeacherClassrooms()
const { data: stats } = useGetClassroomStats(classroomId)
const { data: user } = useCurrentUser()
```

### Role-Based Rendering

```tsx
// Teacher view
{user?.role === 'ROLE_TEACHER' && (
  <>
    <Button>Create Classroom</Button>
    <div>My Classrooms: {classrooms?.length}</div>
  </>
)}

// Student view
{user?.role === 'ROLE_USER' && (
  <>
    <Button>Join Classroom</Button>
    <div>Enrolled Classrooms: {classrooms?.length}</div>
  </>
)}
```

### Customization

Add more statistics:
```tsx
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-neutral-600 text-sm font-medium">Active Sessions</p>
        <p className="text-3xl font-bold text-primary-700 mt-2">5</p>
      </div>
      <div className="bg-primary-50 p-3 rounded-lg">
        <Clock className="w-8 h-8 text-primary-700" />
      </div>
    </div>
  </CardContent>
</Card>
```

Customize chart colors:
```tsx
<LineChart data={chartData}>
  <Line
    type="monotone"
    dataKey="students"
    stroke="#15803d"  // Change color
    strokeWidth={2}
  />
</LineChart>
```

---

## Teacher Classrooms

**Location:** `src/features/classroom/TeacherClassroomsPage.tsx`

### Purpose
Allows teachers to view, create, and manage all their classrooms.

### Key Features

- List all teacher's classrooms
- Create new classroom modal
- View classroom details
- Student count display
- Resource count display
- Edit classroom functionality
- Delete classroom functionality
- Search and filter classrooms
- Classroom statistics

### User Flow

```
Teacher visits /classrooms
    ↓
Loads list of their classrooms
    ↓
Teacher can:
  - Click to view details
  - Click create button to add new
  - Edit existing classroom
  - Delete classroom
  - Share classroom link
    ↓
Actions trigger API calls
    ↓
List updates automatically (query invalidation)
```

### Component Structure

```tsx
TeacherClassroomsPage
├── Header
│   ├── Title + Description
│   └── Create Classroom Button
├── Error Alert (if any)
├── Classroom Grid
│   └── ClassroomCard (repeated)
│       ├── Title
│       ├── Description
│       ├── Stats (Students, Resources)
│       ├── Category Badge
│       └── Actions (View, Edit, Delete, Share)
└── Create Modal
    ├── FormInput (Name)
    ├── FormInput (Description)
    ├── Select (Category)
    └── Buttons (Cancel, Create)
```

### Usage Example

```tsx
import TeacherClassroomsPage from '@/features/classroom/TeacherClassroomsPage'

export function TeacherDashboard() {
  return <TeacherClassroomsPage />
}
```

### Data Integration

```tsx
const { data: classrooms, isLoading } = useGetTeacherClassrooms()
const { data: categories } = useGetCategories()
const createMutation = useCreateClassroom()

// Handle creation
const handleCreate = (formData) => {
  createMutation.mutate(formData, {
    onSuccess: () => {
      // Modal closes, list updates
    }
  })
}
```

### Modal Form Validation

```typescript
Validation rules:
- Classroom name: Required, 2-100 characters
- Description: Optional, max 500 characters
- Category: Required, must select from list

Error messages shown inline on invalid fields
```

### Classroom Card Features

```tsx
<ClassroomCard>
  <h3>{classroom.name}</h3>
  <p>{classroom.description}</p>
  
  <Stats>
    <span>{classroom.studentCount} students</span>
    <span>{classroom.resourceCount} resources</span>
  </Stats>
  
  <Actions>
    <Button onClick={() => navigate(`/classroom/${classroom.id}`)}>
      View
    </Button>
    <Button onClick={() => shareLink(classroom.id)}>
      Share
    </Button>
    <Button variant="danger" onClick={() => deleteClassroom(classroom.id)}>
      Delete
    </Button>
  </Actions>
</ClassroomCard>
```

### Customization

Add search functionality:
```tsx
const [searchQuery, setSearchQuery] = useState('')

const filteredClassrooms = classrooms?.filter(cls =>
  cls.name.toLowerCase().includes(searchQuery.toLowerCase())
)

<FormInput
  placeholder="Search classrooms..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

Add sorting:
```tsx
const [sortBy, setSortBy] = useState<'name' | 'created' | 'students'>('name')

const sortedClassrooms = classrooms?.sort((a, b) => {
  if (sortBy === 'name') return a.name.localeCompare(b.name)
  if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  if (sortBy === 'students') return b.studentCount - a.studentCount
  return 0
})
```

---

## Classroom Detail

**Location:** `src/features/classroom/ClassroomDetailPage.tsx`

### Purpose
Displays detailed information about a single classroom, allowing teachers to manage resources and students.

### Key Features

- Classroom information (Name, Description, Category)
- Student list with details
- Resource list with download
- Session schedule
- Generate and share join links
- Statistics panel
- Add new resources
- Add class sessions
- Student management

### User Flow

```
User visits /classroom/:id
    ↓
Page loads classroom data
    ↓
Display:
  - Classroom info
  - Student list
  - Resources
  - Schedule
    ↓
Teacher can:
  - Add resources
  - Add sessions
  - Generate share link
  - Manage students
    ↓
Changes saved to backend
```

### Component Structure

```tsx
ClassroomDetailPage
├── Classroom Header
│   ├── Title + Description
│   ├── Category Badge
│   └── Share Button
├── Statistics Panel
│   ├── Total Students
│   ├── Total Resources
│   └── Active Sessions
├── Tabs
│   ├── Overview Tab
│   │   ├── Class Schedule
│   │   └── Recent Activity
│   ├── Students Tab
│   │   └── Student List Table
│   ├── Resources Tab
│   │   ├── Upload Form
│   │   └── Resources List
│   └── Settings Tab
│       ├── Edit Classroom
│       └── Delete Option
```

### Usage Example

```tsx
import ClassroomDetailPage from '@/features/classroom/ClassroomDetailPage'
import { useParams } from 'react-router-dom'

export function ClassroomLayout() {
  const { classroomId } = useParams()
  return <ClassroomDetailPage classroomId={classroomId!} />
}
```

### Data Integration

```tsx
const { data: classroom } = useGetClassroom(classroomId)
const { data: stats } = useGetClassroomStats(classroomId)
const uploadMutation = useAddResource()
const sessionMutation = useAddTimeTable()

// Display loading and error states
if (loading) return <Loader />
if (error) return <Alert variant="error" />
```

### Student List Table

```tsx
<Table>
  <TableHeader>
    <TableRow header>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Joined</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {classroom?.students?.map(student => (
      <TableRow key={student.id}>
        <TableCell>{student.name}</TableCell>
        <TableCell>{student.email}</TableCell>
        <TableCell>{new Date(student.joinedAt).toLocaleDateString()}</TableCell>
        <TableCell>
          <Button size="sm" variant="outline">Contact</Button>
          <Button size="sm" variant="ghost">Remove</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Resource Upload Form

```tsx
const handleFileUpload = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('classroomId', classroomId)
  
  uploadMutation.mutate(formData, {
    onSuccess: () => {
      showAlert('Resource uploaded')
    }
  })
}

<div>
  <input
    type="file"
    onChange={(e) => handleFileUpload(e.target.files![0])}
  />
  {uploadMutation.isPending && <Loader size="sm" />}
</div>
```

### Session Management

```tsx
const handleAddSession = (sessionData: SessionData) => {
  sessionMutation.mutate(
    { classroomId, ...sessionData },
    {
      onSuccess: () => {
        showAlert('Session added')
      }
    }
  )
}

// Session form
<div>
  <Select label="Day" defaultValue="Monday">
    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
      <option key={day} value={day}>{day}</option>
    ))}
  </Select>
  <FormInput type="time" label="Start Time" />
  <FormInput type="time" label="End Time" />
  <Button onClick={handleAddSession}>Add Session</Button>
</div>
```

### Share Link Feature

```tsx
const handleShareLink = async () => {
  generateMutation.mutate(classroomId, {
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.link)
      showAlert('Link copied to clipboard!')
    }
  })
}

<Button onClick={handleShareLink} icon={<Share2 />}>
  Generate Share Link
</Button>
```

### Customization

Add export to CSV:
```tsx
const handleExportStudents = () => {
  const csv = classroom?.students?.map(s => 
    `${s.name},${s.email},${s.joinedAt}`
  ).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'students.csv'
  a.click()
}
```

Add bulk student management:
```tsx
const [selectedStudents, setSelectedStudents] = useState<string[]>([])

const handleRemoveSelected = () => {
  selectedStudents.forEach(id => {
    removeStudentMutation.mutate(id)
  })
}

<Button
  variant="danger"
  onClick={handleRemoveSelected}
  disabled={selectedStudents.length === 0}
>
  Remove {selectedStudents.length} Student(s)
</Button>
```

---

## Flow Diagrams

### Authentication Flow

```
┌─────────────┐
│   Home      │
└──────┬──────┘
       │
       ├─→ [Login] ──→ [Email & Pass] ──→ [Backend Validate] ─┐
       │                                                       │
       ├─→ [Register] ──→ [Name, Email, Pass] ──→ Backend ───┤
       │                                                       │
       └─→ [Logged In] ──→ Check Token in Storage ───────────┤
                                                              │
                                         [Success] ──→ Dashboard
                                         [Fail] ──→ Redirect to Login
```

### Classroom Access Flow

```
┌───────────────────┐
│  Logged in User   │
└────────┬──────────┘
         │
    ┌────┴─────┐
    │           │
    ▼           ▼
[Teacher]   [Student]
    │           │
    ├─→ Create   │
    │  Classroom └─→ Join Classroom
    │   (Form)       (Join Code)
    │    │            │
    ▼    ▼            ▼
   [My Classrooms] [Enrolled Classes]
         │                │
         └────┬───────────┘
              │
              ▼
        [Classroom Detail]
        - View Resources
        - See Schedule
        - View Students (Teacher only)
```

### Resource Upload Flow

```
Teacher in Classroom
    │
    ├─→ Click "Upload Resource"
    │
    ├─→ Select File
    │
    ├─→ Submit Form
    │
    ├─→ Frontend Validation
    │
    ├─→ Multipart Form Data to API
    │
    ├─→ Backend Processing
    │    - Store file
    │    - Create resource record
    │
    ├─→ Success Response
    │
    └─→ Query Invalidation
        - Classroom data refetches
        - Resource list updates
        - UI shows new resource
```

---

## Navigation Structure

```
/login                           Login Page
/register                        Register Page
/dashboard                       Main Dashboard
/classrooms                      Teacher Classrooms List
/classroom/:id                   Classroom Detail
/classroom/:id/students          Student Management
/classroom/:id/resources         Resources Tab
/join-classroom                  Join Classroom Form
/profile                         User Profile (optional)
/settings                        Settings (optional)
```

---

## Responsive Behavior

All pages are mobile-first responsive:

```typescript
// Mobile (< 640px)
- Single column layouts
- Touch-friendly buttons
- Bottom navigation (BottomBar)
- Full-width forms
- Stacked cards

// Tablet (640px - 1024px)
- Two column layouts where appropriate
- Regular navigation
- Optimized spacing

// Desktop (> 1024px)
- Multi-column grids
- Side navigation (SideBar)
- Wider content areas
- Expanded details
```

---

## Performance Tips

1. **Code Splitting**
   ```tsx
   const TeacherClassrooms = lazy(() => import('@/features/classroom/TeacherClassroomsPage'))
   
   <Suspense fallback={<Loader />}>
     <TeacherClassrooms />
   </Suspense>
   ```

2. **Query Optimization**
   ```tsx
   // Avoid duplicate queries
   const classrooms = useGetTeacherClassrooms()
   // Don't fetch again in child components
   ```

3. **Memoization**
   ```tsx
   const ClassroomCard = memo(({ classroom }: Props) => (
     // Card component
   ))
   ```

4. **Image Optimization**
   ```tsx
   // Use proper image sizes
   <img src={classroom.thumbnail} alt={classroom.name} loading="lazy" />
   ```
