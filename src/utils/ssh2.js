const { Client } = require('ssh2');
const R = require('ramda');

const sshComands = {
    readLog: 'cat /home/palworld/log/palworld.log',
    readErrorLog: 'cat /home/palworld/log/err/palworld.log',
    startServer: `echo ${process.env.SSH_PWD} | sudo -S scripts/start.sh`,
    startCtl: `echo ${process.env.SSH_PWD} | sudo -S systemctl start palworld && systemctl status palworld`,
    stopCtl: `echo ${process.env.SSH_PWD} | sudo -S systemctl stop palworld && systemctl status palworld`,
    updateServer: `echo ${process.env.SSH_PWD} | sudo -S systemctl stop palworld && scripts/updateServer.sh`
}

/**
 * At this point in time ssh2 do not comply with Functional Programing or any fragmentation. 
 * Thus sshOnError and sshExecComand are not usable.  
 * 
 * If anyone know how to fix this issue, pleas have at it! 
 * 
 */
const sshOnError = (conn) => {
    conn.on('error', (err) => {
        console.error('Error connecting to SSH:', err);
        conn.end();
        return reject(err);
    });
}

const sshExecComand = R.curry((conn, command) => {
    conn.exec(command, (err, stream) => {
        if (err) {
            conn.end();
            return reject(err);
        }

        let output = '';

        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
            return resolve(output);
        })
            .on('data', (data) => {
                // console.log('STDOUT: ' + data);
                output += data;
            })
            .stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
    });
});

const sendSshComand = R.curry((command) => {
    const conn = new Client();

    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            console.log('Client :: ready');

            conn.exec(command, (err, stream) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                let output = '';

                stream.on('close', (code, signal) => {
                    conn.end();
                    return resolve(output);
                }).on('data', (data) => {
                    // console.log('STDOUT: ' + data);
                    output += data;
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });

        }).connect({
            host: process.env.PAL_IP,
            port: 22,
            username: process.env.SSH_USER,
            password: process.env.SSH_PWD
        });

        conn.on('error', (err) => {
            console.error('Error connecting to SSH:', err);
            conn.end();
            return reject(err);
        });
    });
});

const sendSFTP = R.curry((localFilePath, remoteFilePath) => {
    const conn = new Client();

    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            console.log('Client :: ready');

            conn.sftp((err, sftp) => {
                if (err) {
                    console.error('Error creating SFTP session:', err);
                    conn.end();
                    return;
                }

                sftp.fastPut(localFilePath, remoteFilePath, (err) => {
                    if (err) {
                        console.error('Error transferring file:', err);
                    } else {
                        console.log('File transferred successfully');
                    }

                    conn.end();
                });
            });

        }).connect({
            host: process.env.PAL_IP,
            port: 22,
            username: process.env.SSH_USER,
            password: process.env.SSH_PWD
        });

        conn.on('error', (err) => {
            console.error('Error connecting to SSH:', err);
            conn.end();
            return reject(err);
        });
    });
});


module.exports = { sshComands, sendSshComand, sendSFTP };