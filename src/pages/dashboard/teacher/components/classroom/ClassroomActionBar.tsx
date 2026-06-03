// components/classroom/ClassroomActionBar.tsx

import {
  HiOutlineArchive,
  HiOutlineDownload,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlineSearch,
} from "react-icons/hi";

type Props = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
  selectedCount: number;
  onBulkArchive: () => void;
  onExport: () => void;
  onCreate: () => void;
  isBulkPending?: boolean;
};

const ClassroomActionBar = ({
  searchQuery,
  setSearchQuery,
  filterValue,
  setFilterValue,
  selectedCount,
  onBulkArchive,
  onExport,
  onCreate,
  isBulkPending = false,
}: Props) => {
  return (
    <div className="app-panel flex flex-col rounded-2xl p-4 gap-4 lg:flex-row lg:items-center lg:justify-between">

      {/* Search */}
      <div className="relative w-full text-sm lg:max-w-md">
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
          className="app-control w-full pl-10 pr-4 py-2.5 rounded-lg transition-all"
        />
      </div>

      {/* Buttons */}
      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
        <label className="app-control flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
          <HiOutlineFilter className="h-4 w-4 text-green-600" />
          <select
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            aria-label="Filter classrooms"
          >
            <option value="all">All</option>
            <option value="online">Online</option>
            <option value="physical">Physical</option>
            <option value="hybrid">Hybrid</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="full">Full</option>
          </select>
        </label>

        <button
          onClick={onExport}
          className="app-button-secondary flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          <HiOutlineDownload className="h-4 w-4" />
          Export
        </button>

        <button
          onClick={onBulkArchive}
          disabled={selectedCount === 0 || isBulkPending}
          className="app-button-secondary col-span-2 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1"
        >
          <HiOutlineArchive className="h-4 w-4" />
          {isBulkPending ? "Archiving..." : `Archive ${selectedCount || ""}`.trim()}
        </button>

        <button
          onClick={onCreate}
          className="app-button-primary col-span-2 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:col-span-1"
        >
          <HiOutlinePlus className="w-4 h-4" />

          Create Class
        </button>
      </div>
    </div>
  );
};

export default ClassroomActionBar;
