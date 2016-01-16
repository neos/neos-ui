import chai from 'chai';
import sinon from 'sinon';
import sinonMiddleware from 'sinon-chai';
import filterDeep, {ERROR_INVALID_COMPARATOR} from './FilterDeep.js';

const expect = chai.expect;

chai.should();
chai.use(sinonMiddleware);

describe('"FilterDeep" abstract', () => {
    it('should throw an error if no comparator function was passed as the second argument.', () => {
        const fn = () => filterDeep({
            foo: 'bar'
        });

        expect(fn).to.throw(ERROR_INVALID_COMPARATOR);
    });

    it('should call the compare function with the passed data.', () => {
        const comparator = sinon.spy();
        const data = {
            foo: 'bar'
        };

        filterDeep(data, comparator);

        comparator.should.have.callCount(1);
        comparator.should.have.been.calledWith(data);
    });

    it('should return the result if the comparator function returns `true`.', () => {
        const data = {
            foo: 'bar'
        };
        const result = filterDeep(data, data => data.foo === 'bar');

        expect(result).to.equal(data);
    });

    it('should return `null` if the data failed to match the test of the comparator function.', () => {
        const data = {
            foo: 'bar'
        };
        const result = filterDeep(data, data => data.foo === 'baz');

        expect(result).to.be.an('null');
    });

    it('should iterate over the passed data if it is of type of `Array`, and call the comparator function on all items of the Array.', () => {
        const comparator = sinon.spy();
        const data = [{
            foo: 'bar'
        }, {
            foo: 'foobar'
        }];

        filterDeep(data, comparator);

        comparator.should.have.callCount(3);
    });

    it('should return the item of the Array if it passes the comparator test.', () => {
        const expectedResult = {
            foo: 'bar'
        };
        const data = [expectedResult, {
            foo: 'foobar'
        }];
        const result = filterDeep(data, data => data.foo === 'bar');

        expect(result).to.equal(expectedResult);
        expect(result).not.equal(data);
    });

    it('should iterate over the children key/value of the passed data.', () => {
        const comparator = sinon.spy();
        const data = [{
            foo: 'bar',
            children: [{
                foobar: 'foo'
            }, {
                baz: 'bar'
            }]
        }, {
            foo: 'foobar'
        }];

        filterDeep(data, comparator);

        comparator.should.have.callCount(6);
    });
});
