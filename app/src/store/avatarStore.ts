import { create } from 'zustand'

export type Gender = 'female' | 'male'

interface AvatarStore {
  gender: Gender
  setGender: (g: Gender) => void
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  gender: 'female',
  setGender: (gender) => set({ gender }),
}))
