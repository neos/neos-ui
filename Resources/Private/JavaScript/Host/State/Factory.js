import Immutable from 'immutable';

export default serverState => Immutable.fromJS({
    ui: {
        //
        // Contains information about the left sidebar.
        //
        leftSidebar: {
            isHidden: false
        },

        //
        // Contains information about the right sidebar.
        //
        rightSidebar: {
            isHidden: false
        },

        //
        // Contains information about the currently open Tabs
        //
        tabs: {
            byId: {},
            active: {
                id: '',
                workspace: {
                    name: '',
                    publishingState: {
                        publishableNodes: [],
                        publishableNodesInDocument: []
                    }
                }
            }
        },

        contextBar: {},

        remote: {
            isSaving: false,
            isPublishing: false,
            isDiscarding: false
        },

        flashMessages: {
            'test1': {
                id: 'test1',
                message: 'Dies ist ein Test',
                severity: 'info'
            },
            'test2': {
                id: 'test2',
                message: 'Dies ist ein Fehler',
                severity: 'error'
            },
            'test3': {
                id: 'test3',
                message: 'Dies ist ein Erfolg',
                severity: 'success'
            }
        }
    },

    //
    // Contains information about the currently logged in user
    //
    user: {
        name: {
            title: '',
            firstName: '',
            middleName: '',
            lastName: '',
            otherName: '',
            fullName: ''
        }
    },

    //
    // Contains information about all nodes the are currently loaded
    //
    nodes: {
        byContextPath: {},
        selected: {}
    },

    //
    // Contains information to render the page tree
    //
    pageTree: {},

    //
    // Contains the current set of changes
    //
    changes: []

}).mergeDeep(Immutable.fromJS(serverState));
