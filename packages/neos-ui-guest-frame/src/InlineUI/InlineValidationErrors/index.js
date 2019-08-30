import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import {Tooltip} from '@neos-project/react-ui-components';
import throttle from 'lodash.throttle';
import style from './style.css';

import {findAllOccurrencesOfNodePropertyInGuestFrame, getAbsolutePositionOfElementInGuestFrame, getGuestFrameWindow, getGuestFrameBody} from '@neos-project/neos-ui-guest-frame/src/dom';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    inlineValidationErrors: selectors.CR.Nodes.inlineValidationErrorsSelector
}))
export default class InlineValidationTooltips extends PureComponent {
    static propTypes = {
        inlineValidationErrors: PropTypes.object
    };

    iframeWindow = getGuestFrameWindow();

    tooltipRefs = new WeakMap();

    invalidInlinePropertiesDomNodes = [];

    updateTooltipsPosition = () => {
        this.invalidInlinePropertiesDomNodes.forEach(domNode => {
            const position = getAbsolutePositionOfElementInGuestFrame(domNode);
            const tooltipNode = this.tooltipRefs.get(domNode) && this.tooltipRefs.get(domNode).current;
            if (tooltipNode && tooltipNode.children.length === 2) {
                const [border, tooltip] = tooltipNode.children;

                border.style.top = position.top + 'px';
                border.style.left = position.left + 'px';
                border.style.width = position.width + 'px';
                border.style.height = position.height + 'px';

                tooltip.style.top = position.top + position.height + 'px';
                tooltip.style.left = position.left + 'px';
            }
        });
    }

    updateTooltipsPositionDebounced = throttle(this.updateTooltipsPosition, 5);

    mutationObserver = new MutationObserver(this.updateTooltipsPositionDebounced);

    componentDidMount() {
        this.iframeWindow.addEventListener('resize', this.updateTooltipsPositionDebounced);

        this.mutationObserver.observe(getGuestFrameBody(), {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    }

    componentWillUnmount() {
        this.iframeWindow.removeEventListener('resize', this.updateTooltipsPositionDebounced);
        this.mutationObserver.disconnect();
    }

    render() {
        const {inlineValidationErrors} = this.props;

        return <Fragment>{Object.keys(inlineValidationErrors).map(contextAndPropertyName => {
            const validationErrorsForProperty = inlineValidationErrors[contextAndPropertyName];
            const [contextPath, propertyName] = contextAndPropertyName.split(' ');
            const domNodes = findAllOccurrencesOfNodePropertyInGuestFrame(contextPath, propertyName);
            return domNodes.map((domNode, index) => {
                this.invalidInlinePropertiesDomNodes.push(domNode);
                const position = getAbsolutePositionOfElementInGuestFrame(domNode);
                const ref = React.createRef();
                this.tooltipRefs.set(domNode, ref);
                return <div key={index} ref={ref}>
                    <div className={style.border} style={{
                        top: position.top,
                        left: position.left,
                        width: position.width,
                        height: position.height
                    }}/>
                    <div className={style.tooltip} style={{
                        top: position.top + position.height,
                        left: position.left
                    }}>
                        <Tooltip renderInline asError><ul>{validationErrorsForProperty.map((error, index) => <li key={index}>{error}</li>)}</ul></Tooltip>
                    </div>
                </div>;
            });
        })}</Fragment>;
    }
}
