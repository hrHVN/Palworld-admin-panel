const router = require('express').Router();
const R = require('ramda');
const { fetchData, config, bodyConf } = require('../utils/fetchData.js');

router.get('/settings', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let settings = await fetchData(config('get', '/settings'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        console.info('GET /settings: [info, metrics, settings]', info, metrics, settings);

        res.render('settings', { info, metrics, settings });
    }
    catch (err) {
        next(err)
    }
});

router.post('/announce', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));

        let { announcement } = req.body;
        let response = await fetchData(bodyConf('post', 'announce', announcement));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        console.info('POST /announce: [info, metrics, players]', info, metrics, players, announcement, response);

        res.render('actionPage', { info, metrics, mesage: announcement, response, player: false });
    }
    catch (err) {
        next(err)
    }
});

router.get('/save', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));

        let serverSave = await fetchData(config('post', '/save'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        console.info('GET /save: [info, metrics, response]', info, metrics, serverSave);

        res.render('actionPage', { info, metrics, response: serverSave, player: false });
    }
    catch (err) {
        next(err)
    }
});

router.get('/shutdown', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));

        let { waittime, message } = req.body;
        // Default values used during development
        waittime = waittime || "30";
        message = message || "30 seconds to shutdown";

        // save world then initiate shutdown sequence
        let serverSave = await fetchData(config('post', '/save'));
        let serverShutdown = await fetchData(bodyConf('post', '/shutdown', { waittime, message }));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        // Log server responses and input to console 
        console.info('GET /shutdown: [info, metrics, response]', info, metrics, serverSave, serverShutdown);

        res.render('actionPage', {
            info, metrics,
            response: { serverShutdown, serverSave },
            shuttdown: { waittime, message },
            player: false
        });
    }
    catch (err) {
        next(err)
    }
});

router.get('/stop', async (req, res, next) => {
    try {
        let info = fetchData(config('get', '/info'));
        let metrics = fetchData(config('get', '/metrics'));

        let crash = await fetchData(config('post', '/stop'));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };

        console.info('GET /stop: [info, metrics, response]', info, metrics, crash);

        res.render('actionPage', { info, metrics, response: crash, player: false });
    }
    catch (err) {
        next(err)
    }
});

module.exports = router;