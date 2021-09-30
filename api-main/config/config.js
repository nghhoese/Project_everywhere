const firebase_admin = require("firebase-admin");
const serviceAccount = require("./firebase-keys.json");

firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
});

module.exports = {
    port: process.env.PORT || 5000,
    jwt_key: process.env.JWT_KEY || 'emptywillcrashpipeline',
    mongo_address: process.env.MONGO_ADDRESS || "localhost",
    mongo_port: process.env.MONGO_PORT || 27017,
    mongo_database: process.env.MONGO_DATABASE || 'project_everyware',
    firebase_admin
}
