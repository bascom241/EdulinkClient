import { useState } from "react";
import type { Classroom } from "../../../../../types/classroomTypes";
import { Link } from "react-router-dom";

type Props = {
  classrooms: Classroom[];
  onSelect: (classroom: Classroom) => void;
  onCreateTimeTable:() => void
};

const ClassroomTable = ({ classrooms, onSelect, onCreateTimeTable }: Props) => {
  // Function to get student capacity color
  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-red-600 bg-red-50";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };


    const [isTimeTableOpen, setIsTimeTableOpen] = useState(false);

 

  

  return (
    <div className="w-full">
      {/* Header with stats */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">All Classrooms</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
            Filter
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
            Export
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-100">
        <table className="w-full min-w-[800px]">
          {/* Table Head */}
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
                  {/* Naira Icon */}
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 font-bold text-xs">
                    ₦
                  </div>

                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </span>
                </div>
              </th>
              <th className="px-6 py-5 text-right">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
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
                    {/* Class Name Column */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {/* Avatar/Icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900 group-hover:text-green-500 transition-colors">
                            {cls.name}
                          </h2>
                          <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">
                            {cls.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Students Column */}
                    <td className="px-6 py-5">
                      <div className="space-y-2">
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
                            className={`h-full rounded-full transition-all duration-500 ${capacityPercentage >= 90
                              ? "bg-red-500"
                              : capacityPercentage >= 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              }`}
                            style={{ width: `${capacityPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-green-600">
                          ₦
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                          {Number(cls.price).toLocaleString()}
                        </span>

                        <span className="text-xs text-gray-400 ml-1">
                          NGN
                        </span>
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-5 text-right flex gap-3 justify-center">
                      <Link
                          to={`/dashboard/teacher/${cls._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <span>View Details</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>


                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium   bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200"
                        onClick={onCreateTimeTable}
                      >
                        <span>Time Table</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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