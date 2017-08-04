import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import I18n from '@neos-project/neos-ui-i18n';
import mergeClassNames from 'classnames';

export class TooltipContainer extends PureComponent {
    static propTypes = {
        TooltipComponent: PropTypes.any.isRequired,
        tooltipLabel: PropTypes.string,
        children: PropTypes.any.isRequired,
        theme: PropTypes.object,
        className: PropTypes.string,
        style: PropTypes.oneOf(['regular', 'inline'])
    }

    static defaultProps = {
        style: 'regular'
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            hovering: false
        };
    }

    handleMouseOver = () => {
        this.timeout = setTimeout(() => {
            this.setState({
                hovering: true
            });
        }, 200);
    }

    handleMouseOut = () => {
        clearTimeout(this.timeout);
        this.setState({
            hovering: false
        });
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render() {
        const {
          TooltipComponent,
          tooltipLabel,
          theme,
          children,
          className,
          style
      } = this.props;

        const classNames = mergeClassNames({
            [theme.tooltipContainer]: true,
            [className]: className,
            [theme['tooltopConainer--inline']]: style === 'inline'
        });

        const isHovering = this.state.hovering;

        return (
            <div
                className={classNames}
                onMouseOver={this.handleMouseOver}
                onFocus={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                onBlur={this.handleMouseOut}
                >
                {children}
                {
                  tooltipLabel && isHovering && (
                  <TooltipComponent style="regular">
                      <I18n id={tooltipLabel}/>
                  </TooltipComponent>
              )}

            </div>
        );
    }
}

export default TooltipContainer;
