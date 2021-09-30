require('dotenv').config()
const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.set("useCreateIndex", true);

// seed data
const day_items = require('./dayItems_dummy')
const user = require('./users_dummy');

mongoose.connect(`mongodb://${config.mongo_address}:${config.mongo_port}/${config.mongo_database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('database connected');
    mongoose.connection.dropDatabase((err) => {
        console.log('database dropped', err);
        
        Promise.all([day_items(), user()]).then(() => {
            mongoose.connection.close();
            console.log('seed completed')
        });
    });
}).catch(err => {
    console.error(err);
});