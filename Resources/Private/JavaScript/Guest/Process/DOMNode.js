import {BaseClass} from 'domtastic';

class DOMNode extends BaseClass {
	constructor(selector) {
		super(selector);

		document.addEventListener('click', e => {
			const check = el => (el === e.target) || check(el.parentNode);
		});
	}
}

export default selector => new DOMNode(selector);
