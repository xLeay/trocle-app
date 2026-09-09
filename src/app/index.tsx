import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/src/state/authStore';
import { useBootOverlayStore } from '@/src/state/bootOverlayStore';

export default function Index() {
    const session = useAuthStore((state) => state.session);
    const initialized = useAuthStore((state) => state.initialized);
    const hasCompletedOnboarding = useAuthStore(
        (state) => state.hasCompletedOnboarding
    );
    const fetchSession = useAuthStore((state) => state.fetchSession);

    const requestOverlayExit = useBootOverlayStore(
        (state) => state.requestExit
    );

    const resetBootOverlay = useBootOverlayStore((state) => state.reset);

    const navigationStarted = useRef(false);

    useEffect(() => {
        resetBootOverlay();
        void fetchSession();
    }, [fetchSession, resetBootOverlay]);

    useEffect(() => {
        if (!initialized || navigationStarted.current) { return; }

        navigationStarted.current = true;

        const destination = !session
            ? '/sign-in'
            : hasCompletedOnboarding
                ? '/(protected)/(drawer)/(tabs)'
                : '/(onboarding)';

        // La page suivante commence à se monter immédiatement.
        router.replace(destination as never);

        // Le logo reste devant pendant le chargement, puis « avale » l’écran.
        requestOverlayExit();
    }, [
        hasCompletedOnboarding,
        initialized,
        requestOverlayExit,
        session,
    ]);

    return null;
}
