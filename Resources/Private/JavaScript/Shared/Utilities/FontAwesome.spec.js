import sinon from 'sinon';
import {validateId, getClassName} from './FontAwesome.js';

describe('"shared.utilities.fontAwesome"', () => {
    describe('validateId', () => {
        it('should return an object containing at least key value pairs for "isValid" and "iconName".', () => {
            expect(validateId('test')).to.contain.all.keys(['isValid', 'iconName']);
        });

        it('should return a falsy "isValid" value if no id was passed.', () => {
            expect(validateId('test').isValid).to.equal(false);
        });

        it('should return a falsy "isValid" value if the passed id was not found in the Font-Awesome icon names.', () => {
            expect(validateId('test').isValid).to.equal(false);
        });

        it('should not return a "iconName" value if the passed id was not found in the Font-Awesome icon names.', () => {
            expect(validateId('test').iconName).to.equal(null);
        });

        it('should return truthy "isValid" value if the passed id was found in the Font-Awesome icon names.', () => {
            expect(validateId('fa-glass').isValid).to.equal(true);
        });

        it('should return the given id as the "iconName" if the passed id was found in the Font-Awesome icon names.', () => {
            expect(validateId('fa-glass').iconName).to.equal('fa-glass');
        });

        it('should automatically add the "fa-" prefix to the given id before starting the validation.', () => {
            const result = validateId('glass');

            expect(result.isValid).to.equal(true);
            expect(result.iconName).to.equal('fa-glass');
        });

        it('should migrate old icon ids to the new newest version.', () => {
            const result = validateId('icon-glass');

            expect(result.isValid).to.equal(false);
            expect(result.isMigrationNeeded).to.equal(true);
            expect(result.iconName).to.equal('fa-glass');
        });
    });

    describe('getClassName', () => {
        it('should return "undefined" if the passed id is invalid.', () => {
            expect(getClassName('test')).to.equal(undefined);
        });

        it('should return the icon className if the passed id is valid.', () => {
            expect(getClassName('fa-glass')).to.be.a('string');
        });

        it('should apply the migration logic of the "validateId" to the passed id and should return the className of an outdated id.', () => {
            expect(getClassName('icon-glass')).to.be.a('string');
        });
    });
});
