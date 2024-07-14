const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config()

/* 
    Variables
*/
const { sshConfig } = require('./utils/sshExecution');
// const sshClient = require('ssh2').Client;

/* 
Functions
*/

/* 
    APP settings
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
    Routes 
 */
app.use('/', require('./routes/index'));
app.use('/player', require('./routes/playerActions'));
app.use('/manage', require('./routes/manageServer'));

app.get('/execute-command', async (req, res, next) => {
    const { Client } = require('ssh2');
    const conn = new Client();

    conn.on('ready', () => {
        console.log('Client :: ready');

        conn.exec('cat /home/palworld/log/palworld_2.log', (err, stream) => {
            if (err) throw err;
            let output = '';

            stream.on('close', (code, signal) => {
                // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
                res.send({ output: output });

            })
                .on('data', (data) => {
                    console.log('STDOUT: ' + data);
                    output += data;
                })
                .stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
        });

    }).connect({
        host: process.env.PAL_IP,
        port: 22,
        username: process.env.SSH_USER,
        password: process.env.SSH_PWD
    });
});


/*
    Error handler
    catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'error', err });
});

/* 
    Server Listener
*/
app.listen(process.env.WEB_PORT || 3000, () => {
    console.log(`server hosting at [http://localhost:${process.env.WEB_PORT || 3000}]`);
    console.log(`Palworld server located @${process.env.PAL_IP}:${process.env.REST_PORT}`)
});