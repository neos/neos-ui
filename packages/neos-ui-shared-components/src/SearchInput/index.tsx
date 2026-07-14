import * as React from 'react';
import styles from './style.module.css'

import {TextInput, Icon, IconButton} from '@neos-project/react-ui-components';

import {translate} from '@neos-project/neos-ui-i18n';

interface Props {
    value: string
    id?: string
    onChange: (value: string) => void
    onClear: () => void
}

export const SearchInput: React.FC<Props> = props => {
    const latestValue = React.useRef(props.value);

    React.useEffect(() => {
        if (latestValue.current !== props.value && !props.value) {
            props.onClear();
        }

        latestValue.current = props.value;
    }, [props.value])

    return (
        <div id={props.id} className={styles.searchInputContainer}>
            <Icon className={styles.searchIcon} icon="search"/>
            <TextInput
                className={styles.textInput}
                type="search"
                value={props.value}
                placeholder={translate('Neos.Neos.Ui:Main:search')}
                onChange={props.onChange}
            />
            {props.value && (
                <IconButton
                    id={props.id ? `${props.id}-btn-reset` : undefined}
                    className={styles.clearIcon}
                    icon="times"
                    onClick={props.onClear}
                />
            )}
        </div>
    )
};
