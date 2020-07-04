var mqtt = require('mqtt')

var MqttClientId = "MQTT_CLIENT_" + new Date().getTime();
/**
 * options:
 *  - clientId
 *  - username
 *  - password
 *  - keepalive: number
 *  - clean:
 *  - will: 
 */
var mqtt_options = {
    clientId: MqttClientId,
    keepalive: 30,
    clean: false
};



var client  = mqtt.connect(process.env.MQTT_IP_WS,mqtt_options)

console.log(process.env.MQTT_IP_WS);
client.on('connect', function () {
    console.log("Connected: MQTT ");
 })
client.on("error", function (error) {
    console.log("ERROR: ", error);
});
client.on('offline', function () {
    console.log("offline");
});
client.on('reconnect', function () {
    console.log("reconnect");
});


function mqtt_publish(topic, message, options) {
    client.publish(topic, message, { qos: (options.qos) ? options.qos : 0 },(err,res) => {

    })
}


function mqtt_subscribe(topic, options) {
    client.subscribe(topic, { qos: (options.qos) ? options.qos : 0 });
}


client.on('message', (topic, message) => {
    switch (topic) {
        case 'hrllo2':             
            break;
    
        default:
            break;
    }
})


exports.publish = mqtt_publish
exports.subscribe = mqtt_subscribe