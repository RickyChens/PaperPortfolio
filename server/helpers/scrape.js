const { spawn } = require('child_process');
const path = require('path');

let currentPythonProcess = null;

const updateJSON = (stock, isCrypto) => {
    const scriptPath = path.resolve(__dirname, '../../webscraping/lookingatpage.py');
    const killPath = path.resolve(__dirname, '../../webscraping/KILL.py');
    console.log(stock)
    console.log(isCrypto)

    if (currentPythonProcess) {
        console.log('Terminating previous process');
        currentPythonProcess.kill('SIGKILL');
        startNewProcess(stock, isCrypto, killPath);


        
        currentPythonProcess.on('close', () => {
            console.log('Previous process terminated');
            console.log(stock)
            startNewProcess(stock, isCrypto, scriptPath);
        });
        /*
        setTimeout(() => {
            if (currentPythonProcess) {
                console.log('Forcefully killing unresponsive process');
                currentPythonProcess.kill('SIGKILL');
                startNewProcess(stock, isCrypto, scriptPath);
            }
        }, 5000);
        */
    } else {
        startNewProcess(stock, isCrypto, scriptPath);
    }
}

const startNewProcess = (stock, isCrypto, scriptPath) => {
    currentPythonProcess = spawn('python', [scriptPath, stock, isCrypto]);

};

updateJSON("TSLA", "Stock")

module.exports = {
    updateJSON
}