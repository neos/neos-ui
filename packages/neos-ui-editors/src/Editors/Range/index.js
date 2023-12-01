import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.module.css';

@neos(globalRegistry => {
    return {
        i18nRegistry: globalRegistry.get('i18n')
    };
})
class RangeEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        options: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number,
            step: PropTypes.number,
            unit: PropTypes.string,
            minLabel: PropTypes.string,
            maxLabel: PropTypes.string,
            disabled: PropTypes.bool
        }),
        highlight: PropTypes.bool
    };

    static defaultProps = {
        options: {
            min: 0,
            max: 100,
            step: 1,
            unit: '',
            minLabel: null,
            maxLabel: null,
            disabled: false
        }
    };

    handleChange = event => {
        const {options} = this.props;
        const {target} = event;
        const useParseInt = (options.step || 1) % 1 === 0;

        let value = useParseInt ? parseInt(target.value, 10) : parseFloat(target.value, 10);
        if (isNaN(value)) {
            return;
        }

        value = Math.min(options.max, Math.max(options.min, value));

        this.props.commit(value);

        this.forceUpdate();
    };

    onKeyPress = event => {
        if (isNaN(event.key)) {
            event.preventDefault();
        }
    };

    render() {
        const options = {...this.constructor.defaultProps.options, ...this.props.options};
        const {value, highlight} = this.props;
        const valueAsString = value === 0 ? '0' : (value || '');
        // Calculate the width of the input field based on the length of the min, max and step values
        const numLength = value => value.toString().length;
        const additionalStepLength = numLength(options.step) - 1;
        const styleWidth = Math.max(numLength(options.min), numLength(options.max)) + additionalStepLength + 'ch';

        return (
            <div
                className={cx(
                    style.rangeEditor,
                    options.disabled && style.rangeEditorDisabled,
                    highlight && style.rangeEditorHighlight,
                )}
            >
                <input
                    type="range"
                    min={options.min}
                    max={options.max}
                    step={options.step}
                    value={valueAsString}
                    className="slider"
                    onChange={this.handleChange}
                    disabled={options.disabled}
                />
                <div className={style.rangeEditorValue}>
                    <span title={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:rangeEditorMinimum')}>
                        {options.minLabel ? options.minLabel : options.min + options.unit}
                    </span>
                    <span>
                        <input
                            title={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:rangeEditorCurrentValue')}
                            type="text"
                            onKeyPress={this.onKeyPress}
                            onChange={this.handleChange}
                            value={valueAsString}
                            style={ {width: styleWidth} }
                            disabled={options.disabled}
                        />
                        {options.unit}
                    </span>
                    <span title={this.props.i18nRegistry.translate('Neos.Neos.Ui:Main:rangeEditorMaximum')}>
                        {options.maxLabel ? options.maxLabel : options.max + options.unit}
                    </span>
                </div>
            </div>
        );
    }
}

export default RangeEditor;
