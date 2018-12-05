import bus from './EventBus.js';

const preLoad = (resources) => {
    let loaded = 0;
    resources.forEach( (path) => {
        const img = new Image();
        img.onload = () => {
            loaded += 1;
            if (loaded === resources.length) {
                bus.emit('preload:loaded');
            }
        };
        img.src = path;
    });
};

export default preLoad;
