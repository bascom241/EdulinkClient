import { useState } from "react";
import {
  HiOutlineDotsVertical,
  HiOutlinePlus,
  HiOutlineSearch,
  HiChevronLeft,
  HiChevronRight,
  HiX,
  HiOutlineUserGroup,
  HiOutlineMail,
  HiOutlineAcademicCap
} from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import type { Classroom } from "../../../types/classroomTypes";

import { useCreateClassroom, useGetAllTeacherClassrooms } from "../../../features/classroom/hooks/useTeacher";
import { classroomKeys } from "../../../features/classroom/classroomKeys";

// --- Helper Functions ---
const generateDisplayId = (mongoId: string): string => {
  const shortId = mongoId.substring(0, 4) + mongoId.substring(mongoId.length - 4);
  const num = parseInt(shortId, 16) % 10000;
  return `CL-${num.toString().padStart(4, '0')}`;
};

const getInitials = (name: string) => {
  const words = name.split(" ");
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const getStatusStyles = (isFull: boolean, endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);

  if (end < now) return "bg-gray-50 text-gray-500 border-gray-100";
  if (isFull) return "bg-amber-50 text-amber-600 border-amber-100";
  return "bg-green-50 text-[#10b981] border-green-100";
};

const getStatusText = (isFull: boolean, endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);

  if (end < now) return "Archived";
  if (isFull) return "Suspended";
  return "Active";
};

const MyClass = () => {
  const queryClient = useQueryClient();

  // --- State Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endDate: "",
    price: 0,
    maximumStudent: 30,
    classLevel: "JUNIOR",
    location: "ONLINE",
    category: "",
    level: "BEGINNER"
  });

  // --- Queries ---
  const { data: classrooms = [], isLoading, error } = useGetAllTeacherClassrooms()
  const { mutate, isPending } = useCreateClassroom()

  // --- Mutations ---
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: classroomKeys.teacherClassrooms()
        });

        setIsModalOpen(false);
        toast.success("Class created successfully!");

        setFormData({
          name: "",
          description: "",
          endDate: "",
          price: 0,
          maximumStudent: 30,
          classLevel: "JUNIOR",
          location: "ONLINE",
          category: "",
          level: "BEGINNER"
        });
      },

      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create class");
      }
    });
  };

  // --- Filtered Classrooms ---
  const filteredClassrooms = classrooms.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    generateDisplayId(cls._id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedClassrooms = filteredClassrooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredClassrooms.length / itemsPerPage);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 bg-white min-h-screen font-sans text-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-white min-h-screen font-sans text-gray-700">
        <div className="text-center text-red-500">
          Error loading classrooms. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans text-gray-700 relative overflow-x-hidden">

      {/* 1. Header Section */}
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Classrooms</h1>
        <p className="text-gray-500 text-sm">Manage your classrooms and student enrollments</p>
      </div>

      {/* 2. Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96 text-sm">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search classes by name or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full focus:ring-2 focus:ring-[#10b981]/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Bulk Action
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#059669] transition-all shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" /> Create Class
          </button>
        </div>
      </div>

      {/* 3. The Modern List Table */}
      <div className="overflow-x-auto border border-gray-50 rounded-xl">
        <table className="w-full text-left min-w-[850px]">
          <thead>
            <tr className="text-gray-400 text-[11px] uppercase tracking-widest border-b border-gray-50 bg-gray-50/30">
              <th className="px-6 py-4 font-semibold w-12 text-center">
                <input type="checkbox" className="rounded accent-[#10b981]" />
              </th>
              <th className="px-6 py-4 font-semibold">Class Name</th>
              <th className="px-6 py-4 font-semibold">Class ID</th>
              <th className="px-6 py-4 font-semibold">Email Contact</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Enrollments</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedClassrooms.map((cls) => {
              const status = getStatusText(cls.isFull, cls.endDate);
              const enrollments = cls.students?.length || 0;
              const maxStudents = cls.maximumStudent;

              return (
                <tr key={cls._id} className="odd:bg-gray-50/40 hover:bg-green-50/20 transition-colors border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded accent-[#10b981]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-100 text-[#10b981] flex items-center justify-center font-bold text-xs border border-green-200 shrink-0">
                        {getInitials(cls.name)}
                      </div>
                      <span className="font-bold text-gray-800">{cls.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                    {generateDisplayId(cls._id)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{cls.owner?.email || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-tight ${getStatusStyles(cls.isFull, cls.endDate)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-semibold text-center">
                    {enrollments}/{maxStudents}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedClass(cls)}
                      className="p-2 text-gray-300 hover:text-[#10b981] hover:bg-white rounded-lg transition-all"
                    >
                      <HiOutlineDotsVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginatedClassrooms.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No classrooms found. Create your first class to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center text-sm text-gray-500 px-2">
          <p>Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Create Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">New Classroom</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <HiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form className="space-y-5" onSubmit={handleCreateClass}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#10b981] focus:ring-4 focus:ring-green-500/5 transition-all"
                  placeholder="e.g. Advanced Chemistry"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#10b981] focus:ring-4 focus:ring-green-500/5 transition-all"
                  placeholder="Class description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#10b981] focus:ring-4 focus:ring-green-500/5 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#10b981] focus:ring-4 focus:ring-green-500/5 transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Maximum Students *</label>
                <input
                  type="number"
                  name="maximumStudent"
                  value={formData.maximumStudent}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#10b981] focus:ring-4 focus:ring-green-500/5 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class Level *</label>
                <select
                  name="classLevel"
                  value={formData.classLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#10b981] focus:ring-4 focus:ring-green-500/5 transition-all"
                >
                  <option value="JUNIOR">Junior</option>
                  <option value="SENIOR">Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#10b981] focus:ring-4 focus:ring-green-500/5 transition-all"
                >
                  <option value="ONLINE">Online</option>
                  <option value="PHYSICAL">Physical</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 bg-[#10b981] text-white rounded-xl font-semibold hover:bg-[#059669] transition-all shadow-lg shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Creating..." : "Create Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Class Details Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] transition-transform duration-500 ease-in-out border-l border-gray-100 ${selectedClass ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedClass && (
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-bold text-gray-900">Class Overview</h2>
              <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Profile Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-24 h-24 rounded-3xl bg-green-50 text-[#10b981] flex items-center justify-center text-3xl font-bold border-2 border-green-100 mb-4 shadow-sm">
                {getInitials(selectedClass.name)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedClass.name}</h3>
              <p className="text-gray-400 font-mono text-sm mt-1">{generateDisplayId(selectedClass._id)}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <HiOutlineUserGroup className="text-[#10b981] mb-2 w-5 h-5" />
                <p className="text-2xl font-bold">{selectedClass.students?.length || 0}/{selectedClass.maximumStudent}</p>
                <p className="text-xs text-gray-400 font-medium uppercase">Enrolled</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <HiOutlineAcademicCap className="text-[#10b981] mb-2 w-5 h-5" />
                <p className="text-2xl font-bold">${selectedClass.price}</p>
                <p className="text-xs text-gray-400 font-medium uppercase">Price</p>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="space-y-5 flex-1 overflow-y-auto pr-2">
              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Description</label>
                <p className="text-gray-700 text-sm">{selectedClass.description}</p>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Contact Email</label>
                <div className="flex items-center gap-2 text-gray-700">
                  <HiOutlineMail className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{selectedClass.owner?.email || "N/A"}</span>
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Class Level</label>
                <p className="text-gray-700 font-medium">{selectedClass.classLevel}</p>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Location</label>
                <p className="text-gray-700 font-medium">{selectedClass.location}</p>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">End Date</label>
                <p className="text-gray-700 font-medium">{new Date(selectedClass.endDate).toLocaleDateString()}</p>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusText(selectedClass.isFull, selectedClass.endDate) === 'Active' ? 'bg-[#10b981]' : getStatusText(selectedClass.isFull, selectedClass.endDate) === 'Suspended' ? 'bg-amber-400' : 'bg-gray-400'}`} />
                  <span className="font-semibold text-gray-800">{getStatusText(selectedClass.isFull, selectedClass.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="mt-auto pt-6 flex gap-3 border-t border-gray-50">
              <button className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
                Edit Class
              </button>
              <button className="px-4 py-3 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all">
                Archive
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyClass;