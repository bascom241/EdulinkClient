import { create } from "zustand";
import { persist } from "zustand/middleware";

type RequestTokenFormDataType = {
  email: string;
};

type TokenLoginStore = {
  requestTokenFormData: RequestTokenFormDataType;
  setRequestTokenFormData: (data: Partial<RequestTokenFormDataType>) => void;
  resetForm: () => void;

  expiresAt: Date | null;
  setExpiresToken: (data: Date) => void;
};

export const useTokenLoginStore = create<TokenLoginStore>()(
  persist(
    (set) => ({
      requestTokenFormData: { email: "" },
      expiresAt: null,

      setRequestTokenFormData: (data) =>
        set((state) => ({
          requestTokenFormData: { ...state.requestTokenFormData, ...data },
        })),

      resetForm: () =>
        set({
          requestTokenFormData: { email: "" },
          expiresAt: null,
        }),

      setExpiresToken: (data) => set({ expiresAt: data }),
    }),


    {
      name: "token-login-store",
      version: 1,
      // optional: transform Date to string before saving
      // storage default is localStorage
      partialize: (state) => ({
        ...state,
        expiresAt: state.expiresAt?.toISOString() || null,
      }),
      // optional: restore Date object after reading from storage
      // you can handle this inside your getter if needed
    }
  )
);