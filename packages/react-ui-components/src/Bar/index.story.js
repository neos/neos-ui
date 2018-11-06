import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';
import {StoryWrapper} from './../_lib/storyUtils';
import Bar from '.';

storiesOf('Bar', module)
    .addDecorator(withKnobs)
    .addWithInfo(
        'default',
        'The bar. May be positioned top or bottom.',
        () => {
            const position = select('Position', ['top', 'bottom'], 'top');
            return (
                <StoryWrapper>
                    <div style={{minHeight: '50vh'}}>
                        <Bar position={position}>
                            Position of this bar: {position}
                        </Bar>
                    </div>
                </StoryWrapper>
            );
        },
        {inline: true, source: false}
    );
