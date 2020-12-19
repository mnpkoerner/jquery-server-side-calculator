$(document).ready(readyNow);

function readyNow() {
    console.log('jq ready')
    $('#submit').on('click', sendAndAppend)
    $('#clear').on('click', resetCalculator)
    $('.operator').on('click', disableOperator)
}

let mathObject = {
    intOne: undefined,
    intTwo: undefined,
    operator: null,
}

function sendAndAppend() {
    if (mathObject.operator === null) {
        resetCalculator();
        alert('Please select a valid operator')
        return;
    }
    mathObject.intOne = Number($('#inputOne').val());
    mathObject.intTwo = Number($('#inputTwo').val());
    //I want to post an object to the server that has two numbers and their operator
    console.log('in send', mathObject)
    $.ajax({
        url: '/calculate',
        type: 'POST',
        data: mathObject
    }).then(function (response) {
        console.log(response);
        resetCalculator();
        //append has the get request, it will run after the user side math
        //has been posted to the server. when the user data is posted, it
        //does the math, then stores it in an array in /calculation
        //the get request accesses calculation
        append()
    })
}

//getarray from /calculate and append dom
function append() {
    $.ajax({
        url: '/calculate',
        type: 'GET'
    }).then(function (response) {
        console.log(response)
        updateDom(response)
    })
}

//clicking any of the operators adds a value to the object
function disableOperator() {
    //add operator data-func to the data object we're pushing to the server
    mathObject.operator = $(this).data('func');
    //disable all other operator buttons
    $('.operator').prop('disabled', true);
    console.log('operators disabled')
    console.log(mathObject)
}

//hitting the clear button will clear the number inputs and enable the operator buttons
function resetCalculator() {
    $('input').val('');
    $('.operator').prop('disabled', false);
}

//update the dom object, the object will be an array of objects I'm storing on the server,
//the DOM will update every time you click the "=" button
function updateDom(obj) {
    $('#target').empty();
    for (equ of obj) {
        $('#target').append(`<p>${equ.intOne} ${equ.operator} ${equ.intTwo} = ${equ.result}`)
    }
}
