import Component from '@reduct/component';
import PropTypes from '@reduct/nitpick';

const propTypes = {
    contextPath: PropTypes.isString.isRequired,
    typoScriptPath: PropTypes.isString.isRequired
};

export default class ContentComponent extends Component {
    constructor(el) {
        super(el, {
            props: {
                contextPath: el.dataset.__cheNodeContextpath,
                typoScriptPath: el.dataset.__cheTyposcriptPath
            },
            propTypes
        });

        this.el.addEventListener('blur', () => {
            console.log('focus');
        });
    }

    isActive() {
        return true;
    }
}
