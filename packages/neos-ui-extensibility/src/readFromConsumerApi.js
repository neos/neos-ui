export default function readFromConsumerApi (key, fallback) {
    if (window['@Neos:HostPluginAPI'] && window['@Neos:HostPluginAPI'][`@${key}`]) {
        return window['@Neos:HostPluginAPI'][`@${key}`];
    }

    return fallback();
}
