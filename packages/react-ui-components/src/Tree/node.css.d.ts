export interface INodeCss {
  'header': string;
  'header__chevron': string;
  'header__chevron--isCollapsed': string;
  'header__chevron--isHiddenInIndex': string;
  'header__chevron--isLoading': string;
  'header__iconWrapper': string;
  'header__data': string;
  'header__data--isHiddenInIndex': string;
  'header__data--isHidden': string;
  'header__data--isDragging': string;
  'header__data--isDirty': string;
  'header__data--isFocused': string;
  'header__data--acceptsDrop': string;
  'header__data--deniesDrop': string;
  'header__labelWrapper': string;
  'header__label': string;
  'header__data--isActive': string;
  'contents': string;
  'dropTarget': string;
  'dropTarget--before': string;
  'dropTarget--after': string;
  'dropTarget__inner': string;
  'dropTarget__inner--acceptsDrop': string;
}

export const locals: INodeCss;
