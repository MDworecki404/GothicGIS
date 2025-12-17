export const initStores = async () => {
    const {useProjectStore} = await import('./project');

    await useProjectStore().loadProjects().then(() => {
        console.log('Projects store initialized');
    })
}