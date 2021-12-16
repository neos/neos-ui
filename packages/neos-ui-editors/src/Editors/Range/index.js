import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

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
        })
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

    state = {
        value: 0
    };

    componentDidMount() {
        this.setState({value: this.props.value});
    }

    handleChange = event => {
        const {options} = this.props;
        const {target} = event;

        let value = parseInt(target.value, 10);
        if (isNaN(value)) {
            return;
        }

        value = Math.min(options.max, Math.max(options.min, value));

        this.setState({value});
        this.props.commit(value);

        this.forceUpdate();
    };

    onKeyPress = event => {
        if (isNaN(event.key)) {
            event.preventDefault();
        }
    };

    render() {
        const options = Object.assign({}, this.constructor.defaultOptions, this.props.options);
        const {value} = this.state;

        return (
            <div className={style.rangeEditor + (options.disabled ? ' ' + style.rangeEditorDisabled : '' )}>
                <input
                    type="range"
                    min={options.min}
                    max={options.max}
                    step={options.step}
                    value={value}
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
                            value={value}
                            style={ {width: `${options.max.toString().length}ch`} }
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
