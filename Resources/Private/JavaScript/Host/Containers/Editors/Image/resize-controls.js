import React, {PropTypes} from 'react';
import {$get} from 'plow-js';
import {Map} from 'immutable';
import {
    I18n,
    CheckBox,
    TextInput
} from 'Components/index';

const buildResizeAdjustment = (width, height) => new Map({
    allowUpScaling: null,
    height: height,
    maximumHeight: null,
    maximumWidth: null,
    minimumHeight: null,
    minimumWidth: null,
    position: 20,
    ratioMode: null,
    width: width
});

const toggleResizeAdjustment = (props) => () => {
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
    } else { // width
        width = changedValue;
        height = width * aspectRatio;
    }

    props.onChange(buildResizeAdjustment(width, height));
};

const ResizeControls = (props) => {
    return (
        <div>
            <div>
                <label><I18n id="width" fallback="Width" />:</label>
                <div>
                    <span><CheckBox onChange={toggleResizeAdjustment(props)} isChecked={props.resizeAdjustment} /></span>
                    <span>
                        <TextInput type="number" pattern="\d*" step="1" min="0" placeholder={$get('width', props.imageDimensions)} value={$get('width', props.resizeAdjustment)} onChange={onChangeValue(props, 'width')} />
                    </span>
                    <span>px</span>
                </div>
            </div>
            <div>
                <label><I18n id="height" fallback="Height" />:</label>
                <div>
                    <span><CheckBox onChange={toggleResizeAdjustment(props)} isChecked={props.resizeAdjustment} /></span>
                    <span>
                        <TextInput type="number" pattern="\d*" step="1" min="0" placeholder={$get('height', props.imageDimensions)} value={$get('height', props.resizeAdjustment)} onChange={onChangeValue(props, 'height')} />
                    </span>
                    <span>px</span>
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
