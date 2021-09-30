const express = require('express');
const router = express.Router();
const {roles, RoleModel} = require('../../models/roleModel');
const UserModel = require('../../models/userModel');
const user = require('../middleware/user');

router.post('/', user.can('access caregivers'),
    async (req, res, next) => {
        let caregiver = await RoleModel.findOne({ name: roles.caregiver }).exec();

        let caregiver_user = null
        try{
            caregiver_user = await UserModel.create({ 
                firstname: req.body.user.firstname,
                lastname: req.body.user.lastname,
                birthday: req.body.user.birthday,
                phone: req.body.user.phone,
                email: req.body.user.email, 
                password: req.body.user.password, 
                organisationId: req.user.organisation, 
                notifications: req.body.user.notifications,
                roles:[caregiver],
            });
        } catch(error) {
            return res.status(500).json({error});
        }
        if(caregiver_user != null){
            return res.json({ caregiver_user, message: 'Caregiver has succesfully been created' });
        }
        return res.status(500).json({ error: 'Something went wrong' });
    }
);

router.put('/:id', user.can('access caregivers'),
    async (req, res, next) => {
        
        const caregiver_user = await UserModel.findById(req.params.id).exec();
        if(caregiver_user != null){
            caregiver_user.firstname = req.body.user.firstname;
            caregiver_user.lastname = req.body.user.lastname;
            caregiver_user.birthday = req.body.user.birthday;
            caregiver_user.phone = req.body.user.phone;
            caregiver_user.email = req.body.user.email;
            caregiver_user.notifications = req.body.user.notifications;
            if(req.body.user.password != undefined){
                caregiver_user.password = req.body.user.password;
            }

            await caregiver_user.save();
            return res.json({caregiver_user, message: 'Caregiver has been updated'});
        }
        return res.status(404).json({ error: 'Caregiver not found' });
    }
);

router.get('/needyusers',
    async (req, res, next) => {
        const caregiver = await UserModel.findById(req.user._id).exec();

        if(caregiver != null){
            const caregiverNeedyUsers = caregiver.needy_users;
            const needy_users = [];
            for(let i = 0; i < caregiverNeedyUsers.length; i++){
                const needy_user = await UserModel.findById(caregiverNeedyUsers[i]).exec();
                if(needy_user != null){
                    needy_users.push(needy_user);
                }
            }
            return res.json({needy_users});
        }
        return res.status(404).json({ error: 'Caregiver not found' });
    }
);

router.get('/guardians',
    async (req, res, next) => {
        const caregiver = await UserModel.findById(req.user._id).exec();
        if(caregiver != null){
            const caregiverNeedyUsers = caregiver.needy_users;
            const needy_users = [];
            for(let i = 0; i < caregiverNeedyUsers.length; i++){
                const needy_user = await UserModel.findById(caregiverNeedyUsers[i]).exec();
                if(needy_user != null){
                    needy_users.push(needy_user);
                }
            }
            const guardians = [];
            if(needy_users.length > 0){
                for(let j = 0; j < needy_users.length; j++){
                    const user_guardians = needy_users[j].guardians;
                    if(user_guardians.length > 0){
                        for(let g = 0; g < user_guardians.length; g++){
                            const guardian = await UserModel.findById(user_guardians[g]).exec();
                            if(guardian != null){
                                guardians.push(guardian);
                            }
                        }
                    }
                }
            }
            return res.json({guardians});
        }
        return res.status(404).json({ error: 'Caregiver not found' });
    }
);

router.get('/',
    async (req, res, next) => {
        const facility_manager = await UserModel.findById(req.user._id).exec();
        if(facility_manager != null){
            const caregiver_role = await RoleModel.findOne({ name: roles.caregiver });
            const users = await UserModel.find({"organisationId": facility_manager.organisationId, "roles": [caregiver_role]});

            return res.json({users});
        }
        return res.status(404).json({ error: 'Facility manager not found' });
    }
);

module.exports = router;