import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement/index';

export default class SelectBox_Option_MultiLineWithThumbnail extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        secondaryLabel: PropTypes.string,
        tertiaryLabel: PropTypes.string,
        imageUri: PropTypes.string,
        icon: PropTypes.string,

        theme: PropTypes.shape({
            multiLineWithThumbnail__item: PropTypes.string.isRequired,
            multiLineWithThumbnail__secondaryLabel: PropTypes.string.isRequired,
            multiLineWithThumbnail__tertiaryLabel: PropTypes.string.isRequired,
            multiLineWithThumbnail__image: PropTypes.string.isRequired,
        }).isRequired
    };

    render() {
        const {
            label,
            secondaryLabel,
            tertiaryLabel,
            imageUri,
            icon,

            theme
        } = this.props;

        return (
            <ListPreviewElement {...this.props} icon={icon} className={theme.multiLineWithThumbnail__item}>
                {Boolean(imageUri) && <img src={imageUri} alt={label} className={theme.multiLineWithThumbnail__image}/>}
                <span>{label}</span>
                {Boolean(secondaryLabel) && <span className={theme.multiLineWithThumbnail__secondaryLabel}>{secondaryLabel}</span>}
                {Boolean(tertiaryLabel) && <span className={theme.multiLineWithThumbnail__tertiaryLabel}>{tertiaryLabel}</span>}
            </ListPreviewElement>
        );
    }
}
