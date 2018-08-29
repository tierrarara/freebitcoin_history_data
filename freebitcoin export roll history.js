
// start from newest
// con 1500 iteraciones son al rededor de 30mil rolls, es lo maximo que deja mostrar el freebitcoin
// el script no contiene links a ningun lugar
var maxIterations = 3;

var $newHistory = $('#newer_bet_history');

var $olderHistory = $('#older_bet_history');

var currentIteration = 1;

var table = [];

//var hashTable = {};

var loopSpeedMS = 150;

$('textarea#my_custom_history').remove();


function loop() {
    if(currentIteration > maxIterations) {
        // show data
		getTableStr();
        return;
    }

    currentIteration++;

    getIteration();

    
}


function getIteration () {

    if (currentIteration == 1) {
        //$newHistory.click();
    }else {
        $olderHistory.click();
    }


    getData()


}


function getData() {

    if ($newHistory.is(':disabled') || $olderHistory.is(':disabled')) {
        setTimeout(getData, 400);
        return;
    }

   readTable();

    setTimeout(loop, loopSpeedMS);
}


function readTable() {
    var container = $('#bet_history_table_rows');

    var rows = $('>div', container);

    var currentDate = '';

    $.each(rows, function (idx, row) {

        var $r = $(row);

        if( /^multiply_history_date_row_.*/.test( $r.attr('id'))) {
            currentDate = getDateStr($r);
            return true;// continue next element
        }


        if ($r.hasClass('multiply_history_table_header')) {
            // ignore row
            return true;// continue next element
        }


        var rowObject = []

        var rowData = $r.find('>div:first>div');

        $.each(rowData, function (kdx, cell){

            
            switch(kdx) {
                case 0:
                   rowObject.push( currentDate + ' ' + $(cell).text());
                break;
                case 1:
                    rowObject.push($(cell).text());
                break;
                case 2:
                    rowObject.push($(cell).text());
                break;
                case 3:
                    rowObject.push($(cell).text());
                break;
                case 4:
                    rowObject.push($(cell).text());
                break;
                case 5:
                    rowObject.push($(cell).text());
                break;
                case 6:
                    rowObject.push($(cell).text());
                break;
                case 7:
                    // skip this column 
                    //rowObject.push($(cell).text());
                break;
                case 8:
                    // parser el link del click para obtener el conteo de apuestas y utilizarlo como ID

                    var linkInfo = parseLinkInfo($(cell));
                    rowObject.push(linkInfo[0]);// NONCE value
                    rowObject.push(linkInfo[1]);
                break;
                default:

            }

        });


        var rowCSVStr = rowObject.join(';')

        // remove duplicated elements
        // was added nonce value like id
        // hashTable[rowObject[0] + '|' + rowObject[0]] = rowCSVStr

        table.push(rowCSVStr);



    });

    
}

function getDateStr($row) {

    // Example DATE: 28/08/2018
    var strDateRaw = $row.find('div').html().split(' ');
    strDateRaw = strDateRaw[1].split('/');

    return '' +  strDateRaw[2] + '-' + strDateRaw[1] +'-'+ strDateRaw[0];



}

function getTableStr(lineSeparator) {

    if (!lineSeparator)
        lineSeparator = '|';


    var r = table.join(lineSeparator);

       // add text area

       $('body').append('<textarea id="my_custom_history"></textarea>');


$('textarea#my_custom_history').text(r);

var copyText = document.getElementById("my_custom_history")

copyText.select();

document.execCommand("copy");

alert('vaya al final de la pagina y copie el texto que aparece en la caja y guardelo en un archivo de texto');

}

function parseLinkInfo($cell){

    var verifierLink = $cell.find('a').attr('href');

    var nonce = '-1';

    try {
        var matches = verifierLink.match(/nonce=(\d+)/);
        nonce = matches[1];
    }catch(_ex) {
        /* empty */
    }

    return [nonce, verifierLink];

}

// test with one(1) iteration
//setTimeout( getIteration, 100);

// all data
setTimeout( loop, 100);