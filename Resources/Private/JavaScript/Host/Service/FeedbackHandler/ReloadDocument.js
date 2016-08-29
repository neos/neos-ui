export default feedback => {
    const {documentContextPath} = feedback.payload;

    [].slice.call(document.querySelectorAll(`iframe[name=neos-content-main]`)).forEach(iframe => {
        const iframeWindow = iframe.contentWindow || iframe;

        iframeWindow.location.href = iframeWindow.location.href;
    });
};
