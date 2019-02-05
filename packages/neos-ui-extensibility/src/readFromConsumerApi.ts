export default function readFromConsumerApi(key: string): (...args: any[]) => any {
    return (...args: any[]) => {
        if ((window as any)['@Neos:HostPluginAPI'] && (window as any)['@Neos:HostPluginAPI'][`@${key}`]) {
            return (window as any)['@Neos:HostPluginAPI'][`@${key}`](...args);
        }

        throw new Error("You are trying to read from a consumer api that hasn't been initialized yet!");
    };
}
