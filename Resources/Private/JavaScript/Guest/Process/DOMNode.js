import { BaseClass } from 'domtastic';

export default class DOMNode extends BaseClass {

    constructor(selector) {
        super(selector)

        document.addEventListener('click', e => {
            const check = el => (el === e.target) || check(el.parentNode);

            if (checkt)
        });
    }

}
