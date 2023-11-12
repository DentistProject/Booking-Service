const mqttHandler = require('./mqtt_handler');
const mqttClient = new mqttHandler();
mqttClient.connect();

module.exports = mqttClient;