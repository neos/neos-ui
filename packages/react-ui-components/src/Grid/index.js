import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import style from './style.css';
import Grid from './grid.js';
import GridItem from './gridItem.js';

const ThemedGrid = themr(identifiers.grid, style)(Grid);
ThemedGrid.Col = themr(identifiers.gridItem, style)(GridItem);

export default ThemedGrid;
