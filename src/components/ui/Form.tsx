import React from 'react'
import FormInput from './FormInput'
import Button from './Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'



interface FormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  icon?: React.ReactNode
}

interface FormProps {
  title?: string
  description?: string
  fields: FormField[]
  values: Record<string, string>
  errors: Record<string, string>
  isLoading?: boolean
  onSubmit: (e: React.FormEvent) => void
  onFieldChange: (name: string, value: string) => void
  submitLabel?: string
  submitVariant?: 'primary' | 'secondary' | 'outline' | 'danger'
}

const Form: React.FC<FormProps> = ({
  title,
  description,
  fields,
  values,
  errors,
  isLoading = false,
  onSubmit,
  onFieldChange,
  submitLabel = 'Submit',
  submitVariant = 'primary',
}) => {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field) => {
            if (field.type === 'select') {
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <select
                    value={values[field.name] || ''}
                    onChange={(e) => onFieldChange(field.name, e.target.value)}
                    className={`
                      w-full px-4 py-2.5 text-base rounded-lg border-2 transition-fast
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${
                        errors[field.name]
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-300 focus:border-primary-700 focus:ring-primary-500'
                      }
                    `}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && (
                    <p className="text-red-600 text-sm mt-1.5">{errors[field.name]}</p>
                  )}
                </div>
              )
            }

            if (field.type === 'textarea') {
              return (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <textarea
                    value={values[field.name] || ''}
                    onChange={(e) => onFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={`
                      w-full px-4 py-2.5 text-base rounded-lg border-2 transition-fast
                      focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none
                      ${
                        errors[field.name]
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-300 focus:border-primary-700 focus:ring-primary-500'
                      }
                    `}
                    rows={4}
                  />
                  {errors[field.name] && (
                    <p className="text-red-600 text-sm mt-1.5">{errors[field.name]}</p>
                  )}
                </div>
              )
            }

            return (
              <FormInput
                key={field.name}
                label={field.label}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                error={errors[field.name]}
                icon={field.icon}
                required={field.required}
                fullWidth
              />
            )
          })}

          <Button
            type="submit"
            variant={submitVariant}
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Form
