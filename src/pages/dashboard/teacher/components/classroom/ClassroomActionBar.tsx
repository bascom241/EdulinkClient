// components/classroom/ClassroomActionBar.tsx

import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";

type Props = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onCreate: () => void;
};

const ClassroomActionBar = ({
  searchQuery,
  setSearchQuery,
  onCreate,
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

      {/* Search */}
      <div className="relative w-full md:w-96 text-sm">
        <HiOutlineSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
        />

        <input
          type="text"
          placeholder="Search classes by name or ID..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full focus:ring-2 focus:ring-[#10b981]/20 outline-none transition-all"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-full md:w-auto">

        <button
          className="flex-1 md:flex-none px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Bulk Action
        </button>

        <button
          onClick={onCreate}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#10b981] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#059669] transition-all shadow-sm"
        >
          <HiOutlinePlus className="w-4 h-4" />

          Create Class
        </button>
      </div>
    </div>
  );
};

export default ClassroomActionBar;