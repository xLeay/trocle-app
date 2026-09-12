import { getPublicStorageUrl } from '@/src/lib/api/helper';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type UserProfile = {
    id: string;
    username: string;
    profile_picture: string | null;
    profile_header: string | null;
    bio: string | null;
    has_completed_onboarding: boolean;
}

type AuthStore = {
    user: User | null;
    session: Session | null; // identité Supabase Auth
    profile: UserProfile | null; // données Trocle
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
    profile: null,
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
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('FetchSession error:', sessionError);

            set({
                session: null,
                user: null,
                hasCompletedOnboarding: false,
                initialized: true,
            });

            return;
        }

        if (!session?.user) {
            set({
                session: null,
                user: null,
                hasCompletedOnboarding: false,
                initialized: true,
            });

            return;
        }


        const { data: userData, error: userError } = await supabase
            .from('user')
            .select(`
                id,
                username,
                profile_picture,
                profile_header,
                bio,
                has_completed_onboarding
            `)
            .eq('id', session.user.id)
            .maybeSingle();

        if (userError) {
            console.error(
                'Erreur lors de la lecture du statut onboarding:',
                userError
            );
        }

        set({
            session,
            user: session.user,
            profile: userData
                ? {
                    id: userData.id,
                    username: userData.username,
                    profile_picture: getPublicStorageUrl(
                        'user-images',
                        userData.profile_picture
                    ),
                    profile_header: getPublicStorageUrl(
                        'user-images',
                        userData.profile_header
                    ),
                    bio: userData.bio,
                    has_completed_onboarding: userData.has_completed_onboarding,
                }
                : null,
            hasCompletedOnboarding: userData?.has_completed_onboarding === true,
            initialized: true,
        });
    },

    setHasCompletedOnboarding: (status) => set({ hasCompletedOnboarding: status }),
}))
