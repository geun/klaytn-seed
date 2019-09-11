

const internal = {
	get: {},
	set: {}
};

class FLUIBank {
	_bankState = false;
	getBankState() {
		return this._bankState;
	}
}



//
// (main(){
// 	private const _bankState = false;
//
// 	const getter = () => {
// 		return _bankState
// 	};
//
// 	const setter = (value) =>{
// 		_bankState = value
// 		emit new Event('Set New Bank State')
// 	};
// })();
//
//
