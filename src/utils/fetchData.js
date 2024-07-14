const R = require('ramda');
const axios = require('axios');
const Buffer = require('buffer').Buffer;

const palPort = process.env.REST_PORT || 8212;
const palIp = process.env.PAL_IP || 'localhost'
const credentials = Buffer.from(`${process.env.PAL_USER || 'admin'}:${process.env.PAL_PWD || ''}`).toString('base64');

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

module.exports = { fetchData, config, bodyConf, postPalyer }