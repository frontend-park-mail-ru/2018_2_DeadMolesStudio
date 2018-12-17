const swInstall = () => {
    if (navigator.serviceWorker !== undefined) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then( () => {
                console.log('sw установлен');
            })
            .catch((err) => {
                console.log('SW registration FAIL:', err);
            });
    }
};

export default swInstall;
