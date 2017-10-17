import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {LineChart, Line, XAxis, YAxis, CartesianGrid} from 'recharts';
import {scaleTime, scaleLinear} from 'd3-scale';
import {timeSecond, timeDay, timeWeek, timeMonth, timeYear} from 'd3-time';
import {$get} from 'plow-js';
import brand from '@neos-project/brand';
import dataLoader from '../DataLoader/index';

@dataLoader()
export default class TimeSeriesView extends PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
        options: PropTypes.shape({
            collection: PropTypes.string,
            series: PropTypes.object,
            chart: PropTypes.shape({
                selectedInterval: PropTypes.string,
                yAxisFromZero: PropTypes.bool
            })
        }).isRequired
    }

    getLine = () => {
        const {options, data} = this.props;
        const {series} = options;
        const collectionPath = options.collection;

        if (!data) {
            return [];
        }
        const collection = $get(collectionPath, data);
        return collection.map(row => ({
            value: parseInt($get(series.valueData, row), 10),
            time: moment($get(series.timeData, row)).valueOf()
        }));
    };

    formatDate = tickItem => {
        switch ($get('chart.selectedInterval', this.props.options)) {
            case 'years':
            case 'Y':
                return moment(tickItem).format('\'YY');
            case 'quarters':
            case 'Q':
                return this.quarterFormat(tickItem);
            case 'months':
            case 'M':
                return moment(tickItem).format('MMM \'YY');
            case 'weeks':
            case 'W':
                return moment(tickItem).format('D/M/YY');
            case 'days':
            case 'D':
                return moment(tickItem).format('ddd');
            case 'seconds':
            case 'S':
                return moment(tickItem).format('mm : ss');
            default:
                return moment(tickItem).format('YYYY');
        }
    };

    quarterFormat = tickItem => {
        const date = new Date(tickItem);
        const month = date.getMonth() % 12;
        const suffix = moment(tickItem).format('YYYY');
        let prefix;
        if (month < 3) {
            prefix = 'Q1';
        } else if (month < 6) {
            prefix = 'Q2';
        } else if (month < 9) {
            prefix = 'Q3';
        } else {
            prefix = 'Q4';
        }
        return prefix + ' ' + suffix;
    }

    getTimeLabeler = () => {
        switch ($get('chart.selectedInterval', this.props.options)) {
            case 'years':
            case 'Y':
                return timeYear;
            case 'quarters':
            case 'Q':
                return timeMonth;
            case 'months':
            case 'M':
                return timeMonth;
            case 'weeks':
            case 'W':
                return timeWeek;
            case 'days':
            case 'D':
                return timeDay;
            case 'seconds':
            case 'S':
                return timeSecond;
            default:
                return timeYear;
        }
    }

    getXTicks = data => {
        const domain = [new Date(data[0].time), new Date(data[data.length - 1].time)];
        const scale = scaleTime().domain(domain);

        const selectedInterval = $get('chart.selectedInterval', this.props.options);
        // In case of quarter, draw tick every 3 months
        const tickEveryX = (selectedInterval === 'quarters' || selectedInterval === 'Q') ? 3 : 1;
        const ticks = scale.ticks(this.getTimeLabeler(), tickEveryX);

        return ticks.map(entry => Number(entry));
    };

    getYTicks = data => {
        const yMin = $get('chart.yAxisFromZero', this.props.options) ? 0 : Math.min(...data.map(item => item.value));
        const yMax = Math.max(...data.map(item => item.value));
        const domain = [yMin, yMax];
        const scale = scaleLinear().domain(domain);
        const ticks = scale.ticks(3);

        return ticks.map(entry => Number(entry));
    };

    calculateYLabelWidth = data => {
        const yMax = Math.max(...data.map(item => item.value));
        const numberOfDigits = String(yMax).length;
        // Roughly estimate width each digit takes
        const digitWidth = 8;
        return numberOfDigits * digitWidth;
    }

    render() {
        const lineData = this.getLine();
        const xTicks = this.getXTicks(lineData);
        const yTicks = this.getYTicks(lineData);
        const yLabelWidth = this.calculateYLabelWidth(lineData);
        return (
            <LineChart
                width={248}
                height={180}
                data={lineData}
                margin={{top: 0, right: 0, bottom: 0, left: 0}}
                >
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={brand.config.colors.primaryBlue}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    />
                <XAxis
                    tickCount={xTicks.length}
                    ticks={xTicks}
                    dataKey="time"
                    tickFormatter={this.formatDate}
                    stroke="#ffffff"
                    fontSize="11px"
                    axisLine={false}
                    tickLine={false}
                    />
                <YAxis
                    tickCount={yTicks.length}
                    ticks={yTicks}
                    domain={$get('chart.yAxisFromZero', this.props.options) ? [0, 'dataMax'] : ['dataMin', 'dataMax']}
                    width={yLabelWidth}
                    stroke="#ffffff"
                    fontSize="11px"
                    axisLine={false}
                    tickLine={false}
                    padding={{
                        top: 10,
                        bottom: $get('chart.yAxisFromZero', this.props.options) ? 0 : 10
                    }}
                    />
                <CartesianGrid
                    stroke={brand.config.colors.contrastDark}
                    strokeWidth={1}
                    />
            </LineChart>
        );
    }
}
