const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemRemovalSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
});

const ItemRemoval = mongoose.model('itemRemoval', ItemRemovalSchema);

module.exports = ItemRemoval;
