import type { IconType } from "react-icons";
import { HiOutlineSparkles } from "react-icons/hi";

type Props = {
  title: string;
  description: string;
  icon?: IconType;
  stats?: Array<{ label: string; value: string | number }>;
};

const PlaceholderScreen = ({ title, description, icon: Icon = HiOutlineSparkles, stats = [] }: Props) => {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Icon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
          <Icon size={26} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Ready for the next backend step</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
          The screen is routed and styled. Once the matching service data is available, this layout can render it without changing navigation.
        </p>
      </section>
    </div>
  );
};

export default PlaceholderScreen;
