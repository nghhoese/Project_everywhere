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
const guardians = require('../routes/users/guardians');
app.use('/guardians', passport.authenticate('jwt', { session: false }), guardians);

describe('Testing get guardian route', function(){
    
    describe('Get existing guardian', function(){
        it('Should return guardian', function(done){
            let email = "charles@mail.com";
            let password = "secret";
            UserModel.findOne({ email: "guardian@mail.com"}).exec().then(guardians => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).get(`/users/${guardians._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('user');
                        expect(res.body.user.email).to.equal(guardians.email);
                        done();
                    });
                });
            });
        });
    });

    describe('Get not existing guardian', function(){
        it('Should return user not found', function(done){
            let email = "charles@mail.com";
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

describe('Testing add guardian route', function(){
    
    describe('Add new guardian', function(){
        it('Should return guardian', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            let guardian = {
                    email : "unitguardian@test.com",
                    password : "secret",
                    firstname : "unitguardian",
                    lastname : "test",
                    birthday : "1999-08-12",
                    phone : "0698563413",
                    notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/guardians/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: guardian}).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('guardian_user');
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });

    describe('Add existing guardian', function(){
        it('Should return error', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            let guardian = {
                    email : "guardian@mail.com",
                    password : "secret",
                    firstname : "unit",
                    lastname : "test",
                    birthday : "1999-08-10",
                    phone : "0698563412",
                    notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/guardians/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: guardian}).then(res => {
                    expect(res.status).to.equal(500);
                    done();
                });
            });
        });
    });

});

describe('Testing update guardian route', function(){
    
    describe('Update existing guardian', function(){
        it('Should return guardian and succesfull message', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            let guardian = {
                email : "unitguardian@test.com",
                password : "secret",
                firstname : "unitguardian",
                lastname : "testen",
                birthday : "1999-08-12",
                phone : "0698563413",
                notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            UserModel.findOne({ email: "unitguardian@test.com"}).exec().then(users => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).put(`/guardians/${users._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: guardian}).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        expect(res.body).to.have.property('guardian_user');
                        done();
                    });
                });
            });
        });
    });

    describe('Update not existing guardian', function(){
        it('Should return error', function(done){
            let email = "charles@mail.com";
            let password = "secret";
            let id = "6075dbf736001a63bc243781";

            let guardian = {
                email : "unit@test.com",
                password : "secret",
                firstname : "unit",
                lastname : "test",
                birthday : "1999-08-11",
                phone : "0698563413",
                notifications : {"vibrate": false, "audio": false, "visual": false}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).put(`/guardians/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: guardian}).then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('Guardian not found');
                    done();
                });
            });
        });
    });

});

describe('Testing delete guardian route', function(){
    
    describe('Delete existing guardian', function(){
        it('Should return succesfull message', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            UserModel.findOne({ email: "unitguardian@test.com"}).exec().then(guardian => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).delete(`/users/${guardian._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Delete not existing guardian', function(){
        it('Should return error', function(done){
            let email = "charles@mail.com";
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