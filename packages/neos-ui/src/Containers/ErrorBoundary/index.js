import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends Component {
    static propTypes = {
        errorMessage: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
        // You can also log the error to an error reporting service
        console.error(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h2>{this.props.errorMessage || "This UI element could not be loaded. Check the console output for details."}</h2>;
        }
        return this.props.children;
    }
}
