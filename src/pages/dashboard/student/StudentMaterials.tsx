import { HiOutlineBookOpen, HiOutlineExternalLink } from "react-icons/hi";
import { useMaterials } from "../../../features/workspace/hooks/useWorkspace";
import DashboardShell from "../shared/DashboardShell";

const StudentMaterials = () => {
  const { data: materials = [], isLoading } = useMaterials();

  return (
    <DashboardShell title="Materials" subtitle="Open files and links shared by your teachers." icon={HiOutlineBookOpen}>
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading materials...</div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
            {materials.map((material: any) => {
              const href = material.link || material.file?.url;
              return (
                <a key={material._id} href={href} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-100 p-5 transition hover:border-green-200 hover:bg-green-50/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-gray-900">{material.title}</h2>
                      <p className="mt-2 text-sm text-gray-500">{material.classroom?.name || "Class"} - {material.type}</p>
                    </div>
                    <HiOutlineExternalLink className="text-green-600" size={20} />
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No materials yet.</div>
        )}
      </section>
    </DashboardShell>
  );
};

export default StudentMaterials;
