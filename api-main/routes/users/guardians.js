const express = require('express');
const router = express.Router();
const {roles, RoleModel} = require('../../models/roleModel');
const UserModel = require('../../models/userModel');
const user = require('../middleware/user');

router.post('/', user.can('access profile'),
    async (req, res, next) => {
        let guardian = await RoleModel.findOne({ name: roles.guardian }).exec();
        let guardian_user = null
        const needy_users = req.body.needy_users;
        try{
            guardian_user = await UserModel.create({ 
                firstname: req.body.user.firstname,
                lastname: req.body.user.lastname,
                birthday: req.body.user.birthday,
                phone: req.body.user.phone,
                email: req.body.user.email, 
                password: req.body.user.password,  
                organisationId: req.user.organisation,
                notifications: req.body.user.notifications,
                roles:[guardian],
            });
            if(needy_users != null){
                for(let i = 0; i < needy_users.length; i++){
                    const needyUser = await UserModel.findById(needy_users[i]).exec();
                    needyUser.guardians.push(guardian_user);
                    await needyUser.save();
                }
            }
        } catch(error) {
            return res.status(500).json({error});
        }
        
        if(guardian_user != null){
            return res.json({ guardian_user, message: 'Guardian has succesfully been created' });
        }
        return res.status(500).json({ error: 'Something went wrong' });
    }
);

router.put('/:id', user.can('access profile'),
    async (req, res, next) => {
        const guardian_user = await UserModel.findById(req.params.id).exec();
        const needy_users = req.body.needy_users;
        console.log(needy_users);
        if(guardian_user != null){
            guardian_user.firstname = req.body.user.firstname;
            guardian_user.lastname = req.body.user.lastname;
            guardian_user.birthday = req.body.user.birthday;
            guardian_user.phone = req.body.user.phone;
            guardian_user.email = req.body.user.email;
            guardian_user.notifications = req.body.user.notifications;
            if(req.body.user.password != undefined){
                guardian_user.password = req.body.user.password;
            }
            await guardian_user.save();

            const users =  await UserModel.find({"guardians": guardian_user});
            for(let i = 0; i < users.length; i++){
                users[i].guardians.pull(guardian_user);
                await users[i].save();
            }

            if(needy_users != null){
                for(let i = 0; i < needy_users.length; i++){
                    const needyUser = await UserModel.findById(needy_users[i]).exec();
                    needyUser.guardians.push(guardian_user);
                    await needyUser.save();
                }
            }
            return res.json({guardian_user, message: 'Guardian has been updated'});
        }
        return res.status(404).json({ error: 'Guardian not found' });
    }
);


router.get('/needyusers',
    async (req, res, next) => {
        const guardian = await UserModel.findById(req.user._id).exec();
        const needy_user = await RoleModel.findOne({ name: roles.needy_user }).exec();
        let needyUsers = [];

        if(guardian != null){
            const needy_users = await UserModel.find({"organisationId": guardian.organisationId, "roles": [needy_user]});
            if(needy_users.length > 0){
                for(let i = 0; i < needy_users.length; i++){
                    const guardians = needy_users[i].guardians;
                    if(guardians.length > 0){
                        for(let j = 0; j < guardians.length; j++){
                            if(guardians[j].equals(guardian._id)){
                                needyUsers.push(needy_users[i]);
                            }
                        }
                    }
                }
                return res.json({needyUsers});
            }
            return res.status(404).json({ error: 'Guardian does not have any needy users' });
        }
        return res.status(404).json({ error: 'Guardian not found' });
    }
);

module.exports = router;