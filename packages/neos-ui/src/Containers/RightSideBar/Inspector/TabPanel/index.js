import React, {PureComponent, PropTypes} from 'react';
import {Maybe} from 'monet';
import Tabs from '@neos-project/react-ui-components/lib/Tabs/';

import PropertyGroup from '../PropertyGroup/index';

import style from './style.css';

export default class TabPanel extends PureComponent {
    static displayName = 'Inspector Tab Panel';
    static propTypes = {
        groups: PropTypes.array,
        renderSecondaryInspector: PropTypes.func.isRequired,
        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired,
        transientValues: PropTypes.object,
        validationErrors: PropTypes.object
    };

    render() {
        const {groups, renderSecondaryInspector, validationErrors, node, commit, transientValues} = this.props;
        const tabPanel = groups => (
            <Tabs.Panel theme={{panel: style.inspectorTabPanel}}>
                {
                    groups.filter(g => g.properties).map(group => (
                        <PropertyGroup
                            key={group.id}
                            label={group.label}
                            icon={group.icon}
                            properties={group.properties}
                            renderSecondaryInspector={renderSecondaryInspector}
                            node={node}
                            commit={commit}
                            transient={transientValues}
                            validationErrors={validationErrors}
                            />
                    ))
                }
            </Tabs.Panel>
        );
        const fallback = () => (<div>...</div>);

        return Maybe.fromNull(groups).map(tabPanel).orSome(fallback());
    }
}
