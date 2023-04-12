const mqtt = require('mqtt')
const mysql = require('mysql');

const env = require("dotenv").config();

const config = process.env;

//Connecting to MQTT server

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `wss://${config.host}:${config.port}`

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: config.username,
    password: config.password,
    reconnectPeriod: 1000,
})

//Connecting to MySQL server
const connection = mysql.createConnection({
  host     : config.myHost,
  user     : config.myUser,
  password : config.myPassword,
  database : config.myDatabase
});
 
connection.connect(function(err) {
  
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    
    console.log('connected as id ' + connection.threadId);

});

// onConnect event from MQTT client
client.on('connect', () => {
    
    console.log('Connected as ', config.clientId)

    //Subscribing to defined topic. Default: '#' - all messages
    client.subscribe([config.topic ?? '#'], () => {
        console.log(`Subscribe to topic '${config.topic ?? '#'}'`);
    })
})

//Add a log record routine
function logInsert(logData) {

    try {
        const {log_level, log_category, log_instance, log_data} = logData;
      
        //Current datetime to timestamps fields
        const newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        //DB Inserting query
        const insertQuery = 
            `INSERT INTO ${config.myDatabase}.${config.myTable} 
            (log_level, log_category, log_instance, log_data, created_at, updated_at) 
             VALUES ('${log_level}', '${log_category}', '${log_instance}', '${log_data}', '${newDate}', '${newDate}')
            `;

        //Insert a record to database
        connection.query(insertQuery, function (error, results, fields) {
                if (error) {
                    console.log('Inserting error: ', results);
                }
                console.log('Inserted log: ', results);
        })

    } catch (error) {
        console.log('Inserting log error: ', error);
    }
          
};

//onMessage MQTT client event
client.on('message', (topic, payload) => {

    //Prepare message string to transform
    const msgNodes = topic.split('/');

    //Wrong message - return
    if(msgNodes.length < 3) {
        return;
    }

    // idx - device controller identifier
    const idx = msgNodes[1]

    //fullfield controller parameter. Example: '/preset2/color1'
    const fieldExt = () => {

        let result = '';
        for (let a = 2; a < msgNodes.length; a++) {
            result += '/' + msgNodes[a];
        }
        return result;

    }

    const fields = fieldExt();

    //Prepare Data Object
    const dataObject = {}

    //Fill the Data Object fields
    dataObject['idx'] = idx;
    dataObject['fieldExt'] = fields;
    dataObject['payload'] = payload.toString();

    //Database record struct
    const dataItems = {
        log_level: 0,
        log_category: 'MQTT Data',
        log_instance: idx,
        log_data: JSON.stringify(dataObject)
    }

    //Inserting a log record
    logInsert(dataItems);

})