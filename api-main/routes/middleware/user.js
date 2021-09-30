const ConnectRoles = require('connect-roles');
const { roles } = require('../../models/roleModel');

const user = new ConnectRoles({
    failureHandler: (req, res, action) => {
        // optional function to customise code that runs when
        // user fails authorisation
        res.status(403).json({ error: "forbidden" })
    }
});

user.use('access profile', (req) => {
   // console.log('access profile', req.user);
    if (req.user.roles.some(role => role.name === roles.caregiver)) {
        return true;
    } else {
        return { message: "Unauthorized!" };
    }
});

user.use('access healthcare facility', (req) => {
    if (req.user.roles.some(role => role.name === roles.admin)) {
        return true;
    } else {
        return { message: "Unauthorized!" };
    }
});

user.use('access caregivers', (req) => {
    if (req.user.roles.some(role => role.name === roles.facility_manager)) {
        return true;
    } else {
        return { message: "Unauthorized!" };
    }
});

module.exports = user;