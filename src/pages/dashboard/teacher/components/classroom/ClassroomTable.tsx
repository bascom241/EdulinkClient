import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
} from "react-icons/hi";
import type { Classroom } from "../../../../../types/classroomTypes";

type Props = {
  classrooms: Classroom[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onSelect: (classroom: Classroom) => void;
  onCreateTimeTable: (classroom: Classroom) => void;
};

const pageSizeOptions = [8, 12, 20];

const ClassroomTable = ({
  classrooms,
  selectedIds,
  onSelectedIdsChange,
  onSelect,
  onCreateTimeTable,
}: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const totalPages = Math.max(1, Math.ceil(classrooms.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = useMemo(
    () => classrooms.slice(pageStart, pageStart + pageSize),
    [classrooms, pageStart, pageSize]
  );
  const visibleIds = pageRows.map((classroom) => classroom._id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  useEffect(() => {
    setPage(1);
  }, [classrooms.length, pageSize]);

  const toggleRow = (classroomId: string) => {
    onSelectedIdsChange(
      selectedIds.includes(classroomId)
        ? selectedIds.filter((id) => id !== classroomId)
        : [...selectedIds, classroomId]
    );
  };

  const toggleVisible = () => {
    if (allVisibleSelected) {
      onSelectedIdsChange(selectedIds.filter((id) => !visibleIds.includes(id)));
      return;
    }

    onSelectedIdsChange(Array.from(new Set([...selectedIds, ...visibleIds])));
  };

  const getCapacity = (classroom: Classroom) => {
    const current = classroom.students?.length || 0;
    const max = Number(classroom.maximumStudent || 0);
    const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
    return { current, max, percent };
  };

  const getCapacityClass = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const Pagination = () => (
    <div className="flex flex-col gap-3 border-t border-[var(--app-border)] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="app-muted">
        Showing {classrooms.length === 0 ? 0 : pageStart + 1}-
        {Math.min(pageStart + pageSize, classrooms.length)} of {classrooms.length}
      </p>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <select
          value={pageSize}
          onChange={(event) => setPageSize(Number(event.target.value))}
          className="app-control rounded-lg px-2 py-1.5 text-sm"
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} rows
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={safePage === 1}
            className="app-button-secondary rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <HiOutlineChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-16 text-center font-semibold text-[var(--app-text)]">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={safePage === totalPages}
            className="app-button-secondary rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <HiOutlineChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-panel overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-2 border-b border-[var(--app-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--app-text)]">All Classrooms</h3>
          <p className="app-muted text-sm">
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : `${classrooms.length} classroom${classrooms.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="block divide-y divide-[var(--app-border)] lg:hidden">
        {pageRows.map((classroom) => {
          const capacity = getCapacity(classroom);
          const isSelected = selectedIds.includes(classroom._id);

          return (
            <article key={classroom._id} className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRow(classroom._id)}
                  className="mt-1 h-4 w-4 accent-green-600"
                  aria-label={`Select ${classroom.name}`}
                />
                <button
                  type="button"
                  onClick={() => onSelect(classroom)}
                  className="min-w-0 flex-1 text-left"
                >
                  <h4 className="truncate font-semibold text-[var(--app-text)]">
                    {classroom.name}
                  </h4>
                  <p className="app-muted mt-1 line-clamp-2 text-sm">
                    {classroom.description || "No description"}
                  </p>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="app-panel-soft rounded-xl p-3">
                  <p className="app-muted text-xs font-semibold">Students</p>
                  <p className="mt-1 font-bold text-[var(--app-text)]">
                    {capacity.current}/{capacity.max}
                  </p>
                </div>
                <div className="app-panel-soft rounded-xl p-3">
                  <p className="app-muted text-xs font-semibold">Price</p>
                  <p className="mt-1 font-bold text-[var(--app-text)]">
                    NGN {Number(classroom.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--app-surface-soft)]">
                <div
                  className={`h-full ${getCapacityClass(capacity.percent)}`}
                  style={{ width: `${capacity.percent}%` }}
                />
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/dashboard/teacher/${classroom._id}`}
                  className="app-button-primary inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <HiOutlineEye className="h-4 w-4" />
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => onCreateTimeTable(classroom)}
                  className="app-button-secondary inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <HiOutlineCalendar className="h-4 w-4" />
                  Timetable
                </button>
              </div>
            </article>
          );
        })}

        {pageRows.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-semibold text-[var(--app-text)]">No classrooms found</p>
            <p className="app-muted mt-1 text-sm">Try changing your search or filter.</p>
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[860px] table-fixed">
          <thead className="bg-[var(--app-surface-soft)]">
            <tr className="border-b border-[var(--app-border)]">
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleVisible}
                  className="h-4 w-4 accent-green-600"
                  aria-label="Select visible classrooms"
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-[var(--app-muted)]">
                Classroom
              </th>
              <th className="w-48 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-[var(--app-muted)]">
                Capacity
              </th>
              <th className="w-36 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-[var(--app-muted)]">
                Price
              </th>
              <th className="w-36 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-[var(--app-muted)]">
                Mode
              </th>
              <th className="w-48 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-[var(--app-muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--app-border)]">
            {pageRows.map((classroom) => {
              const capacity = getCapacity(classroom);
              const isSelected = selectedIds.includes(classroom._id);

              return (
                <tr
                  key={classroom._id}
                  className="transition-colors hover:bg-[var(--app-surface-soft)]"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(classroom._id)}
                      className="h-4 w-4 accent-green-600"
                      aria-label={`Select ${classroom.name}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(classroom)}
                      className="block min-w-0 text-left"
                    >
                      <p className="truncate text-sm font-semibold text-[var(--app-text)]">
                        {classroom.name}
                      </p>
                      <p className="app-muted mt-1 line-clamp-1 text-xs">
                        {classroom.description || "No description"}
                      </p>
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--app-text)]">
                        {capacity.current}/{capacity.max}
                      </span>
                      <span className="app-muted">{capacity.percent}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--app-surface-soft)]">
                      <div
                        className={`h-full ${getCapacityClass(capacity.percent)}`}
                        style={{ width: `${capacity.percent}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-[var(--app-text)]">
                    NGN {Number(classroom.price || 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <span className="app-button-secondary inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize">
                      {classroom.location || "online"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/dashboard/teacher/${classroom._id}`}
                        className="app-button-primary inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                        View
                      </Link>
                      <button
                        type="button"
                        className="app-button-secondary inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        onClick={() => onCreateTimeTable(classroom)}
                      >
                        <HiOutlineCalendar className="h-4 w-4" />
                        Time
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center">
                  <p className="font-semibold text-[var(--app-text)]">No classrooms found</p>
                  <p className="app-muted mt-1 text-sm">Try changing your search or filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination />
    </div>
  );
};

export default ClassroomTable;
