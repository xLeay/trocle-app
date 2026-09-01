import { AuthError, Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type AuthStore = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    initialized: boolean;
    error: AuthError | null;
    hasCompletedOnboarding: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } }>;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } }>;
    signOut: () => Promise<void>;
    fetchSession: () => Promise<void>;
    setHasCompletedOnboarding: (status: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    session: null,
    loading: false,
    initialized: false,
    error: null,
    hasCompletedOnboarding: false,
    signIn: async (email, password) => {
        set({ loading: true })
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            console.error('SignIn error:', error)
            // alert(error.message)
            set({ error })
        } else {
            set({ user: data.user, session: data.session })
        }

        set({ loading: false })
        return { error, data }
    },

    signUp: async (email, password) => {
        set({ loading: true })
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
            console.error('SignUp error:', error)
            // alert(error.message)
            set({ error })
        } else {
            set({ user: data.user, session: data.session, hasCompletedOnboarding: false })
            if (!data.session) {
                alert('Veuillez vérifier votre boîte mail pour confirmer votre inscription.')
            }
        }

        set({ loading: false })
        return { error, data }
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('SignOut error:', error)
            set({ error })
        }
        set({ user: null, session: null })
    },

    fetchSession: async () => {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession()
        if (error) {
            console.error('FetchSession error:', error)
            set({ error })
        }
        set({ session, user: session?.user ?? null, initialized: true })
    },

    setHasCompletedOnboarding: (status) => set({ hasCompletedOnboarding: status }),
}))
