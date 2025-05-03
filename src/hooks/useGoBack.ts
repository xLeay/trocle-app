import { useRouter } from 'expo-router'

export function useGoBack(onGoBack?: () => unknown) {
    const router = useRouter()
    return () => {
        onGoBack?.()
        if (router.canGoBack()) {
            router.back()
        } else {
            router.push('/')
        }
    }
}
