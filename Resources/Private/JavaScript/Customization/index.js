const scriptCache = [];

const loadScript = src => {
    const script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
};

export default src => {
    if (scriptCache.indexOf(src) === -1) {
        loadScript(src);
        scriptCache.push(src);
    }
};
