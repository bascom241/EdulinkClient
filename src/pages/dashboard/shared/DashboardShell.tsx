import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type Props = {
  title: string;
  subtitle: string;
  icon: IconType;
  action?: ReactNode;
  children: ReactNode;
};

const DashboardShell = ({ title, subtitle, icon: Icon, action, children }: Props) => {
  return (
    <div className="space-y-6">
      <section className="app-shell-card overflow-hidden rounded-2xl">
        <div className="border-b border-[var(--app-border)] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                <Icon size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{subtitle}</p>
              </div>
            </div>
            {action}
          </div>
        </div>
      </section>
      {children}
    </div>
  );
};

export default DashboardShell;
