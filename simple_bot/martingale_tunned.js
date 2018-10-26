/**
 *  Dice game bot
 * se pueden reemplazar los selectores _btc_ por _doge_ y funciona tambien para freedogeco.in
 *
 * FAVOR LEER
 * WARNING: Esto es solo un caso de estudio, este bot no asegura ninguna ganancia, es mas, es muy probable ud pierda todo su dinero
 * queda bajo su responsabilidad utilizarlo y todo problema que este le genere es bajo su propio riesgo
 * 
 * este bot solo ha sido testeado por mi y mis pruebas no han sido satisfactorias
 * ud puede utilizar el codigo a su antojo y modificarlo como quiera, es libre de enviarme cualquier mejora
 * 
 * ya se puede utilizar, pero aun no esta terminado
 */



 /* Acciones */
 var doc = window.document;

 var cfg = {
 
     // lista de valores de apuesta, secuencia en caso de perdida
     // la cantidad de valores representa la cantidad maxima de perdidas consecutivas
     // he visto hasta 25 veces perdidas consecutivas
     // el limite del valor de las apuestas mas alta depende tambien de la condicion que hace cambiar el minBalance, que ahora se modifica manualmente
    useLoHiSequence: true,

    // 1 lo, 0 hi
    loHiSequence: [1,0,1,1,1,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0],

    sequenceNumber: 1,


     betSecuence: [0.00000004, 0.00000008, 0.00000016, 0.00000032, 0.00000064,0.00000128, 0.00000256,0.00000512,0.00001024,0.00002048, 0.00004096,0.00008192 ],
     
     // luego de un numero de perdidas consecutivas, mantener la apuesta minima
     // este numero  debe ser menor a la cantidad de elementos del arreglo betSecuence
     maxLoseBet: 9,
 
 
 
     /* 
     luego de un numero definido de perdidas consecutivas apostar el valor maximo de la secuencia
     he ir duplicando el valor
      */
     enableBooster: true,
 
     // este numero debe ser menor que maxLoseBet
     boosterAfter: 8,
 
     // booster a la apuesta 1 sola vez
     maxBoosterCount: 0,
 
     jQueryRequired: false,
     balance: 0,
     minBalance: 0.00013000,
     increaceMinBalance: false,
     increacMinBalanceStep: 0.00001000,
     
     // comenzar por la opcio LO
     startInLo: true,
     // rotar entre LO y HI
     switchLoHi: true,
 
     // current switch value
     inLo: true,
 
     hiButton: $('#double_your_btc_bet_hi_button'),
 
     loButton: $('#double_your_btc_bet_lo_button'),
 
     // campo para escribir el valor de la apuesta, es un selector jQuery 
     betField: $('#double_your_btc_stake'),
 
 
     
     stopBet: false, // esto es un switch para detener las apuestas
     continueLoseCount: 0, // contador cantidad de apuetas perdidas consecutivamente
 
     // rango de tiempo de espera entre apuestas en milisegundos
     // ajustar a valores reales de juego manual para evitar ser bloqueado
     minWait: 500,
     maxWait: 900,
 
 };
 
 var bet = {
 
     amount : 0,
 
     count:0,
     // perdidas consecutivas
     loseCount: 0,
 
     totalLoseCount: 0,
 
     totalWinCount:0,
 
     totalWin: 0,
 
     totalLose:0,
 
     // cantidad de booster consecutivos actual
     boosterCount: 0,
 
 
 
     // iniciar bot
     start: function () {
 
         cfg.stopBet = false;
 
         bet.reset();
 
         // colocar el switch en la posicion inicial
         cfg.inLo = cfg.startInLo;
 
         // ejecutar la primera apuesta
         bet.make();
 
         // iniciar bot
         bet._run();
 
     },
 
     // loop de apuestas
     _run: function () {
 
 
         if (bet.hasBalance() && bet.betIsAvailable() && !cfg.stopBet ) {
             bet.make();
         }
 
 
         
         //setTimeout(bet.run, bet.waitForNext());
         var wait = bet.waitForNext();
         console.log('next bet: ', (wait / 1000));
 
         setTimeout(function () { 
             
             bet._run();
         }, wait);
 
     },
 
     // detener bot
     stop: function () {  cfg.stopBet = true;  },
 
     make: function () {
         // use configuration value to select method
         bet.calculateBetX2();
         
         if (cfg.inLo) {
 
             bet.lo();
 
         }else {
 
             bet.hi();
         }
 
         
 
 
     },
 
     // apuesta manual opcion hi
     hi: function () { cfg.hiButton.click(); },
     // apuesta manual opcion lo
     lo: function () { cfg.loButton.click(); },
 
     // mover el switch
     switchLoHi: function () {
         if (cfg.switchLoHi) {
             cfg.inLo = !cfg.inLo;
         }
     },

     loOrHi: function () {

        cfg.inLo = cfg.loHiSequence[cfg.sequenceNumber % 20] == 1
        cfg.sequenceNumber++;
        
     },
 
     // reiniciar el valor de la apueta, coloca el primer valor de la secuencia en cfg.betSecuence
     reset: function () {
 
         bet.count = 0;
 
         // no borrar estadisticas
 
         //cfg.betField.val(cfg.betSecuence[])
 
     },
 
     // otra estrategia
     calculateBetLoseSwitch: function () {
         
         debugger;
 
         if(this.wasWin()) {
             
             
             
             if (cfg.inLo) {
                 bet.loseCount = 0;
                 bet.count = 0;
                 bet.totalLoseCount = 0;
                 
                 
                 bet.totalWinCount = bet.totalWinCount + 1;
                 // got to hi
                 bet.switchLoHi();
             }
 
             bet.updateMinBalance();
 
         }else {
 
             bet.count = bet.count + 1;
             bet.totalLoseCount ++;
             
             // switch
             bet.switchLoHi();
             
         }
         
         
         if (bet.totalLoseCount >= cfg.betSecuence.length) {
             bet.count = 0;
         }
 
         if(cfg.inLo) {
             cfg.betField.val( (cfg.betSecuence[bet.count]).toFixed(8) );
         }else {
             cfg.betField.val( (cfg.betSecuence[0]).toFixed(8) );
         }
         
         
         
     },
     
     
     // the magic
     // define el monto en la proxima apuesta 
     // basado en el historial
     // aqui es donde esta la logica del bot, que cantidad apostar
     // esta es la estrategia de martingale
     calculateBetX2: function () {
 
         if(this.wasWin()) {
 
            bet.count = 0;
 
            bet.loseCount = 0;
 
            bet.updateMinBalance();
 
            bet.totalWinCount = bet.totalWinCount + 1;
 
            cfg.maxBootsTry = 0
 
            bet.boosterCount = 0;
 
             
 
         }else {
 
            bet.count = bet.count + 1;
 
            bet.loseCount = bet.loseCount + 1;
 
            bet.totalLoseCount = bet.totalLoseCount + 1;
 
             
         }
 

 
         if (bet.count >= cfg.betSecuence.length) {
            bet.count = 0;
         }

 
         if (bet.loseCount > cfg.maxLoseBet) {
            bet.switchLoHi();
            bet.count = 0;
         }

         cfg.betField.val( (cfg.betSecuence[bet.count]).toFixed(8) );
 
         // modificar el valor de la apuesta, sin modificar el contador
         // calcular el contador de perdidas
         if (bet.loseCount > cfg.boostBet && bet.boosterCount < cfg.maxBoosterCount) {
 
             // (cfg.boostBet - bet.loseCount)
             bet.boosterCount ++;
 
             // apostar el maximo valor de la secuencia
             var betVal = cfg.betSecuence[cfg.betSecuence.length - 1];
 
             //bet.up(0)
             // 250, 500, 1500
             cfg.betField.val( betVal * bet.boosterCount);
         }
         

         if (cfg.useLoHiSequence) {
            bet.loOrHi();
         }
         
 
     },
 
     // cual fue el resultado de la apuesta
     wasWin: function () {
 
         var ret = false;
 
         if ($('#double_your_btc_bet_win').is(':visible')) {
             var match = $('#double_your_btc_bet_win').text().match(/\d+\.\d+/g);
             bet.amount = match[0];
 
             ret = true;
 
         }else if($('#double_your_btc_bet_lose').is(':visible')){
             var match = $('#double_your_btc_bet_lose').text().match(/\d+\.\d+/g);
             bet.amount = match[0];
 
             
         } else {
             // para resetear la apuesta
             ret = true;
         }
 
 
         return ret;
 
     },
 
     // duplicar el valor de la apuesta
     up: function () { $('#double_your_btc_2x').click();},
 
     // dividir el valor de la apuesta
     down: function () { $('#double_your_btc_half').click();},
 
     // calcular el tiempo de espera para la proxima jugada
     // retorna el valor en milisegundos
     waitForNext: function () { return (Math.random() * (cfg.maxWait - cfg.minWait) + cfg.minWait);},
 
     /**
      * cuando se envia una solicitud de apuesta, el tiempo de respuesta no es definido
      * por lo general deshabilitan las apuestas marcando algun elemento
      * esta funcion verifica que dicho elemento este habilitado para la proxima apuesta
      * @return boolean
      */
     betIsAvailable: function () {  
         // para el caso de freebitcoin y freedogecoin 
         return !cfg.hiButton.attr('disabled') && !cfg.loButton.attr('disabled') ;
 
       },
 
     hasBalance: function () {
         var balance = parseFloat($('#balance').text());
 
         return balance > cfg.minBalance;
 
      },
 
      updateMinBalance: function () {
 
         var balance = parseFloat($('#balance').text());
 
         if (balance > cfg.minBalance + (cfg.increacMinBalanceStep * 1.8)) {
 
             cfg.minBalance = cfg.minBalance + cfg.increacMinBalanceStep;
 
         }
      }
 
 
 }
 
 var util = {
     
 
     // registro de estadisticas
     record: function () {},
 
     log: function () {}
 
 }
 
 bet.start();
