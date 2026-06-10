import type { Tab } from "../../types";

interface CircularMenuProps {
  tabs: Tab[];
  onSelect: (path: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const CircularMenu: React.FC<CircularMenuProps> = ({
  tabs,
  onSelect,
  onClose,
  isOpen,
}) => {
  if (!isOpen || tabs.length === 0) return null;

  return (
    <nav className="fixed inset-x-0 bottom-[72px] z-40 border-y border-[var(--app-border)] bg-[var(--app-surface)]/95 px-2 py-2 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => {
                onSelect(tab.path);
                onClose();
              }}
              className="flex min-w-[76px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-center text-[var(--app-muted)] transition hover:bg-[var(--app-surface-soft)] hover:text-green-600"
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-[70px] truncate text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CircularMenu;
