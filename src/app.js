const express = require('express');
const app = express();
const path = require('path');
const createError = require('http-errors');
require('dotenv').config();

/* 
    Variables
*/

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
app.use('/map', require('./routes/map'));

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
    res.render('error', { info:{servername: 'Palworld Admin Panel'},title: 'error', err });
});

/* 
    Server Listener
*/
app.listen(process.env.WEB_PORT || 3000, () => {
    console.log(`server hosting at [http://localhost:${process.env.WEB_PORT || 3000}]`);
    console.log(`Palworld server located @${process.env.PAL_IP}:${process.env.REST_PORT}`)
});