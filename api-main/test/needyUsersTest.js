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
const needyUser = require('../routes/users/needyUsers');
app.use('/needyusers', passport.authenticate('jwt', { session: false }), needyUser);

describe('Testing get needy user route', function(){
    
    describe('Get existing needy user', function(){
        it('Should return needy user', function(done){
            let email = "charles@mail.com";
            let password = "secret";
            UserModel.findOne({ email: "needy@mail.com"}).exec().then(needyUser => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).get(`/users/${needyUser._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('user');
                        expect(res.body.user.email).to.equal(needyUser.email);
                        done();
                    });
                });
            });
        });
    });

    describe('Get not existing needy user', function(){
        it('Should return error needy user not found', function(done){
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

describe('Testing add needy user route', function(){
    
    describe('Add new user', function(){
        it('Should return user', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            let needyUser = {
                    email : "unit@test.com",
                    password : "secret",
                    firstname : "unit",
                    lastname : "test",
                    birthday : "1999-08-10",
                    phone : "0698563412",
                    notifications : {"vibrate": true, "audio": false, "visual": true}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/needyusers/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: needyUser}).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('needyUser');
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });

    describe('Add existing user', function(){
        it('Should return error', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            let needyUser = {
                    email : "needy@mail.com",
                    password : "secret",
                    firstname : "unit",
                    lastname : "test",
                    birthday : "1999-08-10",
                    phone : "0698563412",
                    notifications : {"vibrate": true, "audio": true, "visual": true}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/needyusers/`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: needyUser}).then(res => {
                    expect(res.status).to.equal(500);
                    done();
                });
            });
        });
    });

});

describe('Testing update needy user route', function(){
    
    describe('Update existing user', function(){
        it('Should return needy user and succesfull message', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            let needy = {
                email : "unit@test.com",
                password : "secret",
                firstname : "unit",
                lastname : "testen",
                birthday : "1999-08-10",
                phone : "0698563412",
                notifications : {"vibrate": true, "audio": false, "visual": true}
            }

            UserModel.findOne({ email: "unit@test.com"}).exec().then(needyUser => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).put(`/needyusers/${needyUser._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: needy}).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        expect(res.body).to.have.property('needyUser');
                        done();
                    });
                });
            });
        });
    });

    describe('Update not existing user', function(){
        it('Should return error', function(done){
            let email = "charles@mail.com";
            let password = "secret";
            let id = "6075dbf736001a63bc243786";

            let needyUser = {
                email : "needy@mail.com",
                password : "secret",
                firstname : "unit",
                lastname : "testen",
                birthday : "1999-08-10",
                phone : "0698563412",
                notifications : {"vibrate": true, "audio": false, "visual": true}
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).put(`/needyusers/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({user: needyUser}).then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('Needy user not found');
                    done();
                });
            });
        });
    });

});

describe('Testing delete needy user route', function(){
    
    describe('Delete existing user', function(){
        it('Should return succesfull message', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            UserModel.findOne({ email: "unit@test.com"}).exec().then(needyUser => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).delete(`/users/${needyUser._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Delete  not existing user', function(){
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

describe('Testing get guardians from needy users', function(){
    
    describe('Get guardians', function(){
        it('Should return all guardians from needy user', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            UserModel.findOne({ email: "needy@mail.com"}).exec().then(needyUser => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).get(`/needyusers/${needyUser._id}/guardians`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('guardians');
                        done();
                    });
                });
            });
        });
    });

});