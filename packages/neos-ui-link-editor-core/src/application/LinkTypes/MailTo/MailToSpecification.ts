import {ILink} from "../../../domain";

export const isSuitableFor = (link: ILink) => link.href.startsWith('mailto:');
