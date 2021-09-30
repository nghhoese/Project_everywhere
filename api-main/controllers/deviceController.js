const { firebase_admin } = require('../config/config');

exports.sendMessage = (device_tokens, message_key, data) => {
    const notification_options = {
        priority: "high",
        timeToLive: 5
    };

    const message = {
        data: {
            message: JSON.stringify(data),
            key: message_key
        },
    }

    device_tokens.forEach(device_token => {
        firebase_admin.messaging().sendToDevice(device_token, message, notification_options)
        .then(response => {
            console.log("Notification sent successfully", response)
        })
        .catch(error => {
            console.log(error);
        });
    })
}