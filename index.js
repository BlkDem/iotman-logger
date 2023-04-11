const mqtt = require('mqtt')

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

const topic = '/18:FE:34:FE:B6:90/#'

client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic], () => {

        console.log(`Subscribe to topic '${topic}'`)

    })
})

client.on('message', (topic, payload) => {
    const msgNodes = topic.split('/');

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

    console.log('Received Message:', idx, fieldExt(), payload.toString())
})