import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import FormInput from '../../components/ui/FormInput'
import Badge from '../../components/ui/Badge'
import { useGetTeacherClassrooms, useCreateClassroom, useGetCategories } from '../../api/useClassroom'
import Alert from '../../components/ui/Alert'

const TeacherClassroomsPage: React.FC = () => {
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', categoryId: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: classrooms, isLoading: classroomsLoading, error: classroomsError } = useGetTeacherClassrooms()
  const { data: categories } = useGetCategories()
  const createClassroomMutation = useCreateClassroom()

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!formData.name.trim()) newErrors.name = 'Classroom name is required'
    if (!formData.categoryId) newErrors.categoryId = 'Please select a category'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    createClassroomMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', description: '', categoryId: '' })
        setIsCreateModalOpen(false)
      },
    })
  }

  if (classroomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-200 border-t-primary-700 rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your classrooms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Classrooms</h1>
          <p className="text-neutral-600 mt-2">Manage and create your teaching spaces</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Classroom
        </Button>
      </div>

      {/* Error Alert */}
      {classroomsError && (
        <Alert
          variant="error"
          title="Error"
          message="Failed to load your classrooms. Please try again."
          dismissible
        />
      )}

      {/* Classrooms Grid */}
      {classrooms && classrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              interactive
              onClick={() => navigate(`/dashboard/teacher/${classroom.id}`)}
            >
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900">{classroom.name}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{classroom.description}</p>
                  </div>
                  <BookOpen className="w-6 h-6 text-primary-700 flex-shrink-0" />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {classroom.category && (
                    <Badge variant="primary" size="sm">
                      {classroom.category.name}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-neutral-600 pt-2 border-t border-neutral-200">
                  <span>{classroom.studentCount} Students</span>
                  <span>{classroom.resourceCount} Resources</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900">No classrooms yet</h3>
            <p className="text-neutral-600 mt-2">Create your first classroom to get started</p>
            <Button
              variant="primary"
              size="md"
              className="mt-6"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Classroom
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Classroom Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setErrors({})
          setFormData({ name: '', description: '', categoryId: '' })
        }}
        title="Create New Classroom"
        description="Set up a new classroom for your students"
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={createClassroomMutation.isPending}
              onClick={handleCreateClassroom}
            >
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateClassroom} className="space-y-4">
          <FormInput
            label="Classroom Name"
            placeholder="e.g., Mathematics 101"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            fullWidth
          />

          <FormInput
            label="Description (Optional)"
            placeholder="Describe what students will learn"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={`
                w-full px-4 py-2.5 text-base rounded-lg border-2 transition-fast
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  errors.categoryId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-neutral-300 focus:border-primary-700 focus:ring-primary-500'
                }
              `}
            >
              <option value="">Select a category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-600 text-sm mt-1.5">{errors.categoryId}</p>}
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TeacherClassroomsPage
