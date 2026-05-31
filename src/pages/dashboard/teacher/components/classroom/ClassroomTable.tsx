import { useState } from "react";
import type { Classroom } from "../../../../../types/classroomTypes";
import { Link } from "react-router-dom";

type Props = {
  classrooms: Classroom[];
  onSelect: (classroom: Classroom) => void;
  onCreateTimeTable: () => void;
};

const ClassroomTable = ({ classrooms, onSelect, onCreateTimeTable }: Props) => {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  // Function to get student capacity color
  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-red-600 bg-red-50";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Header with stats */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">All Classrooms</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total <span className="font-semibold text-gray-700">{classrooms.length}</span> classroom{classrooms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            Filter
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            Export
          </button>
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="block lg:hidden space-y-4">
        {classrooms.length > 0 ? (
          classrooms.map((cls) => {
            const currentStudents = cls.students?.length || 0;
            const capacityPercentage = (currentStudents / cls.maximumStudent) * 100;
            const capacityColor = getCapacityColor(currentStudents, cls.maximumStudent);
            const isOpen = mobileMenuOpen === cls._id;

            return (
              <div
                key={cls._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => onSelect(cls)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h2 className="font-semibold text-gray-900 text-lg">
                          {cls.name}
                        </h2>
                        <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">
                          {cls.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileMenuOpen(isOpen ? null : cls._id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    {/* Students */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">Students</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${capacityColor}`}>
                          {Math.round(capacityPercentage)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {currentStudents} / {cls.maximumStudent}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            capacityPercentage >= 90 ? "bg-red-500" : capacityPercentage >= 70 ? "bg-yellow-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${capacityPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-xs font-medium text-gray-500">Price</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-emerald-600">₦</span>
                        <span className="text-lg font-bold text-gray-900">
                          {Number(cls.price).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">NGN</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={`px-5 pb-5 space-y-2 transition-all duration-200 ${isOpen ? 'block' : 'hidden'}`}>
                  <Link
                    to={`/dashboard/teacher/${cls._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200"
                    onClick={onCreateTimeTable}
                  >
                    Time Table
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 font-medium">No classrooms found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <th className="px-6 py-5 text-left">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Class Name
                  </span>
                </div>
              </th>
              <th className="px-6 py-5 text-left">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Students
                  </span>
                </div>
              </th>
              <th className="px-6 py-5 text-left">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">
                    ₦
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </span>
                </div>
              </th>
              <th className="px-6 py-5 text-right">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {classrooms.length > 0 ? (
              classrooms.map((cls) => {
                const currentStudents = cls.students?.length || 0;
                const capacityPercentage = (currentStudents / cls.maximumStudent) * 100;
                const capacityColor = getCapacityColor(currentStudents, cls.maximumStudent);

                return (
                  <tr
                    key={cls._id}
                    className="group hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                    onClick={() => onSelect(cls)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {cls.name}
                          </h2>
                          <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">
                            {cls.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-2 min-w-[160px]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {currentStudents} / {cls.maximumStudent}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${capacityColor}`}>
                            {Math.round(capacityPercentage)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              capacityPercentage >= 90 ? "bg-red-500" : capacityPercentage >= 70 ? "bg-yellow-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${capacityPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-emerald-600">₦</span>
                        <span className="text-lg font-bold text-gray-900">
                          {Number(cls.price).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">NGN</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3 justify-end">
                        <Link
                          to={`/dashboard/teacher/${cls._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <span>View Details</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>

                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateTimeTable();
                          }}
                        >
                          <span>Time Table</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">No classrooms found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassroomTable;