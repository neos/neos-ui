import ReactSelector from 'testcafe-react-selectors';

/* eslint babel/new-cap: 0 */

export default class Page {
    constructor() {
        // TODO: extract core selectors here from the test
        this.treeNode = ReactSelector('Node').find('span');
    }
}
