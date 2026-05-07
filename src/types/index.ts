// types/index.ts
import type { IconType } from "react-icons";

export interface Tab {
  path: string;
  icon: IconType;
  label: string;
}

export interface TabsConfig {
  mainTabs: Tab[];
  moreTabs: Tab[];
}

export type UserRole = "ROLE_TEACHER" | "ROLE_USER" | null;

export interface User {
  id?: string;
  email?: string;
  role: UserRole;
  name?: string;
}