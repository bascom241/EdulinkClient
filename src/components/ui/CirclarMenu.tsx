import { useEffect } from "react";
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
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("menu-open");

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || tabs.length === 0) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <section className="fixed inset-x-0 bottom-16 z-50 px-3 pb-3">
        <div className="app-panel mx-auto max-w-md rounded-2xl p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-sm font-semibold text-[var(--app-text)]">More</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-[var(--app-muted)] hover:bg-[var(--app-surface-soft)]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
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
                  className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-2 py-3 text-center transition hover:border-green-400 hover:bg-[var(--app-green-soft)]"
                >
                  <Icon className="h-5 w-5 text-green-600" />
                  <span className="line-clamp-2 text-xs font-semibold text-[var(--app-text)]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default CircularMenu;
