import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, BookOpen, Share2, Settings, Upload, Calendar } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { useGetClassroom, useGenerateJoinLink } from '../../api/useClassroom'
import Alert from '../../components/ui/Alert'

const ClassroomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')

  const { data: classroom, isLoading } = useGetClassroom(id!)
  const generateLinkMutation = useGenerateJoinLink()

  const handleGenerateLink = async () => {
    generateLinkMutation.mutate(id!, {
      onSuccess: (data) => {
        setShareLink(data.joinLink || data.joinCode)
      },
    })
  }

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-200 border-t-primary-700 rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading classroom...</p>
        </div>
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className="p-6">
        <Alert
          variant="error"
          title="Not Found"
          message="Classroom not found"
          dismissible
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{classroom.name}</h1>
          <p className="text-neutral-600 mt-2">{classroom.description}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="md"
            icon={<Share2 className="w-5 h-5" />}
            onClick={() => {
              handleGenerateLink()
              setIsShareModalOpen(true)
            }}
          >
            Share
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<Settings className="w-5 h-5" />}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="text-neutral-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-primary-700 mt-2">{classroom.studentCount}</p>
            </div>
            <Users className="w-12 h-12 text-primary-100" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="text-neutral-600 text-sm">Total Resources</p>
              <p className="text-3xl font-bold text-primary-700 mt-2">{classroom.resourceCount}</p>
            </div>
            <BookOpen className="w-12 h-12 text-primary-100" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="text-neutral-600 text-sm">Category</p>
              {classroom.category && (
                <Badge variant="primary" className="mt-2">
                  {classroom.category.name}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resources Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Study materials and content</CardDescription>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Upload className="w-4 h-4" />}
              >
                Upload
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">No resources uploaded yet</p>
              <Button  size="sm" className="mt-4">
                Add Resource
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-neutral-600 text-sm">No sessions scheduled</p>
              <Button  size="sm" className="mt-4">
                Add Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Classroom"
        description="Share this link with students to join your classroom"
        size="sm"
        footer={
          <>
            <Button
              
              size="md"
              onClick={() => setIsShareModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCopyLink}
              disabled={!shareLink}
            >
              Copy Link
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {shareLink ? (
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
              <p className="text-sm text-neutral-600 mb-2">Share this link:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            <Button
              variant="primary"
              fullWidth
              isLoading={generateLinkMutation.isPending}
              onClick={handleGenerateLink}
            >
              Generate Link
            </Button>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ClassroomDetailPage
