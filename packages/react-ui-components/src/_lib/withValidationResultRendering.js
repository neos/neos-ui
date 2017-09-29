import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Tooltip from './../Tooltip/';
import ReactTooltip from 'react-tooltip';

function withValidationResultsRendering(WrappedComponent) {
    class WithValidationResultsRendering extends PureComponent {

        static propTypes = {
            /**
             * An array of error messages
             */
            validationErrors: PropTypes.array
        }

        componentDidMount() {
            ReactTooltip.show(this.tooltipRef);
        }

        componentDidUpdate() {
            const {validationErrors} = this.props;
            const hasErrors = validationErrors && validationErrors.length > 0;

            if (hasErrors === true) {
                ReactTooltip.show(this.tooltipRef);
            } else {
                ReactTooltip.hide(this.tooltipRef);
            }
        }

        render() {
            const {validationErrors, ...rest} = this.props;
            const hasErrors = validationErrors && validationErrors.length > 0;
            const renderedErros = hasErrors && validationErrors.map((validationError, key) => {
                return <span key={key}>{validationError}</span>;
            });

            const tooltipIdentifier = Math.random().toString(36).substring(7);

            const tooltipRef = el => {
                this.tooltipRef = el;
            };

            const wrapperClassName = hasErrors ? 'with-erros' : '';

            return (
                <div
                    className="validationResultsWrapper"
                    data-tip=""
                    data-for={tooltipIdentifier}
                    ref={tooltipRef}
                    >
                    <WrappedComponent {...rest}/>
                    <div className={`${wrapperClassName} valiation-messages`}>
                        <Tooltip
                            place="bottom"
                            type="validation-error"
                            delayShow={0}
                            id={tooltipIdentifier}
                            >
                            {renderedErros}
                        </Tooltip>
                    </div>
                </div>
            );
        }
    }

    return WithValidationResultsRendering;
}

export default withValidationResultsRendering;
