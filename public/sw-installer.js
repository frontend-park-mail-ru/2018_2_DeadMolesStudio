navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then( (registration) => {
        console.log('SW registration OK:', registration);
    })
    .catch( (err) => {
        console.log('SW registration FAIL:', err);
    });
