import React, {Component, PropTypes} from '@host/react';
import {Components} from '@host';
import Dropzone from 'react-dropzone';
import {Maybe} from 'monet';

import {Thumbnail} from '../../Utils/index';

import style from './style.css';

const {Icon} = Components;

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
        const thumbnail = Maybe.fromNull(image)
            .map(image => Thumbnail.fromImageData(image, 273, 216));
        const loader = () => <Icon icon="spinner" spin={true} size="big" className={style.thumbnail__loader}/>;
        const preview = () => (
            <div className={style.cropArea} style={thumbnail.map(t => t.styles.cropArea).orSome({})}>
                <img
                    className={style.thumbnail__image}
                    src={thumbnail.bind(t => t.uri).orSome('/_Resources/Static/Packages/TYPO3.Neos/Images/dummy-image.svg')}
                    style={thumbnail.map(t => t.styles.thumbnail).orSome({})}
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
                    {Maybe.fromNull(image).map(preview).orSome(loader())}
                </div>
            </Dropzone>
        );
    }
}
