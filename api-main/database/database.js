const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(`mongodb://${config.mongo_address}:${config.mongo_port}/${config.mongo_database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

module.exports = mongoose;