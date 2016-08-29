import React, {Component, PropTypes} from 'react';
import {Icon} from 'Components';
import Dropzone from 'react-dropzone';

import {Thumbnail} from '../../Utils/index';

import style from './style.css';

export default class PreviewScreen extends Component {
    static propTypes = {
        image: PropTypes.object,
        onDrop: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired
    };

    chooseFromLocalFileSystem() {
        const {dropzone} = this.refs;
        dropzone.open();
    }

    render() {
        const {image, onDrop, onClick} = this.props;
        const thumbnail = Thumbnail.fromImageData(image, 273, 216);

        const loader = () => <Icon icon="spinner" spin={true} size="big" className={style.thumbnail__loader} />;

        const preview = () => (
            <div className={style.cropArea} style={(thumbnail ? thumbnail.styles.cropArea : {})}>
                <img
                    className={style.thumbnail__image}
                    src={(thumbnail ? thumbnail.uri : '/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg')}
                    style={(thumbnail ? thumbnail.styles.thumbnail : {})}
                    role="presentation"
                   />
            </div>
        );

        return (
            <Dropzone
                ref="dropzone"
                onDropAccepted={files => onDrop(files)}
                className={style.dropzone}
                activeClassName={style['dropzone--isActive']}
                rejectClassName={style['dropzone--isRejecting']}
                disableClick={true}
                multiple={false}
                >
                <div
                    className={style.thumbnail}
                    onClick={() => onClick()}
                    >
                    {image ? preview(image) : loader()}
                </div>
            </Dropzone>
        );
    }
}
