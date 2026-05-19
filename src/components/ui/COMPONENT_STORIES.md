# Component Stories - EdLink UI Components

Visual documentation and examples for all UI components in the EdLink design system.

## Table of Contents
1. [Button](#button)
2. [FormInput & Input](#forminput--input)
3. [Card Components](#card-components)
4. [Alert](#alert)
5. [Badge](#badge)
6. [Modal](#modal)
7. [Table](#table)
8. [Loader](#loader)
9. [Form](#form)
10. [Advanced Components](#advanced-components)

---

## Button

The Button component is the primary action element across the application. It supports multiple variants, sizes, and states.

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
  disabled?: boolean
  children: React.ReactNode
}
```

### Variants

#### Primary Button
Primary action button with green background, ideal for main CTAs.

```tsx
import { Button } from '@/components/ui'

export function PrimaryButtonExample() {
  return (
    <Button variant="primary">
      Save Changes
    </Button>
  )
}
```

**Output:** Green button with white text and hover effect.

#### Secondary Button
Secondary action button for less important actions.

```tsx
import { Button } from '@/components/ui'

export function SecondaryButtonExample() {
  return (
    <Button variant="secondary">
      Cancel
    </Button>
  )
}
```

#### Outline Button
Bordered button style, useful for cancel or alternative actions.

```tsx
import { Button } from '@/components/ui'

export function OutlineButtonExample() {
  return (
    <Button variant="outline">
      Learn More
    </Button>
  )
}
```

#### Danger Button
For destructive actions like delete.

```tsx
import { Button } from '@/components/ui'

export function DangerButtonExample() {
  return (
    <Button variant="danger">
      Delete
    </Button>
  )
}
```

#### Ghost Button
Minimal button with transparent background.

```tsx
import { Button } from '@/components/ui'

export function GhostButtonExample() {
  return (
    <Button variant="ghost">
      View Details
    </Button>
  )
}
```

### Sizes

```tsx
import { Button } from '@/components/ui'

export function ButtonSizesExample() {
  return (
    <div className="space-y-4">
      <Button size="sm">Small Button</Button>
      <Button size="md">Medium Button</Button>
      <Button size="lg">Large Button</Button>
    </div>
  )
}
```

### With Icon

```tsx
import { Button } from '@/components/ui'
import { Plus, Trash2 } from 'lucide-react'

export function ButtonWithIconExample() {
  return (
    <div className="space-y-2">
      <Button icon={<Plus className="w-5 h-5" />}>
        Add New
      </Button>
      <Button variant="danger" icon={<Trash2 className="w-5 h-5" />}>
        Remove
      </Button>
    </div>
  )
}
```

### Loading State

```tsx
import { Button } from '@/components/ui'
import { useState } from 'react'

export function ButtonLoadingExample() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <Button isLoading={isLoading} onClick={handleClick}>
      Save
    </Button>
  )
}
```

### Full Width

```tsx
import { Button } from '@/components/ui'

export function ButtonFullWidthExample() {
  return (
    <Button fullWidth variant="primary">
      Submit Form
    </Button>
  )
}
```

---

## FormInput & Input

Input components for form fields with labels, error states, and helper text.

### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  containerClassName?: string
  fullWidth?: boolean
}
```

### Basic Input

```tsx
import { FormInput } from '@/components/ui'
import { useState } from 'react'

export function BasicInputExample() {
  const [value, setValue] = useState('')

  return (
    <FormInput
      label="Email Address"
      type="email"
      placeholder="user@example.com"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

### With Error State

```tsx
import { FormInput } from '@/components/ui'

export function InputWithErrorExample() {
  return (
    <FormInput
      label="Username"
      placeholder="Enter username"
      error="Username must be at least 3 characters"
      value="ab"
    />
  )
}
```

### With Helper Text

```tsx
import { FormInput } from '@/components/ui'

export function InputWithHelperTextExample() {
  return (
    <FormInput
      label="Password"
      type="password"
      placeholder="••••••••"
      helperText="Must be at least 8 characters with uppercase and numbers"
    />
  )
}
```

### With Icon

```tsx
import { FormInput } from '@/components/ui'
import { Mail, Lock } from 'lucide-react'

export function InputWithIconExample() {
  return (
    <div className="space-y-4">
      <FormInput
        label="Email"
        icon={<Mail className="w-5 h-5" />}
        placeholder="your@email.com"
      />
      <FormInput
        label="Password"
        type="password"
        icon={<Lock className="w-5 h-5" />}
        placeholder="Enter password"
      />
    </div>
  )
}
```

### Required Field

```tsx
import { FormInput } from '@/components/ui'

export function RequiredInputExample() {
  return (
    <FormInput
      label="Full Name"
      placeholder="John Doe"
      required
    />
  )
}
```

### Input Types

```tsx
import { FormInput } from '@/components/ui'

export function InputTypesExample() {
  return (
    <div className="space-y-4">
      <FormInput type="text" label="Text" />
      <FormInput type="email" label="Email" />
      <FormInput type="password" label="Password" />
      <FormInput type="number" label="Number" />
      <FormInput type="date" label="Date" />
      <FormInput type="tel" label="Phone" />
    </div>
  )
}
```

---

## Card Components

Card is a flexible content container with optional header, content, and footer sections.

### Props

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  interactive?: boolean
}
```

### Basic Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export function BasicCardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
    </Card>
  )
}
```

### Card with All Sections

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui'
import { Button } from '@/components/ui'

export function FullCardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Update your profile details below</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Email: user@example.com</p>
        <p>Role: Teacher</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Update</Button>
      </CardFooter>
    </Card>
  )
}
```

### Interactive Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export function InteractiveCardExample() {
  return (
    <Card interactive onClick={() => alert('Card clicked!')}>
      <CardHeader>
        <CardTitle>Click Me</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is an interactive card with hover effects.</p>
      </CardContent>
    </Card>
  )
}
```

### Card Grid

```tsx
import { Card, CardContent } from '@/components/ui'

export function CardGridExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Card {i}</h3>
            <p className="text-neutral-600">Content for card {i}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## Alert

Alert component for displaying success, error, warning, and info messages.

### Props

```typescript
type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  message: string
  onClose?: () => void
  dismissible?: boolean
  icon?: React.ReactNode
}
```

### Success Alert

```tsx
import { Alert } from '@/components/ui'

export function SuccessAlertExample() {
  return (
    <Alert
      variant="success"
      title="Success"
      message="Your changes have been saved successfully."
      dismissible
    />
  )
}
```

### Error Alert

```tsx
import { Alert } from '@/components/ui'

export function ErrorAlertExample() {
  return (
    <Alert
      variant="error"
      title="Error"
      message="Failed to load data. Please try again later."
      dismissible
    />
  )
}
```

### Warning Alert

```tsx
import { Alert } from '@/components/ui'

export function WarningAlertExample() {
  return (
    <Alert
      variant="warning"
      title="Warning"
      message="This action cannot be undone."
      dismissible
    />
  )
}
```

### Info Alert

```tsx
import { Alert } from '@/components/ui'

export function InfoAlertExample() {
  return (
    <Alert
      variant="info"
      title="Information"
      message="Your classroom link has been copied to clipboard."
      dismissible
    />
  )
}
```

---

## Badge

Small label component for categorization and status indication.

### Props

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
}
```

### Badge Variants

```tsx
import { Badge } from '@/components/ui'

export function BadgeVariantsExample() {
  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
      </div>
      <div className="space-x-2">
        <Badge variant="error">Error</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
      </div>
    </div>
  )
}
```

### Badge Sizes

```tsx
import { Badge } from '@/components/ui'

export function BadgeSizesExample() {
  return (
    <div className="space-x-4">
      <Badge size="sm">Small Badge</Badge>
      <Badge size="md">Medium Badge</Badge>
    </div>
  )
}
```

### Status Badges

```tsx
import { Badge } from '@/components/ui'

export function StatusBadgesExample() {
  return (
    <div className="space-y-2">
      <p>
        <Badge variant="success">Active</Badge>
      </p>
      <p>
        <Badge variant="warning">Pending</Badge>
      </p>
      <p>
        <Badge variant="error">Inactive</Badge>
      </p>
    </div>
  )
}
```

---

## Modal

Modal dialog component for important user interactions.

### Props

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnEsc?: boolean
  closeOnBackdropClick?: boolean
}
```

### Basic Modal

```tsx
import { Modal } from '@/components/ui'
import { Button } from '@/components/ui'
import { useState } from 'react'

export function BasicModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        description="Are you sure you want to proceed?"
      >
        <p>This action is permanent and cannot be undone.</p>
      </Modal>
    </>
  )
}
```

### Modal with Footer

```tsx
import { Modal } from '@/components/ui'
import { Button } from '@/components/ui'
import { useState } from 'react'

export function ModalWithFooterExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Delete Item</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Confirmation"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </>
  )
}
```

### Modal Sizes

```tsx
import { Modal } from '@/components/ui'
import { Button } from '@/components/ui'
import { useState } from 'react'

export function ModalSizesExample() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')

  return (
    <>
      <div className="space-x-2">
        <Button onClick={() => setSize('sm')}>Small</Button>
        <Button onClick={() => setSize('md')}>Medium</Button>
        <Button onClick={() => setSize('lg')}>Large</Button>
        <Button onClick={() => setSize('xl')}>XL</Button>
      </div>
      <Modal
        isOpen={true}
        onClose={() => {}}
        title={`${size.toUpperCase()} Modal`}
        size={size}
      >
        <p>This is a {size} sized modal.</p>
      </Modal>
    </>
  )
}
```

---

## Table

Structured data display component with header and body rows.

### Basic Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'

export function BasicTableExample() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Teacher' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Student' },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow header>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

## Loader

Loading indicator component for async operations.

### Props

```typescript
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
  fullScreen?: boolean
  message?: string
}
```

### Basic Loader

```tsx
import { Loader } from '@/components/ui'

export function BasicLoaderExample() {
  return <Loader />
}
```

### With Message

```tsx
import { Loader } from '@/components/ui'

export function LoaderWithMessageExample() {
  return (
    <Loader
      size="lg"
      message="Loading classrooms..."
    />
  )
}
```

### Full Screen Loader

```tsx
import { Loader } from '@/components/ui'

export function FullScreenLoaderExample() {
  return (
    <Loader
      fullScreen
      message="Initializing application..."
    />
  )
}
```

---

## Form

Complex form component with automatic field rendering and validation.

### Props

```typescript
interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

interface FormProps {
  title?: string
  description?: string
  fields: FormField[]
  values: Record<string, any>
  errors: Record<string, string>
  onSubmit: (e: React.FormEvent) => void
  onFieldChange: (name: string, value: any) => void
  submitLabel?: string
  isLoading?: boolean
}
```

### Basic Form

```tsx
import { Form } from '@/components/ui'
import { useState } from 'react'

export function BasicFormExample() {
  const [values, setValues] = useState({ email: '', name: '' })
  const [errors, setErrors] = useState({})

  const fields = [
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
    { name: 'name', label: 'Full Name', type: 'text' as const, required: true },
  ]

  return (
    <Form
      title="Create Account"
      description="Enter your details below"
      fields={fields}
      values={values}
      errors={errors}
      onFieldChange={(name, value) => setValues({ ...values, [name]: value })}
      onSubmit={(e) => {
        e.preventDefault()
        console.log('Submit', values)
      }}
      submitLabel="Create Account"
    />
  )
}
```

### Form with Select

```tsx
import { Form } from '@/components/ui'
import { useState } from 'react'

export function FormWithSelectExample() {
  const [values, setValues] = useState({ category: '' })
  const [errors, setErrors] = useState({})

  const fields = [
    {
      name: 'category',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'math', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        { value: 'english', label: 'English' },
      ],
    },
  ]

  return (
    <Form
      fields={fields}
      values={values}
      errors={errors}
      onFieldChange={(name, value) => setValues({ ...values, [name]: value })}
      onSubmit={(e) => e.preventDefault()}
    />
  )
}
```

---

## Advanced Components

### SideBar
Navigation sidebar component for main layout.

```tsx
import { SideBar } from '@/components/ui'

export function SideBarExample() {
  return <SideBar />
}
```

### BottomBar
Mobile navigation bar.

```tsx
import { BottomBar } from '@/components/ui'

export function BottomBarExample() {
  return <BottomBar />
}
```

### CircularMenu
Circular action menu for quick actions.

```tsx
import { CirclarMenu } from '@/components/ui'

export function CircularMenuExample() {
  return <CirclarMenu />
}
```

### ToggleSwitch
Switch component for boolean values.

```tsx
import { ToggleSwitch } from '@/components/ui'
import { useState } from 'react'

export function ToggleSwitchExample() {
  const [enabled, setEnabled] = useState(false)

  return (
    <ToggleSwitch
      checked={enabled}
      onChange={setEnabled}
      label="Enable notifications"
    />
  )
}
```

---

## Best Practices

1. **Button Usage**
   - Use `primary` for main CTAs
   - Use `secondary` for supporting actions
   - Use `danger` only for destructive actions
   - Always provide loading state for async operations

2. **Form Inputs**
   - Always provide labels for accessibility
   - Show error states immediately for better UX
   - Use helper text to guide users
   - Validate on blur, submit on form submission

3. **Modals**
   - Keep content concise
   - Provide clear action buttons
   - Use appropriate sizes for content
   - Ensure proper focus management

4. **Cards**
   - Use for grouping related content
   - Don't nest too many levels deep
   - Make interactive cards obvious with visual feedback

5. **Alerts**
   - Use appropriate variants for context
   - Dismiss important messages after showing
   - Position at top or inline with related content

---

## Accessibility Notes

- All components use semantic HTML
- Color is not the only indicator (use icons/text as well)
- Focus states are clearly visible
- Keyboard navigation fully supported
- ARIA labels provided where appropriate
