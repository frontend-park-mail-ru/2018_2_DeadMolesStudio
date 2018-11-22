if (navigator.serviceWorker !== undefined) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .catch( (err) => {
            console.log('SW registration FAIL:', err);
        });
}
