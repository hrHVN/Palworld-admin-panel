const sshClient = require('ssh2').Client;
const R = require('ramda');

let { SSH_USER, SSH_PWD, PAL_IP} = process.env;
console.log(SSH_USER, SSH_PWD, PAL_IP)

const sshConfig = {
        host: `192.168.1.27`, 
        port: 22, 
        username: `${SSH_USER}`, 
        password: `${SSH_PWD}`
    }; 


module.export = { sshConfig }