import { create } from 'zustand';

interface PeopleDiscoveryState {
  invitedIds: string[];
  passedIds: string[];
  invitePerson: (id: string) => void;
  passPerson: (id: string) => void;
  clearInvite: (id: string) => void;
}

const DEMO_INVITED_IDS = ['mock-user-1', 'mock-user-3', 'mock-user-5'];

export const usePeopleDiscoveryStore = create<PeopleDiscoveryState>((set) => ({
  invitedIds: DEMO_INVITED_IDS,
  passedIds: [],
  invitePerson: (id) =>
    set((state) => ({
      invitedIds: state.invitedIds.includes(id) ? state.invitedIds : [...state.invitedIds, id],
      passedIds: state.passedIds.filter((pid) => pid !== id),
    })),
  passPerson: (id) =>
    set((state) => ({
      passedIds: state.passedIds.includes(id) ? state.passedIds : [...state.passedIds, id],
      invitedIds: state.invitedIds.filter((pid) => pid !== id),
    })),
  clearInvite: (id) =>
    set((state) => ({
      invitedIds: state.invitedIds.filter((pid) => pid !== id),
    })),
}));
