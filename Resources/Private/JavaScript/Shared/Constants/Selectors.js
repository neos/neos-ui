//
// This file serves as the central point for defining selectors for the selenium tests.
// All selectors which are exported will be accesible in the selenium tests, e.g.
//
// const selectors = __neosSelenium.selectors;
//

module.exports = {
    contentCanvas: '#neos__contentCanvas',
    guestFrame: {
        iframe: '#neos__contentCanvas iframe',
        inlineEditableNodeTypes: '[data-__che-property]'
    },
    contextBar: {},
    fullScreen: {},
    leftSideBar: {
        container: '#neos__leftSidebar',
        nodeTreeToolBar: {
            addNode: '#neos__leftSidebar__nodeTreeToolBar__addNode'
        }
    },
    drawer: '#neos__drawer',
    rightSideBar: {
        container: '#neos__rightSideBar',
        toggler: '#neos__rightSideBar__toggler'
    },
    topBar: {
        menuToggler: '#neos__topBar__menuToggler',
        leftSideBarToggler: '#neos__topBar__leftSideBarToggler',
        userDropDown: {
            contents: '#neos__topBar__userDropDown__contents',
            btn: '#neos__topBar__userDropDown__btn'
        },
        publishDropDown: {
            contents: '#neos__topBar__publishDropDown__contents',
            btn: '#neos__topBar__publishDropDown__btn',
            discardBtn: '#neos__topBar__publishDropDown__discardBtn',
            discardAllBtn: '#neos__topBar__publishDropDown__discardAllBtn',
            publishBtn: '#neos__topBar__publishDropDown__publishBtn',
            publishAllBtn: '#neos__topBar__publishDropDown__publishAllBtn',
            autoPublishingEnabledCheckbox: '#neos__topBar__publishDropDown__autoPublishingEnabledCheckbox'
        }
    },
    modals: {
        closeModal: '#neos__modal__closeModal',
        addNode: '#neos__addNodeModal'
    }
};
