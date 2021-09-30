const express = require('express');
const router = express.Router();
const {roles, RoleModel} = require('../../models/roleModel');
const UserModel = require('../../models/userModel');
const user = require('../middleware/user');

router.get('/uncoupled',
    async (req, res, next) => {
        const facility_manager = await UserModel.findById(req.user._id);
        if(facility_manager != null){
            let organisationId = facility_manager.organisationId;
            const caregiver_role = await RoleModel.findOne({ name: roles.caregiver });
            const needy_user_role = await RoleModel.findOne({ name: roles.needy_user });
            const caregivers = await UserModel.find({"organisationId": organisationId, "roles": [caregiver_role]});
            const needy_users = await UserModel.find({"organisationId": organisationId, "roles": [needy_user_role]});
    
            let uncoupledNeedyUsers = [];
            let caregiverNeedyUsers = [];
            for(let i = 0; i < caregivers.length; i++){
                const caregiver = await UserModel.findById(caregivers[i]._id);
                for(let j = 0; j < caregiver.needy_users.length; j++){
                    const needy_user = await UserModel.findById(caregiver.needy_users[j]._id);
                    caregiverNeedyUsers.push(needy_user)
                }
            }
            for(let u = 0; u < needy_users.length; u++){  
                if(caregiverNeedyUsers.some(e => e._id.equals(needy_users[u]._id))){
                }
                else{
                    uncoupledNeedyUsers.push(needy_users[u]);
                }
            }
            return res.json({uncoupledNeedyUsers});
        }
        return res.status(404).json({ error: 'Facility manager not found' });
    }
);

router.post('/', user.can('access profile'),
    async (req, res, next) => {
        let caregiver = await UserModel.findById(req.user._id).exec();
        let needy_user = await RoleModel.findOne({ name: roles.needy_user }).exec();
        let needyUser = null
        try{
            needyUser = await UserModel.create({ 
                firstname: req.body.user.firstname,
                lastname: req.body.user.lastname,
                birthday: req.body.user.birthday,
                phone: req.body.user.phone,
                email: req.body.user.email, 
                password: req.body.user.password,  
                organisationId: req.user.organisation,
                needy_users: [],
                guardians: [],
                notifications: req.body.user.notifications,
                roles:[needy_user],
            });
            caregiver.needy_users.push(needyUser);
            await caregiver.save();
        } catch(error) {
            return res.status(500).json({error});
        }
        if(needyUser != null){
            return res.json({ needyUser, message: 'Needy user has succesfully been created' });
        }
        return res.status(500).json({ error: 'Something went wrong' });
    }
);

router.put('/:id', user.can('access profile'),
    async (req, res, next) => {
        const needyUser = await UserModel.findById(req.params.id).exec();
        if(needyUser != null){
            needyUser.firstname = req.body.user.firstname;
            needyUser.lastname = req.body.user.lastname;
            needyUser.birthday = req.body.user.birthday;
            needyUser.phone = req.body.user.phone;
            needyUser.email = req.body.user.email;
            needyUser.notifications = req.body.user.notifications;
            if(req.body.user.password != undefined){
                needyUser.password = req.body.user.password;
            }

            await needyUser.save();
            return res.json({needyUser, message: 'Needy user has been updated'});
        }
        return res.status(404).json({ error: 'Needy user not found' });
    }
);

router.get('/:id/guardians',
    async (req, res, next) => {
        const needy_user = await UserModel.findById(req.params.id).exec();
        if(needy_user != null){
            const user_guardians = needy_user.guardians;
            let guardians = [];
            for(let i = 0; i < user_guardians.length; i++){
                const guardian = await UserModel.findById(user_guardians[i]._id).exec();
                if(guardian != null){
                    guardians.push(guardian);
                }
            }
            return res.json({guardians});
        }
        return res.status(404).json({ error: 'Needy user not found' });
    }
);

router.post('/connect',
    async (req, res, next) => {
        const facility_manager = await UserModel.findById(req.user._id);

        console.log(req.body);
        if(facility_manager != null){
            const caregiver = await UserModel.findById(req.body.caregiver[0]);
            const needy_user = await UserModel.findById(req.body.needyUser);
            if(caregiver != null && needy_user != null){
                caregiver.needy_users.push(needy_user);
                await caregiver.save();
                return res.json({message: 'Needy user has succesfully been connected to a caregiver'});
            }
            else{
                return res.status(500).json({ error: 'Something went wrong' });
            }
        }
        return res.status(404).json({ error: 'Needy user not found' });
    }
);

module.exports = router;