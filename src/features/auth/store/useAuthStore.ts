import {create} from "zustand";

type Role = "ROLE_USER" | "ROLE_TEACHER" | null 


export interface AuthStore {
    role: Role
    setRole: (role: Role) => void
}

export const useAuthStore = create<AuthStore>((set)=> ({
    role: null,
    setRole: (role) => set({role})
}))