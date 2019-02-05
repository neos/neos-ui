export default function readFromConsumerApi(key) {
    return (...args) => {
        if (window['@Neos:HostPluginAPI'] && window['@Neos:HostPluginAPI'][`@${key}`]) {
            return window['@Neos:HostPluginAPI'][`@${key}`](...args);
        }

        throw new Error(`You are trying to read from a consumer api that hasn't been initialized yet!`);
    };
}
