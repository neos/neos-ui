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
        inlineEditableNodeTypes: '[data-__neos-property]'
    },
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
    primaryToolbar: {
        menuToggler: '#neos__primaryToolbar__menuToggler',
        leftSideBarToggler: '#neos__primaryToolbar__leftSideBarToggler',
        userDropDown: {
            contents: '#neos__primaryToolbar__userDropDown__contents',
            btn: '#neos__primaryToolbar__userDropDown__btn'
        },
        publishDropDown: {
            contents: '#neos__primaryToolbar__publishDropDown__contents',
            btn: '#neos__primaryToolbar__publishDropDown__btn',
            discardBtn: '#neos__primaryToolbar__publishDropDown__discardBtn',
            discardAllBtn: '#neos__primaryToolbar__publishDropDown__discardAllBtn',
            publishBtn: '#neos__primaryToolbar__publishDropDown__publishBtn',
            publishAllBtn: '#neos__primaryToolbar__publishDropDown__publishAllBtn',
            autoPublishingEnabledCheckbox: '#neos__primaryToolbar__publishDropDown__autoPublishingEnabledCheckbox'
        }
    },
    secondaryToolbar: {},
    modals: {
        closeModal: '#neos__modal__closeModal',
        addNode: '#neos__addNodeModal'
    }
};
