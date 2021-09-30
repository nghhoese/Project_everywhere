const mongoose = require('../database/database');
const bcrypt = require('bcrypt');
const RoleModel = require('./roleModel').RoleModel;
const NotificationSchema = require('./notificationModel').NotificationSchema;
const { sendMessage } = require('../controllers/deviceController');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    organisationId: {
        type: String,
        required: false
    },
    needy_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    guardians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    notifications: NotificationSchema,
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_device'
    }],
    roles: [RoleModel.schema],
    dayItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "dayItem"
        }
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

UserSchema.pre(
    'save',
    async function(next) {
        if (!this.isModified('password')) return next();
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);

UserSchema.methods.isValidPassword = async function(password) {
    const compare = await bcrypt.compare(password, this.password);

    return compare;
}

UserSchema.virtual('fullname').get(function() {
    let name = this.firstname + " " + this.lastname;
    return name;
 });

 
async function handleChange() {
    if(!this.getQuery) return;
    const {devices} = await UserModel.findById(this.getQuery()._id).populate('devices');
    const device_tokens = devices.map(d => d.firebase_token);
    sendMessage(device_tokens, 'new_schedule', '');
}

UserSchema.post('update', handleChange);
UserSchema.post('updateOne', handleChange);
UserSchema.post('save', handleChange);

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;