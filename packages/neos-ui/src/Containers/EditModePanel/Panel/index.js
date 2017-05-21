import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

/* eslint-disable no-unused-vars */
import SlickStyles from './slick-styles.vanilla-css';
/* eslint-enable no-unused-vars */

import Button from '@neos-project/react-ui-components/src/Button/index';
import I18n from '@neos-project/neos-ui-i18n';

export default class Panel extends PureComponent {
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

        let sliderSettings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToScroll: 1,
            slidesToShow: 1,
            variableWidth: true,
            //focusOnSelect: true,
            adaptiveHeight: true,
            easing: 'swing',
            edgeFriction: 0
        };

        return (
            <div className={className}>
                <p>{title} {currentMode && <b className={style.editModePanel__current}><I18n id={currentMode.title}/></b>}</p>
                <Slider {...sliderSettings}>
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
                </Slider>
            </div>
        );
    }

}
