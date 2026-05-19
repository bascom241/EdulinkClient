# 🎨 EdLink UI System - Quick Reference Card

## Color Palette

```
PRIMARY GREEN        HOVER               ACTIVE              DISABLED
#15803d             #16a34a             #166534             opacity-50
```

```
WHITE               LIGHT GRAY          MEDIUM GRAY         DARK GRAY
#ffffff             #f9fafb             #e5e7eb             #374151
```

## Components at a Glance

| Component | Use For | Key Props | States |
|-----------|---------|-----------|--------|
| **Button** | Actions | variant, size, icon, isLoading | primary, secondary, outline, danger, ghost |
| **Alert** | Messages | variant, title, message, dismissible | success, error, warning, info |
| **Card** | Containers | interactive, title, description | default, hover (interactive) |
| **FormInput** | Form Fields | label, error, icon, type | normal, error, disabled |
| **Modal** | Dialogs | isOpen, title, size, footer | sm, md, lg, xl |
| **Badge** | Labels | variant, size, children | 6 color variants |
| **Table** | Data | rows, columns, headers | hover effects |
| **Loader** | Loading | size, color, fullScreen | sm, md, lg |
| **Form** | Forms | fields, values, errors, onSubmit | auto-generated |

## Button Variants

```tsx
<Button variant="primary">      // Green, solid
<Button variant="secondary">    // Gray, solid
<Button variant="outline">      // Green, bordered
<Button variant="danger">       // Red, solid
<Button variant="ghost">        // Transparent, green text
```

## Alert Variants

```tsx
<Alert variant="success" />      // Green background
<Alert variant="error" />        // Red background
<Alert variant="warning" />      // Yellow background
<Alert variant="info" />         // Blue background
```

## Badge Variants

```tsx
<Badge variant="primary" />      // Green background
<Badge variant="secondary" />    // Gray background
<Badge variant="success" />      // Green background
<Badge variant="error" />        // Red background
<Badge variant="warning" />      // Yellow background
<Badge variant="info" />         // Blue background
```

## Common Patterns

### Form with Validation
```tsx
const [values, setValues] = useState({})
const [errors, setErrors] = useState({})

const handleChange = (name, value) => {
  setValues(prev => ({ ...prev, [name]: value }))
}

const handleSubmit = async (e) => {
  e.preventDefault()
  // Validate and submit
}

return <Form
  fields={[/* ... */]}
  values={values}
  errors={errors}
  onFieldChange={handleChange}
  onSubmit={handleSubmit}
/>
```

### API Call with Loading
```tsx
const mutation = useLogin()

const handleLogin = () => {
  mutation.mutate({ email, password }, {
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    }
  })
}

return <Button isLoading={mutation.isPending}>
  Login
</Button>
```

### Conditional Card Rendering
```tsx
return (
  <Card interactive={isClickable}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{desc}</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Content */}
    </CardContent>
    <CardFooter>
      {/* Actions */}
    </CardFooter>
  </Card>
)
```

### Modal with Form
```tsx
const [isOpen, setIsOpen] = useState(false)

return <>
  <Button onClick={() => setIsOpen(true)}>Open</Button>
  
  <Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Create Item"
    footer={
      <>
        <Button variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </>
    }
  >
    {/* Form content */}
  </Modal>
</>
```

## Spacing Guide

```
Use 'gap-2' for tight    → 8px
Use 'gap-3' for normal   → 12px
Use 'gap-4' for medium   → 16px
Use 'gap-6' for large    → 24px
```

## Text Sizes

```
text-xs    → 12px (small text)
text-sm    → 14px (labels)
text-base  → 16px (body text)
text-lg    → 18px (medium heading)
text-xl    → 20px (heading)
text-2xl   → 24px (title)
text-3xl   → 30px (page title)
```

## Typography Classes

```
font-light       → 300 weight
font-normal      → 400 weight
font-medium      → 500 weight (labels)
font-semibold    → 600 weight (headings)
font-bold        → 700 weight (titles)
```

## Responsive Breakpoints

```
Default (mobile)   → < 640px
sm: 640px          → Tablets
md: 768px          → Large tablets
lg: 1024px         → Desktops
xl: 1280px         → Large desktops
```

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## State Variables Pattern

```tsx
// Form state
const [formData, setFormData] = useState({ email: '', password: '' })
const [errors, setErrors] = useState({})

// UI state
const [isOpen, setIsOpen] = useState(false)
const [selectedTab, setSelectedTab] = useState('all')

// API state (use mutations)
const mutation = useCreateItem()
const { data, isLoading, error } = useGetItems()
```

## Common CSS Classes

```
bg-primary-700        → Green background
text-primary-700      → Green text
border-primary-300    → Light green border
bg-neutral-50         → Light gray background
text-neutral-900      → Dark gray text
rounded-lg            → Large border radius
shadow-md             → Medium shadow
hover:bg-primary-50   → Light green on hover
transition-fast       → 150ms animation
```

## Error Handling Pattern

```tsx
const [error, setError] = useState('')

const handleSubmit = async () => {
  try {
    await mutation.mutate(data)
    setError('')
  } catch (err) {
    setError(err.message)
  }
}

return <>
  {error && <Alert variant="error" message={error} />}
  {/* Form */}
</>
```

## Files Location Quick Reference

```
Components → src/components/ui/
API Hooks   → src/api/
Pages       → src/features/
Store       → src/features/auth/store.ts
Styles      → src/index.css
Config      → tailwind.config.ts
```

## Import Patterns

```tsx
// Components
import { Button, Card, Modal } from '@/components/ui'

// API
import { useLogin } from '@/api/useAuth'
import { useGetClassrooms } from '@/api/useClassroom'

// Store
import { useAuthStore } from '@/features/auth/store'

// Icons
import { Menu, X, ChevronDown } from 'lucide-react'
```

---

**📖 For detailed docs, see COMPONENT_LIBRARY.md**
**🚀 For setup instructions, see IMPLEMENTATION_GUIDE.md**
