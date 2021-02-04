//Функция для валидации строк с кавычками. Определяет правильно ли закрыты все скобки и нет ли закрывающих скобок без открывающих
var isValidParentheses = function(string) {
	var i,
		stringLength = string.length,
		symbol,
		template = '()[]{}', 
		startParentheses = [],
		endParentheses = [],
		templIndex,
		lastUnclosedTemplIndex;
		
	if (stringLength === 0) return false;
	
	for (i = 0; i < stringLength; i += 1) {
		symbol = string[i];
		templIndex = template.indexOf(symbol);
		
		if (templIndex != -1) { //if it is one of the template characters
			if (templIndex % 2 === 0) { //if it is a startParentheses
				startParentheses.push(symbol);
				lastUnclosedTemplIndex = templIndex;
			} else if (templIndex % 2 !== 0) { //if it is an endParentheses
				endParentheses.push(symbol);
				if (lastUnclosedTemplIndex + 1 === templIndex) { //if there is a match between current endParentheses and last startParentheses
					startParentheses.pop();
					endParentheses.pop();
					lastUnclosedTemplIndex = template.indexOf(startParentheses[startParentheses.length - 1]);	
				}
			}
		}
	}

	if (startParentheses.length === 0 && endParentheses.length === 0) {
		return true;
	} else return false;
	
};

var answer = true,
	parentheses;

while (answer) {
	parentheses = prompt('Введите строку для проверки на валидность кавычек', '()[]{}');
	console.log(isValidParentheses(parentheses));
	answer = confirm(isValidParentheses(parentheses));
}