const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const user = require('./middleware/user');
const HealthcareFacilityModel = require('../models/healthcareFacilityModel');
const UserModel = require('../models/userModel');
const {RoleModel} = require("../models/roleModel");
const {roles} = require("../models/roleModel");

router.get('/:id', user.can('access healthcare facility'), 
    async function(req, res, next) {
        const healthcareFacility = await HealthcareFacilityModel.findById(req.params.id).exec();
        if(healthcareFacility){
            return res.json({healthcareFacility});
        }
        return res.status(404).json({ error: 'Healthcare facility not found' });
    }
);

router.get('/', user.can('access healthcare facility'), 
    async function(req, res, next) {
        let healthcareFacilities = await HealthcareFacilityModel.find({}).exec()

        if(healthcareFacilities != null) {
            return res.json({healthcareFacilities});
        }
        else
        {
            return res.status(404).json({message: "Healthcare facilities not found"});
        }
    }
);

router.post('/', user.can('access healthcare facility'), 
    async function(req, res, next) {
        let healthcareFacility = null
        try{
            healthcareFacility = await HealthcareFacilityModel.create({
                name: req.body.data.name,
                kvkNumber: req.body.data.kvkNumber,
                establishment: req.body.data.establishment,
                locationName: req.body.data.locationName,
                postalCode: req.body.data.postalCode,
                houseNumber: req.body.data.houseNumber,
                place: req.body.data.place,
            });
        } catch(error) {
            return res.status(500).json({error});
        }

        if(healthcareFacility != null){
            return res.json({ healthcareFacility, message: 'Healthcare facility has succesfully been created' });
        }
        return res.status(500).json({ error: 'Something went wrong' });
    }
);

router.put('/:id', user.can('access healthcare facility'), 
    async function(req, res, next) {
        const healthcareFacility = await HealthcareFacilityModel.findById(req.params.id).exec();

        if(healthcareFacility != null){
            healthcareFacility.name = req.body.data.name;
            healthcareFacility.kvkNumber = req.body.data.kvkNumber;
            healthcareFacility.establishment = req.body.data.establishment;
            healthcareFacility.locationName = req.body.data.locationName;
            healthcareFacility.postalCode = req.body.data.postalCode;
            healthcareFacility.houseNumber = req.body.data.houseNumber;
            healthcareFacility.place = req.body.data.place;

            await healthcareFacility.save();
            return res.json({healthcareFacility, message: 'Healthcare facility has been updated'});
        }
        return res.status(404).json({ error: 'Healthcare facility not found' });
    }
);

router.delete('/:id', user.can('access healthcare facility'), 
    async function(req, res, next) {
        const healthcareFacility = await HealthcareFacilityModel.findById(req.params.id).exec();
        let caregiverRole = await RoleModel.findOne({ name: roles.caregiver }).exec();
        if(healthcareFacility != null){
            let caregivers = await UserModel.find({ roles: caregiverRole, organisationId: healthcareFacility._id}).exec();
            if(caregivers.length > 0) {
                for(const caregiver of caregivers) {
                    for(const needyUserId of caregiver.needy_users) {
                        await UserModel.deleteMany({_id: needyUserId}).exec();
                    }
                }
            }
            await UserModel.deleteMany({organisationId: healthcareFacility._id}).exec();
            await healthcareFacility.remove();
            return res.json({message: 'Healthcare facility has been deleted'});
        }
        return res.status(404).json({ error: 'Healthcare facility not found' });
    }
);

module.exports = router;