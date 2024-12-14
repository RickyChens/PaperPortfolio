const { spawn } = require('child_process');
const path = require('path');

let processes = [];

const runPythonScript = (scriptName) => {
    const scriptPath = path.resolve(__dirname, '../../webscraping', scriptName);

    console.log(`Starting script: ${scriptName}`);
    const process = spawn('python', [scriptPath]);

    process.stdout.on('data', (data) => {
        console.log(`[${scriptName}] Output: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[${scriptName}] Error: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`[${scriptName}] Process exited with code: ${code}`);
    });

    return process;
};

const runScriptsEvery30Minutes = () => {
    //kill any existing processes
    processes.forEach((proc) => proc.kill('SIGKILL'));
    processes = [];

    //start scripts
    processes.push(runPythonScript('top10_futures.py'));
    processes.push(runPythonScript('top10_stocks_cryptos.py'));

    //every 30 mins
    setInterval(() => {
        console.log('Running scheduled scripts...');
        processes.forEach((proc) => proc.kill('SIGKILL')); //kills old processes?
        processes = [];
        processes.push(runPythonScript('top10_futures.py'));
        processes.push(runPythonScript('top10_stocks_cryptos.py'));
    }, 30 * 60 * 1000); //milliseconds :(
};

//start schedule
runScriptsEvery30Minutes();

module.exports = {
    runScriptsEvery30Minutes,
};
