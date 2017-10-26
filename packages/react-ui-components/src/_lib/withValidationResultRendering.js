import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Tooltip from './../Tooltip/index.js';

function withValidationResultsRendering(WrappedComponent) {
    class WithValidationResultsRendering extends PureComponent {

        static propTypes = {
            /**
             * An array of error messages
             */
            validationErrors: PropTypes.array
        }
        render() {
            const {validationErrors, ...rest} = this.props;
            const renderedErros = validationErrors && validationErrors.length > 0 && validationErrors.map((validationError, key) => {
                return <div key={key}>{validationError}</div>;
            });

            return (
                <Tooltip tooltipLabel={renderedErros} tooltipType="error">
                    <WrappedComponent {...rest}/>
                </Tooltip>
            );
        }
    }

    return WithValidationResultsRendering;
}

export default withValidationResultsRendering;
