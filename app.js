const express = require('express');
const app = express();
const axios = require('axios');
const Buffer = require('buffer').Buffer;
const R = require('ramda');
const path = require('path');
require('dotenv').config()

/* 
    Variables
*/
const palPort = process.env.REST_PORT || 8212;
const palIp = process.env.PAL_IP || 'localhost'
const credentials = Buffer.from(`${process.env.PAL_USER || 'admin'}:${process.env.PAL_PWD || ''}`).toString('base64');
/* 
Functions
*/

const config = R.curry((method, url) => {
    return {
        method: method.toLowerCase(),
        maxBodyLength: Infinity,
        url: `http://${palIp}:${palPort}/v1/api${url}`,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${credentials}`
        }
    }
});

const bodyConf = R.curry((method, url, body) => {
    let conf = config(method)(url);
    conf.data = body;
    return conf;
});

const postPalyer = R.curry((url, message, userid) => {
    let conf = config('post')(url);
    conf.data = {
        userid, message
    }

    return conf;
})

const fetchData = async (config) => {
    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        // console.error('Error fetching data from API:', error);
        throw error;
    }
};

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
app.get('/', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };
        players = players.players || [{ name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 }];

        res.render('index', { info, metrics, players });
    }
    catch (err) {
        next(err)
    }
});

app.post('/announce', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));

        let { announcement } = req.body;
        let response = await fetchData(bodyConf('post', 'announce', announcement));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };
        announcement = { msg: announcement, response };

        res.render('actionPage', { info, metrics, announcement });
    }
    catch (err) {
        next(err)
    }
});

app.post('/kick', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let { userId, mesage } = req.body;
        let playerKick = await fetchData(postPalyer('/kick', userId, mesage));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };
        let player = players ?
            players.players.map(p => p.userId === userId)
            : { name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 };

        res.render('actionPage', { info, metrics, response: playerKick, player, mesage });
    }
    catch (err) {
        next(err)
    }
});

app.post('/ban', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let { userId, mesage } = req.body;
        let playerBan = await fetchData(postPalyer('/ban', userId, mesage));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };
        let player = players ?
            players.players.map(p => p.userId === userId)
            : { name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 };

        res.render('actionPage', { info, metrics, response: playerBan, player });
    }
    catch (err) {
        next(err)
    }
});

app.post('/unban', async (req, res, next) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let { userId, mesage } = req.body;
        let playerUnban = await fetchData(postPalyer('/unban', userId, mesage));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };
        let player = players ?
            players.players.map(p => p.userId === userId)
            : { name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 };

        res.render('actionPage', { info, metrics, response: playerUnban, player });
    }
    catch (err) {
        next(err)
    }
});

app.get('/save', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));

        let serverSave = await fetchData(config('post', '/save'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        res.render('actionPage', { info, metrics, response: serverSave });
    }
    catch (err) {
        next(err)
    }
});

app.get('/shutdown', async (req, res, next) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));

        let { waittime, message } = req.body;
        let serverSave = await fetchData(config('post', '/save'));
        let serverShutdown = await fetchData(bodyConf('post', '/shutdown', { waittime, message }));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        res.render('actionPage', {
            info, metrics,
            response: { serverShutdown, serverSave },
            shuttdown: { waittime, message }
        });
    }
    catch (err) {
        next(err)
    }
});

app.get('/stop', async (req, res, next) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));

        let crash = await fetchData(config('post', '/stop'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        res.render('actionPage', {
            info, metrics,
            response: crash
        });
    }
    catch (err) {
        next(err)
    }
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
    console.log(process.env.PAL_IP)
});