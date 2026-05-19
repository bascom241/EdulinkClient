# EdLink Design System & Component Library

A clean, scalable, and maintainable component library built with React, TypeScript, and Tailwind CSS for the EdLink platform.

## 🎨 Design Principles

- **Clean & Simple**: No unnecessary complexity or gradients
- **Brand Colors**: Primary green (#15803d) and white with neutral grays
- **Accessible**: WCAG compliant with proper focus states
- **Responsive**: Mobile-first, works on all screen sizes
- **Scalable**: Modular components for easy maintenance

## 📦 Component Library

### Base UI Components

All components are located in `src/components/ui/`

#### **Button**
```tsx
<Button 
  variant="primary" // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size="md" // 'sm', 'md', 'lg'
  fullWidth={false}
  isLoading={false}
  icon={<Icon />}
>
  Click me
</Button>
```
**Variants:**
- `primary`: Green background, white text (main action)
- `secondary`: Light gray background (secondary action)
- `outline`: Bordered style with green text
- `danger`: Red background for destructive actions
- `ghost`: Transparent with hover effect

#### **Alert**
```tsx
<Alert
  variant="success" // 'success', 'error', 'warning', 'info'
  title="Title"
  message="Alert message"
  dismissible={true}
  onClose={() => {}}
/>
```

#### **Card**
```tsx
<Card interactive={false}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer */}
  </CardFooter>
</Card>
```

#### **FormInput**
```tsx
<FormInput
  label="Email"
  type="email"
  placeholder="your@email.com"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error="Error message"
  helperText="Helper text"
  icon={<Icon />}
  fullWidth={true}
/>
```

#### **Modal**
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  description="Optional description"
  size="md" // 'sm', 'md', 'lg', 'xl'
  footer={
    <>
      <Button>Cancel</Button>
      <Button>Confirm</Button>
    </>
  }
>
  {/* Modal content */}
</Modal>
```

#### **Badge**
```tsx
<Badge 
  variant="primary" // 'primary', 'secondary', 'success', 'error', 'warning', 'info'
  size="sm" // 'sm', 'md'
>
  Label
</Badge>
```

#### **Table**
```tsx
<Table>
  <TableHeader>
    <TableRow header>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### **Loader**
```tsx
<Loader 
  size="md" // 'sm', 'md', 'lg'
  color="primary" // 'primary', 'white'
  fullScreen={false}
  message="Loading..."
/>
```

#### **Form**
```tsx
<Form
  title="Form Title"
  description="Form description"
  fields={[
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'category', label: 'Category', type: 'select', 
      options: [{ value: '1', label: 'Option 1' }] },
  ]}
  values={values}
  errors={errors}
  onSubmit={handleSubmit}
  onFieldChange={handleFieldChange}
  submitLabel="Submit"
/>
```

## 🎯 Feature Components

### Authentication
- **LoginPage** (`src/features/auth/LoginPage.tsx`)
- **RegisterPage** (`src/features/auth/RegisterPage.tsx`)
- **Auth Store** (`src/features/auth/store.ts`) - Zustand store for auth state

### Classroom Management
- **TeacherClassroomsPage** - List and manage classrooms
- **ClassroomDetailPage** - View classroom details, share links, manage resources

## 🔌 API Integration

All API hooks are in `src/api/`

### useAuth.ts
- `useLogin()` - Login user
- `useRegister()` - Register new user
- `useVerify()` - Verify email
- `useRefreshToken()` - Refresh access token
- `useForgotPassword()` - Request password reset
- `useUpdateRole()` - Update user role
- `useCurrentUser()` - Get current user

### useClassroom.ts
- `useCreateClassroom()` - Create new classroom
- `useGetCategories()` - Fetch classroom categories
- `useCreateCategory()` - Create new category
- `useGetTeacherClassrooms()` - Get teacher's classrooms
- `useGetStudentClassrooms()` - Get student's classrooms
- `useGetAllClassrooms()` - Get all available classrooms
- `useGetClassroom()` - Get specific classroom
- `useJoinClassroom()` - Join classroom with code
- `useGenerateJoinLink()` - Generate shareable link
- `useGetClassroomStats()` - Get classroom statistics
- `useAddResource()` - Upload classroom resource
- `useAddTimeTable()` - Add classroom session

## 🎨 Color Palette

```
Primary Green: #15803d
Light Green: #22c55e (hover), #16a34a (focus)
White: #ffffff
Gray 50: #f9fafb
Gray 100: #f3f4f6
Gray 200: #e5e7eb
Gray 700: #374151
Gray 900: #111827
```

## 📐 Spacing Scale

- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 2.5rem (40px)
- `3xl`: 3rem (48px)

## 🔤 Typography

- **Display**: 2.25rem, bold
- **Heading 1**: 1.875rem, bold
- **Heading 2**: 1.5rem, semibold
- **Heading 3**: 1.25rem, semibold
- **Body**: 1rem, normal
- **Small**: 0.875rem, normal
- **Tiny**: 0.75rem, normal

## 🎬 Animations

- `transition-fast`: 150ms
- `transition-base`: 250ms (default)
- `transition-slow`: 350ms

Custom animations:
- `animate-slide-up` - Slide up with fade
- `animate-fade-in` - Fade in
- `animate-slide-in-left` - Slide from left
- `animate-slide-in-right` - Slide from right

## 🏗️ Project Structure

```
src/
├── api/                          # API integration
│   ├── client.ts                 # Axios client setup
│   ├── useAuth.ts                # Authentication hooks
│   └── useClassroom.ts           # Classroom hooks
├── components/
│   └── ui/                       # UI Components
│       ├── Button.tsx
│       ├── Alert.tsx
│       ├── Card.tsx
│       ├── FormInput.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── Table.tsx
│       ├── Loader.tsx
│       ├── Form.tsx
│       └── index.ts              # Component exports
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── store.ts
│   └── classroom/
│       ├── TeacherClassroomsPage.tsx
│       └── ClassroomDetailPage.tsx
├── layouts/
│   └── MainLayout.tsx            # Dashboard layout
└── styles/
    └── index.css                 # Global styles
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Import components**
   ```tsx
   import { Button, Card, FormInput } from '@/components/ui'
   ```

4. **Use API hooks**
   ```tsx
   import { useLogin } from '@/api/useAuth'
   
   const loginMutation = useLogin()
   ```

## 📝 Component Usage Examples

### Building a login form
```tsx
import { Button, FormInput, Card } from '@/components/ui'
import { useLogin } from '@/api/useAuth'

export default function LoginForm() {
  const loginMutation = useLogin()
  const [email, setEmail] = useState('')
  
  return (
    <Card>
      <FormInput
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="primary"
        fullWidth
        onClick={() => loginMutation.mutate({ email, password })}
        isLoading={loginMutation.isPending}
      >
        Login
      </Button>
    </Card>
  )
}
```

## 🔒 Accessibility

- All interactive elements have proper focus states
- Color contrast meets WCAG AA standards
- Semantic HTML used throughout
- ARIA labels where appropriate
- Keyboard navigation supported

## 📱 Responsive Design

Components are mobile-first and fully responsive:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🤝 Contributing

When adding new components:
1. Follow the existing component structure
2. Use TypeScript for type safety
3. Include proper prop documentation
4. Ensure accessibility compliance
5. Test on mobile and desktop
