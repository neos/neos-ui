import React, {PropTypes} from '@host/react';
import {Components} from '@host';
import {$get} from 'plow-js';
import {Map} from 'immutable';

import style from './style.css';

const {I18n, CheckBox, TextInput} = Components;

const buildResizeAdjustment = (width, height) => new Map({
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

const onChangeValue = (props, heightOrWidth) => (changedValue) => {
    let height = 0;
    let width = 0;
    const aspectRatio = $get('height', props.imageDimensions) / $get('width', props.imageDimensions);

    if (heightOrWidth === 'height') {
        height = changedValue;
        width = height / aspectRatio;
    } else {
        width = changedValue;
        height = width * aspectRatio;
    }

    props.onChange(buildResizeAdjustment(width, height));
};

const ResizeControls = props => {
    return (
        <div>
            <div>
                <span><I18n id="width" fallback="Width" />:</span>
                <div className={style.resizeControls}>
                    <span className={style.resizeControls__before}><CheckBox onChange={toggleResizeAdjustment(props)} isChecked={props.resizeAdjustment} /></span>
                    <span className={style.resizeControls__main}>
                        <TextInput type="number" pattern="\d*" step="1" min="0" placeholder={$get('width', props.imageDimensions)} value={$get('width', props.resizeAdjustment)} onChange={onChangeValue(props, 'width')} />
                    </span>
                    <span className={style.resizeControls__after}>px</span>
                </div>
            </div>
            <div>
                <span><I18n id="height" fallback="Height" />:</span>
                <div className={style.resizeControls}>
                    <span className={style.resizeControls__before}><CheckBox onChange={toggleResizeAdjustment(props)} isChecked={props.resizeAdjustment} /></span>
                    <span className={style.resizeControls__main}>
                        <TextInput type="number" pattern="\d*" step="1" min="0" placeholder={$get('height', props.imageDimensions)} value={$get('height', props.resizeAdjustment)} onChange={onChangeValue(props, 'height')} />
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
