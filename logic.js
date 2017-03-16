/**
 * Created by Sinelnikov on 08.03.2017.
 */
function parseToMassif() {
    var divident = document.getElementById("dividentTextField").value.split("");
    var divisor = document.getElementById("divisorTextField").value.split("");
    invertMassifOfSixNumbers(divident);
    invertMassifOfSixNumbers(divisor);
    putInRegisters(divident, divisor);
}

function putInRegisters(divident, divisor) {
    var registerP = [0, 0, 0, 0, 0, 0, 0];
    var registerA = [];
    var registerB = [];
    for (var index = 0; index < 6; index++) {
        registerA.push(+divident[index]);
        registerB.push(+divisor[index]);
    }
    shift(registerA, registerP);
/*    registerP = subtract(registerP, registerB);
    if(registerP[6]==1){
        registerP = summ(registerP, registerB);
    }*/
    console.log(registerP);
    console.log(registerA);
    console.log(registerB);
}


function invertMassifOfSixNumbers(massif) {
    for (var index = 0; index < 3; index++) {
        var tempVarForElemsChanging;
        tempVarForElemsChanging = massif[index];
        massif[index] = massif[5 - index];
        massif[5 - index] = tempVarForElemsChanging;
    }
}

function shift(A, P) {
    var higherBitOfARegister = A[5];
    for (var index = 5; index > 0; index--) {
        P[index] = P[index - 1];
        A[index] = A[index - 1];
    }
    P[0] = higherBitOfARegister;
    A[0] = 0;
}

function subtract(minuend, subtrahend) {
    var biggerNumber = [];
    var smallerNumber = [];
    negative = new Boolean(false);
    if (comperisonIfSecondBigger(minuend, subtrahend)) {
        biggerNumber = subtrahend;
        smallerNumber = minuend;
        negative = true;
    }
    else {
        biggerNumber = minuend;
        smallerNumber = subtrahend;
    }
    var addition = smallerNumber.slice();
    for (var index = 0; index < smallerNumber.length; index++) {
        if (addition[index] == 1) {
            addition[index] = 0;
        }
        else addition[index] = 1;
    }
    var oneInSixBits = [1, 0, 0, 0, 0, 0];
    addition = summ(addition, oneInSixBits);
    var substraction = [];
    substraction = summ(biggerNumber, addition);
    if (substraction.length > 6) {
        substraction.pop();
    }
    if (negative) {
        substraction.push(1);
    }
    else {
        substraction.push(0);
    }
    //console.log(substraction);
    return substraction;

}

function comperisonIfSecondBigger(fisrtBinNumber, secondBinNumber) {
    for (var index = 5; index >= 0; index--) {
        if (fisrtBinNumber[index] < secondBinNumber[index]) {
            return true;
        }
    }
    return false;
}

function summ(P, B) {
    if(P[6]==1){
        P[6]=0;
        return subtract(B,P);
    }
    var summOfPair = [];
    for (var index = 0; index < 6; index++) {
        summOfPair[index] = P[index] + B[index];
    }
    for (var index = 0; index < summOfPair.length; index++) {
        if (summOfPair[index] > 1) {
            if (index == summOfPair.length - 1) {
                summOfPair.push(0);
            }
            if (summOfPair[index] % 2 == 0) {
                summOfPair[index + 1] += summOfPair[index] / 2;
                summOfPair[index] = 0;
            }
            else {
                summOfPair[index + 1] += (summOfPair[index] - 1) / 2;
                summOfPair[index] = (summOfPair[index] - 1) / 2;
            }
        }
    }
    return summOfPair;
}