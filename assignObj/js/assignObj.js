var key, i;
const assignObj = (...args) => {
	for (i = 1; i < args.length; i += 1){
		for (key in args[i]) {
			args[0][key] = args[i][key];
		}	
	}
	return args[0];
};

const newObj = assignObj({a:1, b: 2, c: 3}, {b: 3, c: 4}, {c: 5, d: 10});

for (key in newObj) {
	console.log(key + ': ' + newObj[key]);
}