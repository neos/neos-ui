import React from 'react';
import {renderIntoDocument, Simulate} from 'react-addons-test-utils';
import {findDOMNode} from 'react-dom';
import DropDown from './index.js';

describe('DropDown Component', () => {
    it('should be hidden initially.', () => {
        const component = renderIntoDocument(
            <DropDown>
                test
            </DropDown>
        );

        expect(component.state.isOpened).to.equal(false);
    });

    it('should toggle the internal state when clicking the toggle <button>.', () => {
        const component = renderIntoDocument(
            <DropDown>
                test
            </DropDown>
        );

        const node = findDOMNode(component.toggler);

        Simulate.click(node);
        expect(component.state.isOpened).to.equal(true);

        Simulate.click(node);
        expect(component.state.isOpened).to.equal(false);
    });
});
