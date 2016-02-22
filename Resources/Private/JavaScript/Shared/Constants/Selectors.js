//
// This file serves as the central point for defining selectors for the selenium tests.
// All selectors which are exported will be accesible in the selenium tests, e.g.
//
// const selectors = __neosSelenium.selectors;
//

module.exports = {
    contentView: '',
    contextBar: {},
    fullScreen: {},
    leftSideBar: {
        nodeTreeToolBar: {
            addNode: '#neos__leftSidebar__nodeTreeToolBar__addNode'
        }
    },
    offCanvas: {},
    rightSideBar: {},
    topBar: {
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
