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
        const response = await axios.get(config);

        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
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
app.get('/', async (req, res) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));
        let players = fetchData(config('get', '/players'));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            palyers: players || [{ name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 }]
        });
    }
    catch (err) {
        next(err)
    }
});

app.post('/announce', async (req, res) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));

        let { announcement } = req.body;
        let response = await fetchData(bodyConf('post', 'announce', announcement));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            announcement: { msg: announcement, response }
        });
    }
    catch (err) {
        next(err)
    }
});

app.post('/kick', async (req, res) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let { userId, mesage } = req.body;
        let playerKick = await fetchData(postPalyer('/kick', userId, mesage));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            kick: { response: playerKick, palyer: players.map(p => p.userId === userId) }
        });
    }
    catch (err) {
        next(err)
    }
});

app.post('/ban', async (req, res) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let { userId, mesage } = req.body;
        let playerBan = await fetchData(postPalyer('/ban', userId, mesage));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            ban: { response: playerBan, palyer: players.map(p => p.userId === userId) }
        });
    }
    catch (err) {
        next(err)
    }
});

app.post('/unban', async (req, res) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let { userId, mesage } = req.body;
        let playerUnban = await fetchData(postPalyer('/unban', userId, mesage));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            unban: { response: playerUnban, palyer: players.map(p => p.userId === userId) }
        });
    }
    catch (err) {
        next(err)
    }
});

app.get('/save', async (req, res) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let serverSave = await fetchData(config('post', '/save'));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            palyers: players || [{ name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 }],
            save: serverSave
        });
    }
    catch (err) {
        next(err)
    }
});

app.get('/shutdown', async (req, res) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));
        let players = fetchData(config('get', '/players'));

        let { waittime, message } = req.body;
        let serverShutdown = await fetchData(bodyConf('post', '/shutdown', { waittime, message }));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            palyers: players || [{ name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 }],
            stop: { response: serverShutdown, data: { waittime, message } }
        });
    }
    catch (err) {
        next(err)
    }
});

app.get('/stop', async (req, res) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));
        let players = fetchData(config('get', '/players'));

        let crash = await fetchData(config('post', '/stop'));

        res.render('actionPage', {
            info: info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' },
            metrics: metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 },
            palyers: players || [{ name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 }],
            stop: crash
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
app.listen(process.env.WEB_PORT, () => {
    console.log(`server hosting at [http://localhost:${process.env.WEB_PORT}]`)
});