const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const user = require('../middleware/user');
const {roles, RoleModel} = require('../../models/roleModel');
const UserModel = require('../../models/userModel');
const UserDeviceModel = require('../../models/userDeviceModel');
const healthcareFacilityModel = require('../../models/healthcareFacilityModel');

async function addDevice({ user, device }) {
    return new Promise(async (resolve, reject) => {
        const {devices: loggedin_devices} = await user.populate('devices').execPopulate();
        const exists = loggedin_devices.some(d => d.firebase_token === device.firebase_token);
        
        if (!exists) {
            const device_model = new UserDeviceModel({
                firebase_token: device.firebase_token,
                name: device.name
            });

            await device_model.save();
            user.devices.push(device_model);
            await user.save();
            resolve();
        } else {
            resolve();
        }
    })
}

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user) => {
                try {
                    if (err) return res.status(500).json({ error: 'an error occurred' });
                    if (!user) return res.status(404).json({ error: 'user not found' });

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            if (req.body.from === 'app') await addDevice({ user, device: req.body.device });

                            let needyUsers = [];
                            for (const needy_user of user.needy_users) {
                                const needyUser = await UserModel.findById(needy_user).exec();
                                if(needyUser != null){
                                    needyUsers.push(needyUser);
                                }
                            }

                            const body = { _id: user._id, email: user.email, roles: user.roles, organisation: user.organisationId };
                            const token = jwt.sign({ user: body }, config.jwt_key, { expiresIn: '1d' });

                            user.password = undefined;
                            return res.json({ user, token, needyUsers });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

router.post('/loginByToken',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const user = req.user;
        const body = { _id: user._id, email: user.email, roles: user.roles, organisation: user.organisationId };
        const token = jwt.sign({ user: body }, config.jwt_key, { expiresIn: '1d' });
        res.json({ user, token })
    }
);

router.get('/profile', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const user = await UserModel.findById(req.user._id);
        const facility_manager = await RoleModel.findOne({ name: roles.facility_manager });
        const needy_user_role = await RoleModel.findOne({ name: roles.needy_user });

        if(user != null){
            const organisation = await healthcareFacilityModel.findById(user.organisationId);
            const facilityManager = await UserModel.find({"organisationId": user.organisationId, "roles": [facility_manager]});
            let needyUsers = [];
            if(req.user.roles[0].name == "guardian"){
                const needy_users = await UserModel.find({"organisationId": user.organisationId, "roles": [needy_user_role]});
                for(let i = 0; i < needy_users.length; i++){
                    const guardians = needy_users[i].guardians;
                    if(guardians.length > 0){
                        for(let j = 0; j < guardians.length; j++){
                            if(guardians[j].equals(user._id)){
                                needyUsers.push(needy_users[i]);
                            }
                        }
                    }
                }
            }
            else{
                for(let i = 0; i < user.needy_users.length; i++){
                    const needy_user = await UserModel.findById(user.needy_users[i]);
                    if(needy_user != null){
                        needyUsers.push(needy_user);
                    }
                }
            }
            return res.json({user: user, organisation: organisation, needy_users: needyUsers, facility_manager: facilityManager});
        }
        return res.status(404).json({ error: 'User not found' });
    }
);

router.get(
    '/count',
    passport.authenticate('jwt', { session: false }), user.can('access healthcare facility'),
    async (req, res, next) => {
        const user = await UserModel.findById(req.user._id)
        if(user != null){
            const facility_manager_role = await RoleModel.findOne({ name: roles.facility_manager });
            const caregiver_role = await RoleModel.findOne({ name: roles.caregiver });
            const guardian_role = await RoleModel.findOne({ name: roles.guardian });
            const needy_user_role = await RoleModel.findOne({ name: roles.needy_user });
    
            const facilityManagers = await UserModel.find({"roles": [facility_manager_role]});
            const caregivers = await UserModel.find({"roles": [caregiver_role]});
            const guardians = await UserModel.find({"roles" : [guardian_role]});
            const needyUsers = await UserModel.find({"roles" : [needy_user_role]});
    
            return res.json({facility_managers: facilityManagers.length, caregivers: caregivers.length, guardians: guardians.length, needy_users: needyUsers.length});
        }
        return res.status(404).json({ error: 'User not found' });
    }
);

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        let users = await UserModel.find({}).exec()

        if(users != null) {
            // filter based on ?name=
            if (req.query.name) {
                users = users.filter(user => {
                    return (user.username.toLowerCase().includes(req.query.name.toString()))
                });
            }

            // filter based on ?role=
            if (req.query.role) {
                users = users.filter(user => {
                    return (user.roles[0].name.toString() === req.query.role.toString())
                })
            }

            return res.json({users});
        }
        else
        {
            return res.status(404).json({message: "Users not found"});
        }
    }
);

router.get('/:id',
    async (req, res, next) => {
        
        const user = await UserModel.findById(req.params.id).exec();
        if(user){
            return res.json({user});
        }
        return res.status(404).json({ error: 'User not found' });
    }
);

router.delete('/:id',
    async (req, res, next) => {
        
        const user = await UserModel.findById(req.params.id).exec();
        if(user != null){
            await user.remove();
            return res.json({message: 'User has been deleted'});
        }
        return res.status(404).json({ error: 'User not found' });
    }
);

module.exports = router;