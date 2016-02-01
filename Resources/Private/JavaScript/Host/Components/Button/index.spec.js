import React from 'react';
import {shallowRender} from 'skin-deep';
import Button from './index.js';

function renderTree(props) {
    return shallowRender(
        <Button {...props}>
            My button text
        </Button>
    );
}

describe('Button Component', () => {
    it('should render a `<button>` element and the passed text as the label.', () => {
        const tree = renderTree({
            isFocused: false,
            isDisabled: false,
            style: 'clean',
            hoverStyle: 'clean',
            onClick: () => null
        });

        expect(tree.getRenderOutput().type).to.equal('button');
        expect(tree.text()).to.equal('My button text');
    });

    it('should add the `disabled` attribute to the `<button>` node if the `isDisabled` prop was passed as `true`.', () => {
        const disabledTree = renderTree({
            isFocused: false,
            isDisabled: true,
            style: 'clean',
            hoverStyle: 'clean',
            onClick: () => null
        });

        expect(disabledTree.toString().indexOf('disabled') > -1).to.equal(true);

        const tree = renderTree({
            isFocused: false,
            isDisabled: false,
            style: 'clean',
            hoverStyle: 'clean',
            onClick: () => null
        });

        expect(tree.toString().indexOf('disabled') > -1).to.equal(false);
    });
});
