import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Session, User } from '@supabase/supabase-js'

type AuthStore = {
    user: User | null
    session: Session | null
    loading: boolean
    initialized: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    fetchSession: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    session: null,
    loading: false,
    initialized: false,
    signIn: async (email, password) => {
        set({ loading: true })
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            console.error('SignIn error:', error)
            alert(error.message)
        } else {
            set({ user: data.user, session: data.session })
        }

        set({ loading: false })
    },

    signUp: async (email, password) => {
        set({ loading: true })
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
            console.error('SignUp error:', error)
            alert(error.message)
        } else {
            set({ user: data.user, session: data.session })
            if (!data.session) {
                alert('Veuillez vérifier votre boîte mail pour confirmer votre inscription.')
            }
        }

        set({ loading: false })
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('SignOut error:', error)
        }
        set({ user: null, session: null })
    },

    fetchSession: async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession()
        set({ session, user: session?.user ?? null, initialized: true })
    },
}))
