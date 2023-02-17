const getVersion = () => {
    /** @ts-expect-error set by build stack */
    return NEOS_UI_VERSION;
};

export default getVersion;
