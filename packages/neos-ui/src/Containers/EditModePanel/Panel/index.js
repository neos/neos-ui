import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import HorizontalScroll from 'react-scroll-horizontal';

import Button from '@neos-project/react-ui-components/src/Button/index';
import I18n from '@neos-project/neos-ui-i18n';

export default class DimensionSwitcher extends PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
        modes: PropTypes.array.isRequired,
        style: PropTypes.object.isRequired,
        current: PropTypes.string,
        currentMode: PropTypes.object,
        onPreviewModeClick: PropTypes.func.isRequired
    };

    render() {
        const {title, className, modes, current, currentMode, style, onPreviewModeClick} = this.props;

        const scrollConfiguration = {
            style: style.editModePanel__scrollable
        };

        return (
            <div className={className}>
                <p>{title} {currentMode && <b className={style.editModePanel__current}><I18n id={currentMode.title}/></b>}</p>
                <HorizontalScroll {...scrollConfiguration}>
                    {modes.map(previewMode => (
                        <Button
                            key={previewMode.id}
                            onClick={onPreviewModeClick(previewMode.id)}
                            style={previewMode.id === current ? 'brand' : null}
                            className={style.editModePanel__button}
                            >
                            <I18n id={previewMode.title}/>
                        </Button>
                    ))}
                </HorizontalScroll>
            </div>
        );
    }

}
