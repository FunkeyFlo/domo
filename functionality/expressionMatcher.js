module.exports = function checkForCommandMatch(input, currentInputIndex, expression, currentExpressionIndex) {

    // Extract word from input
    var endOfInputWord = input.indexOf(' ', currentInputIndex);
    var inputWord = input.substring(currentInputIndex, endOfInputWord);
    console.log('inputWord   :   ' + inputWord);

    // Baseline (if any of these run out before command completion it's a failure)
    if (expression.length <= currentExpressionIndex) {
        return false;
    } else if (input.length <= currentInputIndex) {
        return false;
    }

    else {

        // On '<'-tag create a list from all the possible options.
        if (expression.charAt(currentExpressionIndex) == '<') {
            var endIndex = expression.indexOf('>', currentExpressionIndex);
            var possibilities = expression.substring(currentExpressionIndex + 1, endIndex);
            console.log('possibilities   :   ' + possibilities);

            // If the input word matches any of the possible.
            if (compareToPossibilities(inputWord, possibilities)) {
                // If all parts of the expression have been analyzed and returned true the match was a success!
                if (expression.length - 1 <= endIndex) {
                    return true;
                }
                // If there are still parts of the expression left continue on with expressionIndex set after '>'.
                else {
                    return checkForCommandMatch(input, endOfInputWord + 1, expression, endIndex + 1)
                }
            }
            // Input word could not be matched to any of the possibilities so raise index of input to next word but keep
            // the index of expression here.
            else {
                return checkForCommandMatch(input, endOfInputWord + 1, expression, currentExpressionIndex)
            }
        }

        // For specific words in the expression
        else {

            // get the current specific word from the expression
            var endOfExpressionWord = expression.indexOf(' ', currentExpressionIndex);
            var commandWord = expression.substring(currentExpressionIndex, endOfExpressionWord);
            console.log('commandWord :   ' + commandWord);

            if (commandWord == inputWord) {
                if (expression.length - 1 <= endOfExpressionWord) {
                    return true;
                } else {
                    return checkForCommandMatch(input, endOfInputWord + 1, expression, endOfExpressionWord + 1);
                }
            } else {
                return checkForCommandMatch(input, endOfInputWord + 1, expression, currentExpressionIndex);
            }
        }
    }
}

function compareToPossibilities(inputWord, possibleExpressionString) {
    var hasBeenFound = false;

    // Divide all the words in the substring into an array.
    var possibleExpressions = possibleExpressionString.split(" ");

    possibleExpressions.some(function (possibleExpression) {
        if (possibleExpression === inputWord) {
            hasBeenFound = true;
            return true;
        }
    });

    return hasBeenFound;
}