import { create } from "zustand";

type FormDataType = {
  fullName: string;
  email: string;
  password: string;
};

type RegisterStore = {
  token: string | null;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
  formData: FormDataType;
  setFormData: (data: Partial<FormDataType>) => void;
  resetForm: () => void;
};

export const useRegisterStore = create<RegisterStore>((set) => ({
  formData: {
    fullName: "",
    email: "",
    password: "",
  },

  token: null,
  isAuthenticated: false,
  setToken: (token) =>
    set({
      token,
      isAuthenticated: true,
    }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: { fullName: "", email: "", password: "" },
    }),
}));
