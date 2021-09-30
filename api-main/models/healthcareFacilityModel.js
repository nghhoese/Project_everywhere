const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HealthcareFacilitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    kvkNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    establishment: {
        type: String,
        required: false,
    },
    locationName: {
        type: String,
        required: false,
    },
    postalCode: {
        type: String,
        required: false,
    },
    houseNumber: {
        type: String,
        required: false,
    },
    place: {
        type: String,
        required: false,
    },
});

const healthcareFacilityModel = mongoose.model('healthcareFacility', HealthcareFacilitySchema);

module.exports = healthcareFacilityModel;