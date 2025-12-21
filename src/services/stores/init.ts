export const initStores = async () => {
    const { useProjectStore } = await import('./project');
    const { useUserStore } = await import('./user');
    try {
        await useUserStore().loadUsers();
        import.meta.env.DEV && console.log('🍍 User store initialized');
    } catch (e) {
        console.warn('Failed to initialize user store:', e);
    }

    try {
        await useProjectStore().loadProjects();
        import.meta.env.DEV && console.log('🍍 Projects store initialized');
    } catch (e) {
        console.warn('Failed to initialize project store:', e);
    }
};
