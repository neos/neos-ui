import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

/* eslint-disable no-unused-vars */
import SlickStyles from './slick-styles.vanilla-css';
/* eslint-enable no-unused-vars */

import Button from '@neos-project/react-ui-components/src/Button/index';
import IconComponent from '@neos-project/react-ui-components/src/Icon/index';
import I18n from '@neos-project/neos-ui-i18n';

const Arrow = props => {
    const {className, style, onClick, direction, size} = props;
    return (
        <div className={className} style={{...style}} onClick={onClick} role="button">
            <IconComponent icon={`angle-${direction}`} size={size} />
        </div>
    );
};

export default class Panel extends PureComponent {
    static propTypes = {
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]).isRequired,
        className: PropTypes.string.isRequired,
        modes: PropTypes.array.isRequired,
        style: PropTypes.object.isRequired,
        current: PropTypes.string,
        currentMode: PropTypes.object,
        onPreviewModeClick: PropTypes.func.isRequired
    };

    render() {
        const {title, className, modes, current, currentMode, style, onPreviewModeClick} = this.props;

        const sliderSettings = {
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: Math.round(modes.length / 2), // https://github.com/kenwheeler/slick/issues/1207#issuecomment-105663300
            variableWidth: true,
            adaptiveHeight: true,
            nextArrow: <Arrow direction="right" size="lg" />,
            prevArrow: <Arrow direction="left" size="lg" />
        };

        return (
            <div className={className}>
                <p>{title} {currentMode && <b className={style.editModePanel__current}><I18n id={currentMode.title}/></b>}</p>
                <Slider {...sliderSettings}>
                    {modes.map(previewMode => (
                        <div key={previewMode.id} className={style.editModePanel__buttonWrapper}>
                            <Button
                                isDisabled={previewMode.id === current}
                                onClick={onPreviewModeClick(previewMode.id)}
                                style={previewMode.id === current ? 'brand' : null}
                                >
                                <I18n id={previewMode.title}/>
                            </Button>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }
}
