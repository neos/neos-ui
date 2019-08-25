import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {IconButton} from '@neos-project/react-ui-components';
import mergeClassNames from 'classnames';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './TableButton.css';
import tableStyling from './TableStyles.vanilla-css'; // eslint-disable-line

const numberRange = (start, end) => new Array(end - start + 1).fill().map((d, i) => i + start);

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class TableButton extends PureComponent {
    static propTypes = {
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.string,
            PropTypes.object
        ])),
        inlineEditorOptions: PropTypes.object,
        executeCommand: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    state = {
        isOpen: false
    };

    handleTableButtonClick = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    handleCreate = (rows, columns) => {
        this.props.executeCommand('insertTable', {rows, columns}, true);
        this.setState({
            isOpen: false
        });
    };

    render() {
        const {i18nRegistry, inlineEditorOptions, tooltip, icon} = this.props;

        return (
            <div>
                <IconButton
                    title={`${i18nRegistry.translate(tooltip, 'Insert table')}`}
                    isActive={this.state.isOpen}
                    icon={icon}
                    onClick={this.handleTableButtonClick}
                />
                {this.state.isOpen ? <TableCreationGrid
                    onCreate={this.handleCreate}
                    inlineEditorOptions={inlineEditorOptions}
                /> : null}
            </div>
        );
    }
}

class TableCreationGrid extends PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object,
        inlineEditorOptions: PropTypes.object
    };

    state = {
        hoveredCell: [0, 0]
    }

    setHoveredCell = (row, column) => {
        this.setState({
            hoveredCell: [row, column]
        });
    };

    render() {
        const rows = numberRange(1, this.props.inlineEditorOptions.creationGridRows || 10);
        const columns = numberRange(1, this.props.inlineEditorOptions.creationGridColumns || 10);
        return <div className={style.tableCreationGrid}>
            {rows.map(row => (
                <div key={row} className={style.tableCreationGrid__row}>
                    {columns.map(column => {
                        const classNames = mergeClassNames({
                            [style.tableCreationGrid__cell]: true,
                            [style['tableCreationGrid__cell--active']]:
                                this.state.hoveredCell[0] >= row &&
                                this.state.hoveredCell[1] >= column
                        });
                        return <div
                            key={column}
                            className={classNames}
                            role="button"
                            onClick={() => this.props.onCreate(row, column)}
                            onMouseOver={() => this.setHoveredCell(row, column)}
                            onFocus={() => this.setHoveredCell(row, column)}
                        />;
                    })}
                </div>
            ))}
            <div className={style.tableCreationGrid__display}>
                {this.state.hoveredCell[0]} x {this.state.hoveredCell[1]}
            </div>
        </div>;
    }
}
