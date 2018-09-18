import {ReactSelector} from 'testcafe-react-selectors';

export default async function waitForRequestsToFinish(t) {
    await t.expect(ReactSelector('Provider').getReact(({props}) => {
        const reduxState = props.store.getState().toJS();

        const STATES_TO_WAIT_FOR = [
            {name: 'ui.contentCanvas.isLoading', negate: true}
        ];

        return STATES_TO_WAIT_FOR.reduce((acc, curr) => {
            if (curr.negate) {
                return acc && !reduxState[curr.name];
            }

            return acc && reduxState[curr.name];
        }, true);
    })).ok('Loading stopped');
}
