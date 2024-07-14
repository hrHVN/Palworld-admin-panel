const router = require('express').Router();
const R = require('ramda');
const { fetchData, config, bodyConf } = require('../utils/fetchData.js');


router.post('/kick', async (req, res, next) => {
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

        console.info('POST /player/kick: [info, metrics, players]', info, metrics, player, announcement, response, userId, mesage);

        res.render('actionPage', { info, metrics, response: playerKick, player, mesage });
    }
    catch (err) {
        next(err)
    }
});

router.post('/ban', async (req, res, next) => {
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

        console.info('POST /player/ban: [info, metrics, players]', info, metrics, player, announcement, response, userId, mesage);

        res.render('actionPage', { info, metrics, response: playerBan, player });
    }
    catch (err) {
        next(err)
    }
});

router.post('/unban', async (req, res, next) => {
    try {
        let info = await fetchData(config('get', '/info'));
        let metrics = await fetchData(config('get', '/metrics'));
        let players = await fetchData(config('get', '/players'));

        let { userId, mesage } = req.body;
        let playerUnban = await fetchData(postPalyer('/unban', userId, mesage));

        info = info || { version: 'x.x.x.yy', servername: 'Default Palworld Server', description: 'Palworld Server' };
        metrics = metrics || { serverfps: 0, currentplayernum: 0, serverframetime: 0, maxplayernum: 32, uptime: 0 };
        let player = players ?
            players.players.map(p => p.userId === userId)
            : { name: 'Demo', accountName: 'Demo', playerId: 'demo_000', userId: '0000', ip: 'x.x.x.x', ping: 0, location_x: 0, location_y: 0, level: 0 };

        console.info('POST /player/unban: [info, metrics, players]', info, metrics, player, announcement, response, userId, mesage);

        res.render('actionPage', { info, metrics, response: playerUnban, player });
    }
    catch (err) {
        next(err)
    }
});


module.exports = router;
