import Button from "../../../../../components/ui/Button";
import type { Classroom } from "../../../../../types/classroomTypes";

type Props = {
  classroom: Classroom | null;
  onClose: () => void;
};

const ClassroomDrawer = ({ classroom, onClose }: Props) => {
  if (!classroom) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay with blur effect */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
      />

      {/* Drawer with slide animation */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in overflow-y-auto">
        {/* Decorative accent bar */}
        <div className="absolute top-0 left-0 h-1 w-full bg-green-500" />

        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-6 pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">
                Classroom Info
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Details
              </h2>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Class Name Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Class Name
              </label>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {classroom.name}
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Description
              </label>
            </div>
            <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
              {classroom.description}
            </p>
          </div>

          {/* Price and Students Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                {/* Naira Icon */}
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 font-bold text-sm">
                  ₦
                </div>

                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Price
                </label>
              </div>

              <p className="text-2xl font-bold text-green-600">
                ₦{Number(classroom.price).toLocaleString()}
              </p>
            </div>

            {/* Students */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Students
                </label>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {classroom.students?.length || 0}
                <span className="text-sm font-normal text-gray-500">
                  /{classroom.maximumStudent}
                </span>
              </p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((classroom.students?.length || 0) / classroom.maximumStudent) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    End Date
                  </label>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(classroom.endDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Time remaining</div>
                <div className="text-sm font-semibold text-purple-600">
                  {Math.ceil((new Date(classroom.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 ">

            <Button type="submit" className="mt-3 flex items-center justify-center bg-green-500 px-4 rounded-md border border-green-200 hover:border-green-300 transition-all">
              Start Session
            </Button>


            <Button type="submit" className="mt-3 flex items-center justify-center bg-white px-4 rounded-md border border-green-200 hover:border-green-300 hover:bg-gray-100 transition-all ">
              <p className="text-green-950">
                Add Session
              </p>
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDrawer;

