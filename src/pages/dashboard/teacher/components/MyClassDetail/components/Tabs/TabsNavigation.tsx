import type { Tab } from "../../types/classroom.types";

type Props = {
  tabs: Tab[];
  selectedTab: Tab["id"];
  onTabChange: (tab: Tab["id"]) => void;
};

const TabsNavigation = ({ tabs, selectedTab, onTabChange }: Props) => {
  return (
    <div className="mb-5 overflow-x-auto">
      <div className="inline-flex min-w-full sm:min-w-0 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`min-w-32 flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              selectedTab === tab.id
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsNavigation;
