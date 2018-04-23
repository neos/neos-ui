import React from 'react';
import PropTypes from 'prop-types';
import IconComponent from '../Icon/index';

const validDirections = ['left', 'right'];
const validSizes = ['small', 'big'];

const Arrow = ({
    direction,
    size
}) => {
    return (
        <div>
            <IconComponent icon={`angle-${direction}`} size={size} />
        </div>
    );
};

Arrow.propTypes = {
    /**
     * This prop defines which icon sould be rendered. The arraw left or right.
     */
    direction: PropTypes.oneOf(validDirections).isRequired,

    /**
     * This prop defines which icon sould be rendered. The arraw left or right.
     */
    size: PropTypes.oneOf(validSizes).isRequired
};

Arrow.defaultProps = {
    size: 'big'
};

export default Arrow;
