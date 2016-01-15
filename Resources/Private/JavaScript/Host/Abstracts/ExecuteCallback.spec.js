import chai from 'chai';
import sinon from 'sinon';
import sinonMiddleware from 'sinon-chai';
import executeCallback, {ERROR_INVALID_EVENT} from './ExecuteCallback.js';

const expect = chai.expect;

chai.should();
chai.use(sinonMiddleware);

describe('"ExecuteCallback" abstract', () => {
    let eventMock = null;

    beforeEach(done => {
        eventMock = {
            preventDefault: sinon.spy(),
            stopImmediatePropagation: sinon.spy(),
            stopPropagation: sinon.spy()
        };

        done();
    });

    afterEach(done => {
        eventMock = null;

        done();
    });

    it('should call the `cb` property if it was passed to the function.', () => {
        const spy = sinon.spy();

        executeCallback({
            cb: spy
        });

        spy.should.have.callCount(1);
    });

    it('should throw an error if an invalid event object was passed to the function.', () => {
        const spy = sinon.spy();

        const fn = () => executeCallback({
            cb: spy,
            e: {
                nope: true
            }
        });;

        expect(fn).to.throw(ERROR_INVALID_EVENT);
    });

    it('should propagate the event object to the `cb` function.', () => {
        const spy = sinon.spy();

        executeCallback({
            cb: spy,
            e: eventMock
        });

        spy.should.have.been.calledWith(eventMock);
    });

    it('should call the preventDefault() method if not otherwise configured.', () => {
        executeCallback({
            e: eventMock
        });

        eventMock.preventDefault.should.have.callCount(1);
    });

    it('should not call the preventDefault() method if properly configured.', () => {
        executeCallback({
            e: eventMock,
            preventDefault: false
        });

        eventMock.preventDefault.should.have.callCount(0);
    });

    it('should call either the stopPropagation() method if properly configured.', () => {
        executeCallback({
            e: eventMock,
            stopImmediatePropagation: true
        });

        eventMock.stopPropagation.should.have.callCount(1);
        eventMock.stopImmediatePropagation.should.have.callCount(1);
    });
});
