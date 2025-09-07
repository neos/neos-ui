import {ILink} from "../../../domain";

export const isSuitableFor = (link: ILink) => link.href.startsWith('asset://') && !link.href.includes('#');
