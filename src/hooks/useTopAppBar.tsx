import { useMemo } from 'react';
import topAppBarConfigs from '#/display/TopAppBar/topAppBarConfigs';
import { TopAppBarProps, TopAppBarConfiguration } from '#/display/TopAppBar/types';

interface UseTopAppBarOptions extends Partial<TopAppBarProps> { }

export default function useTopAppBar(configKey: TopAppBarConfiguration, options: UseTopAppBarOptions = {}) {
    const { left, center, right } = useMemo(() => {
        const config = topAppBarConfigs[configKey];

        return {
            left: typeof config.left === 'function' ? config.left(options) : config.left,
            center: typeof config.center === 'function' ? config.center(options) : config.center,
            right: typeof config.right === 'function' ? config.right(options) : config.right,
        };
    }, [configKey, options]); // Utilisez directement l'objet options au lieu de JSON.stringify

    return { left, center, right };
}

// Usage example:
// const { left, center, right } = useTopAppBar('CONFIG_', {
//     prop1, ...
//     propN,
// });