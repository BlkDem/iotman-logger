const { log } = require('console');
const mqtt = require('mqtt')
const mysql = require('mysql');
// const connection = require('./mysql_db')

const topic = '#'

const host = 'ice9.umolab.ru'
const port = '9883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `wss://${host}:${port}`

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: '',
    password: '',
    reconnectPeriod: 1000,
})

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'iotman'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);

});


client.on('connect', () => {
    console.log('Connected as ', clientId)
    client.subscribe([topic], () => {

        // console.log(`Subscribe to topic '${topic}'`)

    })
})

function logInsert(logData) {

        const {log_level, log_category, log_instance, log_data} = logData;
      
        console.log('Log Items', log_level, log_category, log_instance, log_data);

        const newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const insertQuery = 
            `INSERT INTO iotman.loggers (log_level, log_category, log_instance, log_data, created_at, updated_at) 
            VALUES ('${log_level}', '${log_category}', '${log_instance}', '${log_data}', '${newDate}', '${newDate}')
            `;

        connection.query(insertQuery, function (error, results, fields) {
                if (error) throw error;
                console.log('Inserted log: ', results);
            })
      
};

client.on('message', (topic, payload) => {

    const msgNodes = topic.split('/');

    if(msgNodes.length < 3) {
        return;
    }

    const idx = msgNodes[1]
    const field = msgNodes[2]
    const fieldExt = () => {
        let _accum = '';
        for (let a = 2; a<msgNodes.length; a++) {
            _accum += '/' + msgNodes[a];
            // console.log(_accum)
        }
        return _accum;
    }

    const fields = fieldExt();
    // console.log('Received Message:', idx, fieldExt(), payload.toString())

    const dataObject = {}

    dataObject['idx'] = idx;
    dataObject['fieldExt'] = fields;
    dataObject['payload'] = payload.toString();

    const dataItems = {
        log_level: 0,
        log_category: 'MQTT Data',
        log_instance: idx,
        log_data: JSON.stringify(dataObject)
    }

    logInsert(dataItems);

})