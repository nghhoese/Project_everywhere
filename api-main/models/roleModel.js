const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const RoleModel = mongoose.model('role', RoleSchema);

module.exports = {
    RoleModel,
    roles: {
        needy_user: "needy_user",
        caregiver: "caregiver",
        facility_manager: "facility_manager",
        guardian: "guardian",
        admin: "admin",
    }
}