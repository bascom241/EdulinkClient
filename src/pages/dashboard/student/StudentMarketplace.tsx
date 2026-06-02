import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlineStar,
  HiOutlineUsers,
} from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";
import DashboardShell from "../shared/DashboardShell";
import Loader from "../../../components/ui/Loader";
import { classroomKeys } from "../../../features/classroom/classroomKeys";
import {
  useGetStudentMarketplace,
  useJoinMarketplaceClass,
} from "../../../features/classroom/hooks/useStudent";
import type { MarketplaceClassroom, SctaBreakdown } from "../../../types/classroomTypes";
import { getApiErrorMessage } from "../../../utils/apiError";

const levels = ["", "junior", "intermediate", "expert"];
const locations = ["", "onsite", "physical", "hybrid"];

const breakdownLabels: Array<{ key: keyof SctaBreakdown; label: string; max: number }> = [
  { key: "attendance", label: "Attendance", max: 30 },
  { key: "grades", label: "Grades", max: 25 },
  { key: "enrollment", label: "Demand", max: 20 },
  { key: "duration", label: "Focus", max: 15 },
  { key: "schedule", label: "Freshness", max: 10 },
];

const StudentMarketplace = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const marketplaceQuery = useGetStudentMarketplace({
    search,
    level,
    location,
    page: 1,
    limit: 48,
  });
  const joinClass = useJoinMarketplaceClass();

  const classrooms = marketplaceQuery.data?.classroom || [];
  const topClass = classrooms[0];
  const averageScta = useMemo(() => {
    if (!classrooms.length) return 0;
    return Math.round(
      classrooms.reduce((sum, classroom) => sum + classroom.sctaScore, 0) /
        classrooms.length
    );
  }, [classrooms]);

  const handleJoin = async (classroom: MarketplaceClassroom) => {
    try {
      const data = await joinClass.mutateAsync(classroom._id);
      if (typeof data === "string" && data.startsWith("http")) {
        window.location.href = data;
        return;
      }

      toast.success(data || "Joined class successfully");
      queryClient.invalidateQueries({
        queryKey: [...classroomKeys.all, "student-classrooms"],
      });
      queryClient.invalidateQueries({
        queryKey: [...classroomKeys.all, "marketplace"],
      });
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Could not join this class"));
    }
  };

  if (marketplaceQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" message="Loading marketplace..." />
      </div>
    );
  }

  return (
    <DashboardShell
      title="Marketplace"
      subtitle="Discover active EduLink classes ranked by SCTA, a trust score built from attendance, grades, demand, focus time, and schedule freshness."
      icon={HiOutlineShoppingBag}
      action={
        <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
          <HiOutlineStar />
          Top SCTA {topClass?.sctaScore || 0}
        </div>
      }
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Available Classes</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{classrooms.length}</p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Average SCTA</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{averageScta}</p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Best Class</p>
          <p className="mt-2 truncate text-lg font-bold text-gray-900">
            {topClass?.name || "No class yet"}
          </p>
        </div>
        <div className="app-panel rounded-2xl p-5">
          <p className="text-sm app-muted">Ranking Signal</p>
          <p className="mt-2 text-lg font-bold text-gray-900">SCTA points</p>
        </div>
      </section>

      <section className="app-panel rounded-2xl p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search classes, subjects, or skills"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-white/10 dark:bg-white/5"
            />
          </label>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm capitalize outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-white/10 dark:bg-white/5"
          >
            {levels.map((item) => (
              <option key={item || "all"} value={item}>
                {item || "All levels"}
              </option>
            ))}
          </select>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm capitalize outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-white/10 dark:bg-white/5"
          >
            {locations.map((item) => (
              <option key={item || "all"} value={item}>
                {item || "All locations"}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {classrooms.map((classroom) => (
          <article
            key={classroom._id}
            className="app-panel flex min-h-[420px] flex-col rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                    {classroom.classLevel}
                  </span>
                  <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold capitalize text-gray-600">
                    {classroom.location}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{classroom.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                  {classroom.description || "No description has been added for this class."}
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-green-600 text-white shadow-sm">
                <span className="text-xl font-bold">{classroom.sctaScore}</span>
                <span className="text-[10px] font-semibold uppercase">SCTA</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl bg-gray-50 p-3">
                <HiOutlineUsers className="text-green-600" />
                <p className="mt-2 font-semibold text-gray-900">
                  {classroom.studentsCount}/{classroom.maximumStudent}
                </p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <HiOutlineCurrencyDollar className="text-green-600" />
                <p className="mt-2 font-semibold text-gray-900">
                  {Number(classroom.price || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Price</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <HiOutlineAcademicCap className="text-green-600" />
                <p className="mt-2 truncate font-semibold text-gray-900">{classroom.owner}</p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <HiOutlineChartBar className="text-green-600" />
                SCTA breakdown
              </div>
              {breakdownLabels.map((item) => {
                const value = classroom.sctaBreakdown?.[item.key] || 0;
                const percent = Math.min(100, Math.round((value / item.max) * 100));

                return (
                  <div key={item.key}>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                      <span>{item.label}</span>
                      <span>
                        {value}/{item.max}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-green-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={() => handleJoin(classroom)}
                disabled={joinClass.isPending || classroom.isFull}
                className="app-button-primary w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {classroom.isFull
                  ? "Class full"
                  : joinClass.isPending
                  ? "Joining..."
                  : Number(classroom.price || 0) > 0
                  ? "Enroll and pay"
                  : "Join class"}
              </button>
            </div>
          </article>
        ))}
      </section>

      {!classrooms.length && (
        <div className="app-panel rounded-2xl border-dashed p-10 text-center text-gray-500">
          No marketplace classes match your filters yet.
        </div>
      )}
    </DashboardShell>
  );
};

export default StudentMarketplace;
