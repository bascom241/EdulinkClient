import { Fragment } from "react/jsx-runtime";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../../../../utils/apiError";

type SessionTimeTableRequest = {
  classId: string;
  startTime: string;
  endTime: string;
  topic: string;
  liveRoomUrl?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedClass?: any; // Use your Classroom type here
  onSubmit?: (data: SessionTimeTableRequest) => Promise<void>;
  isPending?: boolean;
};

const CreateTimeTable = ({ isOpen, onClose, selectedClass, onSubmit, isPending }: Props) => {
  const [formData, setFormData] = useState<SessionTimeTableRequest>({
    classId: selectedClass?._id || "",
    startTime: "",
    endTime: "",
    topic: "",
    liveRoomUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      classId: selectedClass?._id || "",
    }));
  }, [selectedClass?._id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (!formData.startTime) {
      toast.error("Please select start time");
      return;
    }
    if (!formData.endTime) {
      toast.error("Please select end time");
      return;
    }
    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be after start time");
      return;
    }
    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }
    if (
      formData.liveRoomUrl &&
      !/^https:\/\/meet\.google\.com\/[a-z0-9-]+/i.test(formData.liveRoomUrl.trim())
    ) {
      toast.error("Please enter a valid Google Meet link");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          ...formData,
          liveRoomUrl: formData.liveRoomUrl?.trim() || undefined,
        });
      }
      toast.success("Session added successfully");
      onClose();
      setFormData({
        classId: selectedClass?._id || "",
        startTime: "",
        endTime: "",
        topic: "",
        liveRoomUrl: "",
      });
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Failed to add session"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                  style={{ color: "#1f2937" }}
                >
                  Add Session to Timetable
                  {selectedClass && (
                    <p className="text-sm text-gray-500 mt-1">
                      Class: {selectedClass.name}
                    </p>
                  )}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic / Subject
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Algebra"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Meet Link
                    </label>
                    <input
                      type="url"
                      name="liveRoomUrl"
                      value={formData.liveRoomUrl || ""}
                      onChange={handleInputChange}
                      placeholder={selectedClass?.defaultLink || "https://meet.google.com/..."}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional. Leave empty to use the class default Google Meet link.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isPending}
                      className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#10b981" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#059669";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#10b981";
                      }}
                    >
                      {isSubmitting || isPending ? "Adding..." : "Add Session"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateTimeTable;
