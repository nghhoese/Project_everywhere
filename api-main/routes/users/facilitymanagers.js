const express = require('express');
const router = express.Router();
const {roles, RoleModel} = require('../../models/roleModel');
const UserModel = require('../../models/userModel');
const user = require('../middleware/user');

router.post('/', user.can('access healthcare facility'),
    async (req, res, next) => {
        let facilityManager = await RoleModel.findOne({ name: roles.facility_manager }).exec();

        let manager_user = null
        try{
            manager_user = await UserModel.create({
                firstname: req.body.user.firstname,
                lastname: req.body.user.lastname,
                birthday: req.body.user.birthday,
                phone: req.body.user.phone,
                email: req.body.user.email, 
                password: req.body.user.password,
                organisationId: req.body.user.organisationId,
                roles:[facilityManager],
            });
        } catch(error) {
            return res.status(500).json({error});
        }
        
        if(manager_user != null){
            return res.json({ manager_user, message: 'Facility manager has successfully been created' });
        }
        return res.status(500).json({ error: 'Something went wrong' });
    }
);

router.put('/:id', user.can('access healthcare facility'),
    async (req, res, next) => {
        
        const manager_user = await UserModel.findById(req.params.id).exec();
        if(manager_user != null){
            manager_user.firstname = req.body.user.firstname;
            manager_user.lastname = req.body.user.lastname;
            manager_user.birthday = req.body.user.birthday;
            manager_user.phone = req.body.user.phone;
            manager_user.email = req.body.user.email;
            manager_user.organisationId = req.body.user.organisationId;
            if(req.body.user.password != undefined){
                manager_user.password = req.body.user.password;
            }

            await manager_user.save();
            return res.json({manager_user, message: 'Facility manager has been updated'});
        }
        return res.status(404).json({ error: 'Facility manager not found' });
    }
);

module.exports = router;