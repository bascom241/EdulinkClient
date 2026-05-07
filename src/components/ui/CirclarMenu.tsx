import { useEffect, useState } from 'react';
import type { Tab } from '../../types';

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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen || tabs.length === 0) return null;

  const total = tabs.length;

  // 👇 dynamic radius based on number of tabs
  const radius = Math.min(100 + total * 10, 160);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        style={{ opacity: isAnimating ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Menu Container */}
      <div className="fixed bottom-24 right-6 z-50">
        <div className="relative w-[260px] h-[260px]">

          {tabs.map((tab, index) => {
            const Icon = tab.icon;

            // ✅ Semi-circle (top arc)
            const angle = (index / (total - 1)) * 180 - 90;

            const radian = (angle * Math.PI) / 180;

            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            const delay = index * 0.05;

            return (
              <button
                key={tab.path}
                onClick={() => {
                  onSelect(tab.path);
                  onClose();
                }}
                className="absolute left-1/2 top-1/2 group"
                style={{
                  transform: isAnimating
                    ? `translate(-50%, -50%) translate(${x}px, ${y}px)`
                    : `translate(-50%, -50%) scale(0)`,
                  opacity: isAnimating ? 1 : 0,
                  transition: `
                    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s,
                    opacity 0.3s ease ${delay}s
                  `,
                }}
              >
                {/* Icon Button */}
                <div className="relative">
                  <div className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
                    <Icon size={12} className="text-green-600" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow">
                      {tab.label}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CircularMenu;