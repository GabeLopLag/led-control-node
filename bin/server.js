
var io = require('socket.io')();
var PythonShell = require('python-shell');
var Timer = require('easytimer');

var opt = {
    scriptPath: '/home/gabriel/Desktop/foco-remoto/bin/scripts',
    args: []
  };
var timer1 = new Timer();
var timer2 = new Timer();
var timer3 = new Timer();
var timer4 = new Timer();
var timer5 = new Timer();
var timer6 = new Timer();
var timer7 = new Timer();
var timer8 = new Timer();

function runPy(arg)
{
    opt.args = [];
    opt.args.push(arg);
    console.log(opt);
    PythonShell.run('prender.py', opt, function (err, dataPython) {
        if (err) {
            console.log(err)
        }
        console.log(Number(dataPython[0]));
    });
}

io.on('connection', (socket) => {
    console.log('New Connection on: ' + socket.id);

    socket.on('sendReq', (msg) => {
         var ledParams = JSON.parse(msg);
        // if(eval("timer"+ledParams.foco) === undefined){
        //     eval("var timer"+ledParams.foco) = new Timer();
        // }
        console.log(msg);
        //prende el foco
        runPy(msg);

        eval("timer"+ledParams.foco).addEventListener('secondsUpdated', (e) => {
            var restantes = (3600 * eval("timer"+ledParams.foco).getTimeValues().hours) 
            + (60 * eval("timer"+ledParams.foco).getTimeValues().minutes) 
            + eval("timer"+ledParams.foco).getTimeValues().seconds;
            
            var ison = 1;
            if (restantes === 0) {
                //script de apagado aqui
                ledParams.isOn = 0;
                runPy(JSON.stringify(ledParams));
                ison = 0;
            }
            
            var objLeds = {
                isOn: ison, seconds: restantes, pin: ledParams.pin,
                timerStr: eval("timer"+ledParams.foco).getTimeValues().toString(), foco: ledParams.foco
            }
            io.sockets.emit('sendTimer', JSON.stringify(objLeds));//send whole object here

        });

        var timerGen = eval("timer" + ledParams.foco);
        //script de encendido aqui
        timerGen.start({
            countdown: true, startValues: { seconds: ledParams.seconds },
            target: { seconds: 0 }
        });

    });
    socket.on('stopReq',(msg)=>{
        var ledParams = JSON.parse(msg);
        //apagar led aqui con python
        ledParams.isOn=0;
        runPy(JSON.stringify(ledParams));
        
        eval("timer"+ledParams.foco).stop();
        ledParams.seconds=0;
        ledParams.timerStr="00:00:00";
        io.sockets.emit('sendTimer', JSON.stringify(ledParams));
    });
    socket.on('pauseReq',(msg)=>{
        var ledParams = JSON.parse(msg);
        if(eval("timer"+ledParams.foco).isPaused()){
            eval("timer"+ledParams.foco).start();
        }
        else{
            eval("timer"+ledParams.foco).pause();
        }
    });
});

module.exports = io;

