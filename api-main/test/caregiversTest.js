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
const caregivers = require('../routes/users/caregivers');
app.use('/caregivers', passport.authenticate('jwt', { session: false }), caregivers);

describe('Testing get caregiver route', function(){
    
    describe('Get existing caregiver', function(){
        it('Should return caregiver', function(done){
            let email = "facility@mail.com";
            let password = "secret";
            UserModel.findOne({ email: "charles@mail.com"}).exec().then(caregivers => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).get(`/users/${caregivers._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('user');
                        expect(res.body.user.email).to.equal(caregivers.email);
                        done();
                    });
                });
            });
        });
    });

    describe('Get not existing caregiver', function(){
        it('Should return user not found', function(done){
            let email = "facility@mail.com";
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

describe('Testing add caregiver route', function(){
    
    describe('Add new caregiver', function(){
        it('Should return caregiver', function(done){
            let email = "facility@mail.com";
            let password = "secret";

            let caregiver = {
                    email : "unitcaregiver@test.com",
                    password : "secret",
                    firstname : "unitcaregiver",
                    lastname : "test",
                    birthday : "1999-08-11",
                    phone : "0698563413",
                    notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/caregivers/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: caregiver}).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('caregiver_user');
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });

    describe('Add existing caregiver', function(){
        it('Should return error', function(done){
            let email = "facility@mail.com";
            let password = "secret";

            let caregiver = {
                    email : "charles@mail.com",
                    password : "secret",
                    firstname : "unit",
                    lastname : "test",
                    birthday : "1999-08-10",
                    phone : "0698563412",
                    notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/caregivers/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: caregiver}).then(res => {
                    expect(res.status).to.equal(500);
                    done();
                });
            });
        });
    });

});

describe('Testing update caregiver route', function(){
    
    describe('Update existing caregiver', function(){
        it('Should return caregiver and succesfull message', function(done){
            let email = "facility@mail.com";
            let password = "secret";

            let caregiver = {
                email : "unitcaregiver@test.com",
                password : "secret",
                firstname : "unitcaregiver",
                lastname : "test",
                birthday : "1999-08-11",
                phone : "0698563413",
                notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            UserModel.findOne({ email: "unitcaregiver@test.com"}).exec().then(users => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).put(`/caregivers/${users._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: caregiver}).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        expect(res.body).to.have.property('caregiver_user');
                        done();
                    });
                });
            });
        });
    });

    describe('Update not existing caregiver', function(){
        it('Should return error', function(done){
            let email = "facility@mail.com";
            let password = "secret";
            let id = "6075dbf736001a63bc243781";

            let caregiver = {
                email : "unit@test.com",
                password : "secret",
                firstname : "unit",
                lastname : "test",
                birthday : "1999-08-11",
                phone : "0698563413",
                notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).put(`/caregivers/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: caregiver}).then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('Caregiver not found');
                    done();
                });
            });
        });
    });

});

describe('Testing delete caregiver route', function(){
    
    describe('Delete existing caregiver', function(){
        it('Should return succesfull message', function(done){
            let email = "facility@mail.com";
            let password = "secret";

            UserModel.findOne({ email: "unitcaregiver@test.com"}).exec().then(caregiver => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).delete(`/users/${caregiver._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Delete  not existing caregiver', function(){
        it('Should return error', function(done){
            let email = "facility@mail.com";
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

describe('Testing get needy users from caregiver', function(){
    
    describe('Get needy users from caregiver', function(){
        it('Should return all needy users from caregiver', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).get(`/caregivers/needyusers`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('needy_users');
                    done();
                });
            });

        });
    });

});

describe('Testing get guardians from caregiver', function(){
    
    describe('Get guardians from caregiver', function(){
        it('Should return all guardians from caregiver', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).get(`/caregivers/guardians`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('guardians');
                    done();
                });
            });

        });
    });

});