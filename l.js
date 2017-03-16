const steps = 11;

var isFirstWave = true;

var finalString = ""; 

var isTablePrinted = false;

function addNumbersToFinalString(number){
    finalString += number + ", ";
}

function getFinalString(){
    return "{" + finalString.substr(0, finalString.lastIndexOf(",")) + "}";
}

function ouputFinalString(){
    var outputString = '<b>C = ' + getFinalString() + '</b>';
    document.getElementById('res').innerHTML = outputString;
}

function resetDefault(){
    finalString = "";
    isFirstWave = true;
    document.getElementById('res').innerHTML = '';
    document.getElementById("inputA").value = "";
    document.getElementById("inputB").value = "";
    document.getElementById("inputM").value = "";
    document.getElementById("inputT").value = "";
}

function dataProcessing(){
    if(isTablePrinted) {
        removeTable();
        document.getElementById('res').innerHTML = '<b>C = </b>';
        isFirstWave = true;
        finalString = "";
    }
    var stateArray = new Array();
    for(var pair = 0; pair < getData().sizeOfTheArray; pair++){
        stateArray.push(conveyor(getData().timePerIteration, 
                                getData().firstArray[pair],
                                getData().secondArray[pair], 
                                pair));
    }
    return stateArray;
}

function conveyor(timePerIteration, nmbrA, nmbrB, wave){
    var currentData = {
        currentTime: [],
        currentSum: ["000000"],
        numberA: nmbrA,
        numberB: nmbrB,
        bit: []
    };

    var firstMultiplicationIteration = function(binaryNumberA, sixBit){
        return (sixBit == 1 || sixBit == "1") ? binaryNumberA : "000000";
    }

    var shift = function (currentSum){
        return currentSum + "0";
    }

    var multiplicationIteration = function (binaryNumberA, currentBit, summ, numberOfZeros){
        var number = (currentBit  == 1 || currentBit == "1") ? binaryNumberA : "000000";
        var toCorrect =  (parseInt(number, 2) + parseInt(summ, 2)).toString(2);
        var needToAdd = numberOfZeros - toCorrect.length;
        for (var zeros = 0; zeros < needToAdd; zeros++){
            toCorrect = "0" + toCorrect;
        }
        return toCorrect;
    }

    function conveyorProcessing(){
        var zeroes = 7;
        currentData.currentTime[0] = isFirstWave ? timePerIteration : (wave + 1) * timePerIteration;
        currentData.bit[0] = nmbrB.toString().charAt(0);
        currentData.currentSum[0] = firstMultiplicationIteration(nmbrA, currentData.bit[0]);
        for(var i = 1; i < steps; i++){
            currentData.currentTime[i] = currentData.currentTime[i - 1] + timePerIteration;
            if (i % 2 == 0) {
                currentData.currentSum[i] = multiplicationIteration(nmbrA, nmbrB.toString().charAt(i / 2), 
                                                                    currentData.currentSum[i - 1], zeroes);
                currentData.bit[i] = nmbrB.toString().charAt(i / 2);
                zeroes += 2;
            }
            else {
                currentData.currentSum[i] = shift(currentData.currentSum[i - 1]);
            }
            if (i == steps - 1) {
                currentData.currentSum[i] = dimensionCorrection(currentData.currentSum[i]);
                addNumbersToFinalString(parseInt(currentData.currentSum[i], 2));
            }
        }
        return currentData;
    }
    
    function dimensionCorrection(bNumber){
        var lackOfZeros = 12 - bNumber.length;
        for(var amount = 0; amount < lackOfZeros; amount++){
            bNumber = "0" + bNumber;
        }
        return bNumber;
    }
    
    isFirstWave = false;
    
    return conveyorProcessing();
}

function getData() {
    var inputData = {
        firstArray: getInputNumbers("inputA"),
        secondArray: getInputNumbers("inputB"),
        sizeOfTheArray: getSizeOfTheArray(),
        timePerIteration: getCountingTime()
    };
    
    return inputData;
}
//TODO: Analize input exeptions(in which string exception is)
function getInputNumbers(id){
    var elements = document.getElementById(id).value.replace(/\s+/g, '').split(',');
    if (elements.length != getSizeOfTheArray()) 
        throw new inputException("Input Exception!");
    var arrayOfElements = "";
    var output =[];
    for (var index = 0; index < elements.length; index++){
        if (elements[index].length < 1 ||
            +elements[index] < 0 ||
            typeof +elements[index] != "number" ||
           !Number.isInteger(+elements[index]))
            throw new inputException("Exception! Check your input string!");
        arrayOfElements = parseInt(elements[index]).toString(2);
        output.push(arrayOfElements);
    }
    return correctData(output);
}

function getSizeOfTheArray() {
    if (+document.getElementById("inputM").value < 1 ||
        typeof +document.getElementById("inputM").value != "number" ||
       !Number.isInteger(+document.getElementById("inputM").value)) 
        throw new inputException("Exception! Size of an array should be a positive number!");
    return parseInt(document.getElementById("inputM").value);
}
    
function correctData(array){
    for (var index = 0; index < array.length; index++){
        if(array[index].length < 6) {
            var lackOfZeros = 6 - array[index].length;
            for (var amount = 0; amount < lackOfZeros; amount++){
                array[index] = 0 + array[index];
            }
        }
        else if(array[index].length > 6) {
            var excessOfZeros = array[index].length - 6;
            array[index] = array[index].substr(excessOfZeros, array[index].length)
        }
        else continue;
    }
    return array;
}

function getCountingTime(){
    if (+document.getElementById("inputT").value < 1 ||
        typeof +document.getElementById("inputT").value != "number" ||
       !Number.isInteger(+document.getElementById("inputT").value)) 
        throw new inputException("Exception! Time per iteration should be a positive number!");
    return parseInt(document.getElementById("inputT").value);
}

function inputException(message){
    var outputString = '<b>' + message + '</b>';
    document.getElementById('res').innerHTML = outputString;
}

function shift(A,P) {
    var highOrderBitA = A[5];
    for (var bitNumber = 5; bitNumber > 0; bitNumber++){
        P[i] = P[i-1];
        A[i] = A[i-1];
    }
    P[0] = highOrderBitA;
    A[0] = 0;
}