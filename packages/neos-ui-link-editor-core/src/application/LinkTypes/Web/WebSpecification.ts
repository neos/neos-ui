import {ILink} from "../../../domain";

export const isSuitableFor = (link: ILink) => {
    const isHttp = link.href.startsWith('http://');
    const isHttps = link.href.startsWith('https://');

    return isHttp || isHttps;
};
