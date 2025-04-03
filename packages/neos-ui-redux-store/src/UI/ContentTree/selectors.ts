import {GlobalState} from '../../System';

export const getToggled = (state: GlobalState) => state?.ui?.contentTree?.toggled;
export const getIsLoading = (state: GlobalState) => state?.ui?.contentTree?.isLoading;
export const getLoading = (state: GlobalState) => state?.ui?.contentTree?.loading;
export const getErrors = (state: GlobalState) => state?.ui?.contentTree?.errors;
