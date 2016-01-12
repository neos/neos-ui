import React from 'react';
import chai from 'chai';
import TestUtils from 'react-addons-test-utils';
import Button from './index.js';

const expect = chai.expect;

describe('Button Component', () => {
    let renderer;

    beforeEach(() => {
        renderer = TestUtils.createRenderer();
    });

    it('should render a button element and the passed children.', () => {
        const onClickHandler = () => null;

        renderer.render(
            <Button isFocused={false} isDisabled={false} style="clean" hoverStyle="clean" onClick={onClickHandler}>
                "test"
            </Button>
        );

        const actualElement = renderer.getRenderOutput();

        expect(actualElement.type).to.equal('button');
    });
});
