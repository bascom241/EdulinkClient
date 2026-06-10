// components/CreateClassModal.tsx
import Input from "../../../../../components/ui/Input";
import { ClassLocation } from "../../../../../types/classroomTypes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  handleInputChange: any;
  handleSubmit: any;
  isPending: boolean;
  handleOtherLinkChange: any;
  addNewLink: any;
};

const CreateClassModal = ({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  isPending,
  handleOtherLinkChange,
  addNewLink,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Create Classroom
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CLASS NAME */}
            <div>
              <label className="block text-sm mb-1">
                Class Name
              </label>

              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter class name"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm mb-1">
                Price
              </label>

              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Class price"
              />
            </div>

            {/* MAXIMUM STUDENTS */}
            <div>
              <label className="block text-sm mb-1">
                Maximum Students
              </label>

              <Input
                type="number"
                name="maximumStudent"
                value={formData.maximumStudent}
                onChange={handleInputChange}
              />
            </div>

            {/* CLASS LEVEL */}
            <div>
              <label className="block text-sm mb-1">
                Class Level
              </label>

              <select
                name="classLevel"
                value={formData.classLevel}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none"
              >
                <option value="JUNIOR">
                  Junior
                </option>

                <option value="SENIOR">
                  Senior
                </option>
              </select>
            </div>

            {/* START DATE */}
            <div>
              <label className="block text-sm mb-1">
                Start Date
              </label>

              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="block text-sm mb-1">
                End Date
              </label>

              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>

            {/* LOCATION TYPE */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">
                Class Location
              </label>

              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none"
              >
                <option value={ClassLocation.ONLINE}>
                  Online
                </option>

                <option value={ClassLocation.PHYSICAL}>
                  Physical
                </option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none resize-none"
              />
            </div>
          </div>

          {/* ONLINE SECTION */}
          {formData.location === ClassLocation.ONLINE && (
            <div className="space-y-4 border rounded-2xl p-4">
              <h3 className="font-semibold text-lg">
                Online Class Links
              </h3>

              {/* DEFAULT LINK */}
              <div>
                <label className="block text-sm mb-1">
                  Main Meeting Link
                </label>

                <Input
                  type="text"
                  name="defaultLink"
                  value={formData.defaultLink}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/..."
                />
              </div>

              {/* OTHER LINKS */}
              <div className="space-y-3">
                <label className="block text-sm">
                  Other Links
                </label>

                {formData.otherLinks.map(
                  (
                    link: string,
                    index: number
                  ) => (
                    <Input
                      key={index}
                      type="text"
                      value={link}
                      onChange={(e) =>
                        handleOtherLinkChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Other Link ${
                        index + 1
                      }`}
                    />
                  )
                )}
              </div>

              <button
                type="button"
                onClick={addNewLink}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                + Add Another Link
              </button>
            </div>
          )}

          {/* PHYSICAL SECTION */}
          {formData.location ===
            ClassLocation.PHYSICAL && (
            <div className="space-y-4 border rounded-2xl p-4">
              <h3 className="font-semibold text-lg">
                Physical Location
              </h3>

              {/* ADDRESS */}
              <div>
                <label className="block text-sm mb-1">
                  Address
                </label>

                <Input
                  type="text"
                  name="physicalAddress"
                  value={
                    formData.physicalAddress
                  }
                  onChange={handleInputChange}
                  placeholder="Enter classroom address"
                />
              </div>

              {/* LAT/LNG */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">
                    Latitude
                  </label>

                  <Input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={
                      handleInputChange
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Longitude
                  </label>

                  <Input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={
                      handleInputChange
                    }
                  />
                </div>
              </div>

              {/* MAP PLACEHOLDER */}
              <div className="w-full h-64 rounded-2xl bg-gray-100 flex items-center justify-center border">
                <p className="text-gray-500">
                  Map Component Goes Here
                </p>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#10b981] text-white py-3 rounded-xl font-semibold hover:bg-[#059669]"
          >
            {isPending
              ? "Creating..."
              : "Create Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;
