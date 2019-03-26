import React from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';

import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import CheckBox from '@neos-project/react-ui-components/src/CheckBox/';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

const buildResizeAdjustment = (width, height) => ({
    allowUpScaling: null,
    height,
    maximumHeight: null,
    maximumWidth: null,
    minimumHeight: null,
    minimumWidth: null,
    position: 20,
    ratioMode: null,
    width
});

const toggleResizeAdjustment = props => () => {
    if (props.resizeAdjustment) {
        props.onChange(null);
    } else {
        props.onChange(buildResizeAdjustment($get('width', props.imageDimensions), $get('height', props.imageDimensions)));
    }
};

const onChangeValue = (props, heightOrWidth) => changedValue => {
    let height = 0;
    let width = 0;
    const aspectRatio = $get('height', props.imageDimensions) / $get('width', props.imageDimensions);

    if (heightOrWidth === 'height') {
        height = changedValue;
        width = Math.round(height / aspectRatio);
    } else {
        width = changedValue;
        height = Math.round(width * aspectRatio);
    }

    props.onChange(buildResizeAdjustment(width, height));
};

const ResizeControls = props => {
    if (!props.imageDimensions.width) {
        return null;
    }
    return (
        <div>
            <div className={style.resizeControls__item}>
                <div className={style.resizeControls__label}><I18n id="width" fallback="Width"/>:</div>
                <div className={style.resizeControls}>
                    <span className={style.resizeControls__before}>
                        <CheckBox
                            onChange={toggleResizeAdjustment(props)}
                            isChecked={Boolean(props.resizeAdjustment)}
                            className={style.resizeControls__checkbox}
                            disabled={props.disabled}
                            />
                    </span>
                    <span className={style.resizeControls__main}>
                        <TextInput
                            type="number"
                            pattern="\d*"
                            step="1"
                            min="0"
                            value={$get('width', props.resizeAdjustment) || $get('width', props.imageDimensions) || 0}
                            onChange={onChangeValue(props, 'width')}
                            disabled={props.disabled}
                            />
                    </span>
                    <span className={style.resizeControls__after}>px</span>
                </div>
            </div>
            <div>
                <div className={style.resizeControls__label}><I18n id="height" fallback="Height"/>:</div>
                <div className={style.resizeControls}>
                    <span className={style.resizeControls__before}>
                        <CheckBox
                            onChange={toggleResizeAdjustment(props)}
                            isChecked={Boolean(props.resizeAdjustment)}
                            className={style.resizeControls__checkbox}
                            disabled={props.disabled}
                            />
                    </span>
                    <span className={style.resizeControls__main}>
                        <TextInput
                            type="number"
                            pattern="\d*"
                            step="1"
                            min="0"
                            value={$get('height', props.resizeAdjustment) || $get('height', props.imageDimensions) || 0}
                            onChange={onChangeValue(props, 'height')}
                            disabled={props.disabled}
                            />
                    </span>
                    <span className={style.resizeControls__after}>px</span>
                </div>
            </div>
        </div>
    );
};
ResizeControls.propTypes = {
    imageDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    resizeAdjustment: PropTypes.object,

    onChange: PropTypes.func.isRequired
};

export default ResizeControls;
