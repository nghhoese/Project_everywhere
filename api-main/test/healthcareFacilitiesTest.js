require('dotenv').config()
require('../routes/middleware/auth/auth');

const request = require('supertest');
const expect = require('chai').expect;
const should = require('chai').should();

const passport = require('passport');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const HealthcareFacilityModel = require('../models/healthcareFacilityModel')
const users = require('../routes/users/users');
app.use('/users', users);
const healthcareFacilities = require('../routes/healthcareFacilities');
app.use('/healthcarefacilities', passport.authenticate('jwt', { session: false }), healthcareFacilities);

describe('Testing get healthcare facility route', function(){
    
    describe('Get existing healthcare facility', function(){
        it('Should return healthcare facility', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            HealthcareFacilityModel.findOne({ name: 'Jeroen Bosch'}).exec().then(healthcareFacilities => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).get(`/healthcarefacilities/${healthcareFacilities._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('healthcareFacility');
                        expect(res.body.healthcareFacility.name).to.equal(healthcareFacilities.name);
                        done();
                    });
                });
            });
        });
    });

    describe('Get not existing healthcare facility', function(){
        it('Should return user not found', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            let id = "6075cd585ee9466d0cc60ea8";

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).get(`/healthcarefacilities/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(404);
                    done();
                });
            });

        });
    });

});

describe('Testing get healthcare facilities route', function(){

    describe('Get healthcare facilities', function(){
        it('Should return healthcare facilities', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            request(app).post('/users/login').send({ email, password }).then(res => {
                request(app).get('/healthcarefacilities/').set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.healthcareFacilities).to.length.above(0);
                    done();
                });
            });
        });
    });

});

describe('Testing add healthcare facility route', function(){
    
    describe('Add new healthcare facility', function(){
        it('Should return healthcare facility', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let healthcareFacility = {
                name: 'Unit Test Facility',
                kvkNumber: 88888888,
                establishment: 'Unit Test Ziekenhuis',
                locationName: 'Unit Test Facility Ziekenhuis',
                postalCode: "1378KL",
                houseNumber: '233',
                place: 'Den Bosch',
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/healthcarefacilities/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({data: healthcareFacility}).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('healthcareFacility');
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });

    describe('Add existing healthcare facility', function(){
        it('Should return error', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let healthcareFacility = {
                name: 'Jeroen Bosch',
                kvkNumber: 12345678,
                establishment: 'Ziekenhuis',
                locationName: 'Jeroen Bosch Ziekenhuis',
                postalCode: "1378KL",
                houseNumber: '233',
                place: 'Den Bosch',
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/healthcarefacilities/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({data: healthcareFacility}).then(res => {
                    expect(res.status).to.equal(500);
                    done();
                });
            });
        });
    });

});

describe('Testing update healthcare facility route', function(){
    
    describe('Update healthcare healthcare facility', function(){
        it('Should return healthcare facility and succesfull message', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let healthcareFacility = {
                name: 'Unit Test Facility',
                kvkNumber: 88888888,
                establishment: 'Unit Test Ziekenhuis',
                locationName: 'Unit Test Facility Testen',
                postalCode: "1378KL",
                houseNumber: '233',
                place: 'Den Bosch',
            }

            HealthcareFacilityModel.findOne({ name: 'Unit Test Facility'}).exec().then(healthcareFacilities => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).put(`/healthcarefacilities/${healthcareFacilities._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({data: healthcareFacility}).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('healthcareFacility');
                        expect(res.body).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Update not existing healthcare facility', function(){
        it('Should return error', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            let id = "6075dbf736001a63bc243781";

            let healthcareFacility = {
                name: 'Unit Test Facility',
                kvkNumber: 88888888,
                establishment: 'Unit Test Ziekenhuis',
                locationName: 'Unit Test Facility Testen',
                postalCode: "1378KL",
                houseNumber: '233',
                place: 'Den Bosch',
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).put(`/healthcarefacilities/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({data: healthcareFacility}).then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('Healthcare facility not found');
                    done();
                });
            });
        });
    });

});

describe('Testing delete healthcare facility route', function(){
    
    describe('Delete existing healthcare facility', function(){
        it('Should return succesfull message', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            HealthcareFacilityModel.findOne({ name: "Unit Test Facility"}).exec().then(healthcareFacilities => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).delete(`/healthcarefacilities/${healthcareFacilities._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Delete not existing healthcare facility', function(){
        it('Should return error', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            let id = "6075dbf736001a63bc243786";

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).delete(`/healthcarefacilities/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('Healthcare facility not found');
                    done();
                });
            });

        });
    });

});
