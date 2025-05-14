import { create } from 'zustand';

type SnackbarType = 'default' | 'success' | 'error' | 'warning' | 'info';
type SnackbarPosition = 'top' | 'bottom';

export interface SnackbarInterface {
    id: string;
    message: string;
    type: SnackbarType;
    duration?: number;
    isPersistent?: boolean;
    action?: {
        label: string;
        onPress: () => void;
    };
    position?: SnackbarPosition;
}

interface SnackbarStore {
    snackbars: SnackbarInterface[];
    addSnackbar: (snackbar: Omit<SnackbarInterface, 'id'>) => void;
    removeSnackbar: (id: string) => void;
}

export const useSnackbarStore = create<SnackbarStore>((set) => ({
    snackbars: [],
    addSnackbar: (snackbar) =>
        set((state) => ({
            snackbars: [...state.snackbars, { ...snackbar, id: Date.now().toString() }],
        })),
    removeSnackbar: (id) =>
        set((state) => ({
            snackbars: state.snackbars.filter((snackbar) => snackbar.id !== id),
        })),
}));
