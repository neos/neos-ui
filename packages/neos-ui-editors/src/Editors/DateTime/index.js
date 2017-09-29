import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DateInput from '@neos-project/react-ui-components/src/DateInput/';
import moment from 'moment';
import {neos} from '@neos-project/neos-ui-decorators';
import convertPhpDateFormatToMoment, {hasDateFormat, hasTimeFormat} from './helpers';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
class DateTime extends PureComponent {

    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        commit: PropTypes.func.isRequired,
        highlight: PropTypes.bool,
        placeholder: PropTypes.string,
        options: PropTypes.object,
        id: PropTypes.string,
        i18nRegistry: PropTypes.object
    }

    render() {
        const {
            id,
            value,
            commit,
            placeholder,
            options,
            i18nRegistry,
            highlight
        } = this.props;
        const mappedValue = (typeof value === 'string' && value.length) ? moment(value).toDate() : (value || undefined);

        const onChange = date => {
            commit(date ? moment(date).format('YYYY-MM-DDTHH:mm:ssZ') : '');
        };

        return (
            <DateInput
                id={id}
                value={mappedValue}
                onChange={onChange}
                labelFormat={convertPhpDateFormatToMoment(options.format)}
                highlight={highlight}
                dateOnly={!hasTimeFormat(options.format)}
                timeOnly={!hasDateFormat(options.format)}
                placeholder={placeholder || i18nRegistry.translate('content.inspector.editors.dateTimeEditor.noDateSet', '', {}, 'Neos.Neos', 'Main')}
                />
        );
    }
}

export default DateTime;
