import uuid from 'uuid';
import {Map} from 'immutable';

export default handler => ({
    $__handle: registry => {
        const id = uuid.v4();

        if (!registry instanceof Map) {
            throw new Error(`Registry needs to be an instance of Immutable.Map. Found ${typeof registry} instead.`);
        }

        return {
            registry: registy.set(id, handler),
            id
        };
    }
});
