import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import style from './style.css';
import dataLoader from '../DataLoader/index';
import Hero from './hero';
import Column from './column';

@dataLoader()
export default class ColumnView extends PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
        options: PropTypes.shape({
            hero: PropTypes.object,
            columns: PropTypes.array
        }).isRequired
    }

    getHero() {
        const {options, data} = this.props;
        if (options.hero) {
            return {
                label: options.hero.label,
                value: $get(options.hero.data, data)
            };
        }
        return null;
    }

    getColumns() {
        const {options, data} = this.props;
        const columns = [];
        if (options.columns) {
            options.columns.forEach(column => {
                columns.push({
                    label: column.label,
                    value: $get(column.data, data)
                });
            });
        }
        return columns;
    }

    render() {
        const hero = this.getHero();
        const columns = this.getColumns();

        return (
            <div>
                {hero && <Hero label={hero.label} value={hero.value}/>}
                <div className={style.columnsWrap}>
                    {columns.map((column, key) => (
                        <Column
                            key={key}
                            value={column.value}
                            label={column.label}
                            />
                    ))}
                </div>
            </div>
        );
    }
}
