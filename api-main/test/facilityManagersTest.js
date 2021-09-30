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
const UserModel = require('../models/userModel');
const users = require('../routes/users/users');
app.use('/users', users);
const facilityManagers = require('../routes/users/facilitymanagers');
app.use('/facilitymanagers', passport.authenticate('jwt', { session: false }), facilityManagers);

describe('Testing get facility manager route', function(){
    
    describe('Get existing facility manager', function(){
        it('Should return facility manager', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            UserModel.findOne({ email: "facility@mail.com"}).exec().then(facilityManagers => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).get(`/users/${facilityManagers._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('user');
                        expect(res.body.user.email).to.equal(facilityManagers.email);
                        done();
                    });
                });
            });
        });
    });

    describe('Get not existing facility manager', function(){
        it('Should return user not found', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            let id = "6075cd585ee9466d0cc60ea8";

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).get(`/users/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(404);
                    done();
                });
            });

        });
    });

});

describe('Testing add facility manager route', function(){
    
    describe('Add new facility manager', function(){
        it('Should return facility manager', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let facilityManager = {
                email : "unitfacilitymanager@test.com",
                password : "secret",
                firstname : "unitfacilitymanager",
                lastname : "test",
                birthday : "1999-08-12",
                phone : "0698563413",
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/facilitymanagers/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: facilityManager}).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('manager_user');
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });

    describe('Add existing facility manager', function(){
        it('Should return error', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let facilityManager = {
                email : "facility@mail.com",
                password : "secret",
                firstname : "Facility",
                lastname : "Manager",
                birthday : "1981-08-10",
                phone : "0698563412",
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/facilitymanagers/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({data: facilityManager}).then(res => {
                    expect(res.status).to.equal(500);
                    done();
                });
            });
        });
    });

});

describe('Testing update facility manager route', function(){
    
    describe('Update existing facility manager', function(){
        it('Should return facility manager and succesfull message', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let facilityManager = {
                email : "unitfacilitymanager@test.com",
                password : "secret",
                firstname : "unitfacilitymanager",
                lastname : "testen",
                birthday : "1999-08-12",
                phone : "0698563413",
            }

            UserModel.findOne({ email: "unitfacilitymanager@test.com"}).exec().then(users => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).put(`/facilitymanagers/${users._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: facilityManager}).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('manager_user');
                        expect(res.body).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Update not existing facility manager', function(){
        it('Should return error', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            let id = "6075dbf736001a63bc243781";

            let facilityManager = {
                email : "unit@test.com",
                password : "secret",
                firstname : "unit",
                lastname : "test",
                birthday : "1999-08-11",
                phone : "0698563413",
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).put(`/facilitymanagers/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: facilityManager}).then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('Facility manager not found');
                    done();
                });
            });
        });
    });

});

describe('Testing delete facility manager route', function(){
    
    describe('Delete existing facility manager', function(){
        it('Should return succesfull message', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            UserModel.findOne({ email: "unitfacilitymanager@test.com"}).exec().then(facilityManagers => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).delete(`/users/${facilityManagers._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Delete not existing facility manager', function(){
        it('Should return error', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            let id = "6075dbf736001a63bc243786";

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).delete(`/users/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('User not found');
                    done();
                });
            });

        });
    });

});