export const initStores = async () => {
    const { useProjectStore } = await import('./project');
    const { useUserStore } = await import('./user');

    await useUserStore()
        .loadUsers()
        .then(() => {
            console.log('User store initialized');
        });

    await useProjectStore()
        .loadProjects()
        .then(() => {
            console.log('Projects store initialized');
        });
};
