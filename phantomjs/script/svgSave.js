var page = require('webpage').create(),
        system = require('system');

page.viewportSize = {width: 500, height: 500};

//page.customHeaders={'Authorization': 'Basic '+btoa('original:innovant')}; // fait un bug (variable init) et three js non execute

var loadInProgress = false;
var index = 0;
var urls = new Array();
//var outputs = new Array();
var NBR = 1; //le nombre de figure, donc il va faire NBR*2 images
var ANGLE = 1; //le nombre d'angle par defaut
//NBR * (ANGLE+1) images seront creees
var prf = "03"; //prf de l'url par defaut

page.onLoadStarted = function () {
    loadInProgress = true;
    console.log("Load started " + index);
};

page.onLoadFinished = function () {
    loadInProgress = false;
    console.log("Finished. " + index);
//    console.log("page.render : " + outputs[index]);
//    page.render(outputs[index]);
    index++;
};

if (system.args.length > 4) {
    console.log('Usage: svgSave.js [prf] [number of figures] [number of angles]');
    phantom.exit(1);
}
if(system.args.length > 1) {
    prf = system.args[1];
}
if (system.args.length >= 3) {
    NBR = system.args[2];
    if (NBR <= 0) {
        console.log('Number of figures > 0 please.');
        phantom.exit(1);
    }
}
if (system.args.length === 4) {
    ANGLE = system.args[3];
    if (ANGLE > 360 || ANGLE <= 0) {
        console.log('Number of angles <= 360 && > 0 please.');
        phantom.exit(1);
    }
}


var angles = new Array();
if (ANGLE > 1) {
//l'angle par lequel on fini, par exemple si ANGLE = 24 on ira de -12 a 12
//pour eviter les negatifs -12 => 360-12 
    var max = Math.floor(ANGLE / 2); //arrondit en dessous
    var min = -max;
    for (var i = 0; i <= max * 2; i++) {
        if(min<0) angles[i] = 180+min;
        else angles[i] = min;
        min++;
    }
}
else angles[0] = 0;

for (var k = 0; k < NBR; k++) {

    var param = "";

    //creation de val du type 1-3-11_4-12-9_...
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 3; j++) {
            param += Math.floor((Math.random() * 15) + 1);
            if (j < 2)
                param += "-";
        }
        param += "_";
    }
    //creation de l'url et du nom de fichier * chaque angle
    for (var i = 0; i < angles.length; i++) {
//        console.log("ID urls :"+(angles.length * k + i));
//        console.log('urls : ' + (angles.length * k + i)+"  val= "+param + angles[i]);
        urls[angles.length * k + i] = "http://jt.ag/indexSVG2?prf=" + prf + "&val=" + param + angles[i];
//        outputs[angles.length * k + i] = "imgQR/" + param + angles[i] + ".png";
    }

}
//    setTimeout(function() {setInterval(nextPage, 100);},1); //Contournement d'un BUG de Phantom JS
setInterval(nextPage, 1000); //100ms n'est pas suffisant ATTENTION temps a reverifier sur serveur



function nextPage() {
//    console.log("nextPage");
    if (!loadInProgress) {
        if (index < urls.length) { //execution
            console.log('Opening the address : ' + urls[index]);
            page.open(urls[index], function (status) {               
                if (status !== 'success') {
                    console.log('Problem with the address : ' + urls[index]);
                    phantom.exit(1);
                }
            });
        }
        else { //fin du script
            console.log("Fin du script.");
            phantom.exit(0);
        }
    }

}