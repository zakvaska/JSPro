var key, i;
const assignObj = (...args) => {
	for (i = 1; i < args.length; i += 1){
		if (typeof args[i] === 'object') {
			for (key in args[i]) {
				if (typeof args[i][key] !== 'object') {
					args[0][key] = args[i][key];
				} else {
					args[0][key] = assignObj({}, args[i][key]);
				}
			}	
		}			
	}
	return args[0];
};


const d = {c: 5, d: {da: 0, db: 1}};
// const newObj = assignObj({a:1, b: 2, c: 3}, {b: 3, c: 4}, d);
const newObj = assignObj({a:1, b: 2, c: 3}, d);

console.log('BEFORE d.d.da = ' + d.d.da);
console.log('BEFORE newObj.d.da = ' + newObj.d.da);
newObj.d.da = 10;
console.log('AFTER d.d.da = ' + d.d.da);
console.log('AFTER newObj.d.da = ' + newObj.d.da);

printObject = function(object, objectName) {
	let key,		
	currentObject = object;
	for (key in currentObject) {
		if (typeof currentObject[key] === 'object') {
			printObject(currentObject[key], `${objectName}.${key}`);
		} else {
			console.log(`${objectName}.${key} = ${currentObject[key]}`);
		}		
	}				
};
const testObj = {a: 1, b: 2, c: {ca: 0, cb: 1, cc: [0, 1]}};
printObject(testObj, 'testObj');
printObject(d, 'd');
printObject(newObj, 'newObj');
