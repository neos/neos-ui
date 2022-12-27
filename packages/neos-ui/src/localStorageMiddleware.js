//
// Local storage middleware.
//
// Saves relevant parts of the state to local storage on every action
// that matches the "persistentActionsPattern"
//
const localStorageMiddleware = ({getState}) => {
    let timer = null;
    const debounceLocalStorageTimeout = 100;
    const persistentActionsPatterns = [
        '@neos/neos-ui/UI/LeftSideBar/TOGGLE',
        '@neos/neos-ui/UI/LeftSideBar/TOGGLE_CONTENT_TREE',
        '@neos/neos-ui/UI/LeftSideBar/TOGGLE_SEARCH_BAR',
        '@neos/neos-ui/UI/RightSidebar/TOGGLE',
        '@neos/neos-ui/UI/Drawer/TOGGLE_MENU_GROUP'
    ];

    return next => action => {
        const returnValue = next(action);

        const actionMatched = persistentActionsPatterns
            .some(pattern => action.type === pattern);

        // If UI kind of action, persist state to local storage
        if (actionMatched) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const state = getState();
                // TODO: figure out a more declarative way to manage this
                const persistentStateSubset = {
                    ui: {
                        drawer: {
                            collapsedMenuGroups: state?.ui?.drawer?.collapsedMenuGroups
                        },
                        leftSideBar: {
                            isHidden: state?.ui?.leftSideBar?.isHidden,
                            contentTree: {
                                isHidden: state?.ui?.leftSideBar?.contentTree?.isHidden
                            },
                            searchBar: {
                                isVisible: state?.ui?.leftSideBar?.searchBar?.isVisible
                            }
                        },
                        rightSideBar: {
                            isHidden: state?.ui?.rightSideBar?.isHidden
                        }
                    }
                };
                localStorage.setItem('persistedState', JSON.stringify(persistentStateSubset));
                timer = null;
            }, debounceLocalStorageTimeout);
        }

        return returnValue;
    };
};

export default localStorageMiddleware;
