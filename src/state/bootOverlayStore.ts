import { create } from 'zustand';

type BootOverlayStore = {
    visible: boolean;
    exitRequested: boolean;
    reset: () => void;
    requestExit: () => void;
    hide: () => void;
};

export const useBootOverlayStore = create<BootOverlayStore>((set) => ({
    visible: true,
    exitRequested: false,

    reset: () => {
        set({
            visible: true,
            exitRequested: false,
        });
    },

    requestExit: () => {
        set({ exitRequested: true });
    },

    hide: () => {
        set({ visible: false });
    },
}));