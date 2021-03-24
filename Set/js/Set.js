var checkedNewObjectProps = [];

const compareObjects = (oldValue, newValue) => {
var key, i;	
	if (Array.isArray(oldValue) && Array.isArray(newValue)) {
		if (oldValue.length === newValue.length) {
			for (i = 0; i < oldValue.length; i += 1) {
				if (typeof oldValue[i] === 'object' && typeof newValue[i] === 'object') {
					if (!compareObjects(oldValue[i], newValue[i])) {
						return false;
					} 
				} else {
					if (oldValue[i] !== newValue[i]) {
						return false;
					}	
				}
			}
		} else {
			return false;
		}
	} else {
		for (key in oldValue) {
			if (typeof oldValue[key] === 'object' && typeof newValue[key] === 'object') {
				if(!compareObjects(oldValue[key], newValue[key])) {
					return false;
				}
			} else {
				if (oldValue[key] !== newValue[key]) {
					return false;
				}
			}						
			checkedNewObjectProps.push(newValue[key]);
		}
		for (key in newValue) {
			//if newObject has some props left it is not equal
			if (checkedNewObjectProps.indexOf(newValue[key]) === -1) {
				return false;
			}
		}
	}
	if (Array.isArray(oldValue) && !Array.isArray(newValue) || !Array.isArray(oldValue) && Array.isArray(newValue)) {
		return false;
	}
	return true;
};

const a = [];
const b = {};
// const a = {a: 1, b: 2, c: {ca: 3, cb: 4}};
// const b = {a: 1, b: 2, c: {ca: 3, cb: 4}};
// const a = {a: 1, b: 2, c: 3};
// const b = {a: 1, b: 2, c: 3};
// const a = [1, 2, [3, 4]];
// const b = [1, 2, [3, 4]];
// const a = [1, 2, 3];
// const b = [1, 2, 3];
// const a = [1, 2, {a: 3, b: 4}];
// const b = [1, 2, {a: 3, b: 4}];
// const a = {a: 1, b: 2, c: [3, 4]};
// const b = {a: 1, b: 2, c: [3, 4]};
console.log('areEqualObjects = ' + compareObjects(a, b));
//arrow function get context from lexical environment, so I decided to use function()
Set.prototype.addWithObjCompare = function(newValue) {
	var oldValue, currentSet = this;
	if (typeof newValue === 'object') {
		console.log('newValue type is object');
		for (oldValue of currentSet) {
			if (typeof oldValue === 'object') {
				if (compareObjects(oldValue, newValue)) {
					console.log('return');
					return;
				}
			}
		}	
	}
	currentSet.add(newValue);
};
var mySet = new Set(),
	value;

mySet.addWithObjCompare(1);	
mySet.addWithObjCompare(1);
mySet.addWithObjCompare(2);
mySet.addWithObjCompare(a);
mySet.addWithObjCompare(b);

for (value of mySet) {
	console.log('value = ' + value + ' ' + Array.isArray(value));
}


