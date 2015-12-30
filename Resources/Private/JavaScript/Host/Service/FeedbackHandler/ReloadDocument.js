export default feedback => {
    const {documentContextPath} = feedback.payload;

    [].slice.call(document.querySelectorAll(`iframe[data-context-path="${documentContextPath}"]`)).forEach(iframe => {
        const iframeWindow = iframe.contentWindow || iframe;

        iframeWindow.location.href = iframeWindow.location.href;
    });
};
