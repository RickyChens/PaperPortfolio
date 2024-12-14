const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const cookieParser = require('cookie-parser')
const { spawn } = require('child_process');


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database Connected'))
.catch(() => console.log('Database Not Connected', err))

const app = express();

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/authRoutes'))

//function to run the top10.js script maybe?
const runTop10Script = () => {
    const scriptPath = './helpers/top10.js'; //path incase it changes
    const process = spawn('node', [scriptPath]);

    process.stdout.on('data', (data) => {
        console.log(`[top10.js] ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[top10.js ERROR] ${data}`);
    });

    process.on('close', (code) => {
        console.log(`[top10.js] Process exited with code ${code}`);
    });
};

const port = 8000;
app.listen(port, () => {
    console.log('Server is running on port ' + port);

    //run the script at server startup maybe
    runTop10Script();
});