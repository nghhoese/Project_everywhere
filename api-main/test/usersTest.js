require('dotenv').config()
require('../routes/middleware/auth/auth');

const request = require('supertest');
const expect = require('chai').expect;
const should = require('chai').should();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const users = require('../routes/users/users');
app.use('/users', users);

describe('Testing login route', function(){

    describe('Login with existing user', function(){
        it('Should return user and token', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password}).then(res => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('user');
                expect(res.body).to.have.property('token');
                expect(res.body.user.email).to.equal(email);
                done();
            });
        });
    });

    describe('Login with wrong email', function(){
        it('Should return error: user not found', function(done){
            let email = "test@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password}).then(res => {
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.equal("user not found");
                done();
            });

        });
    });

    describe('Login with wrong password', function(){
        it('Should return error: user not found', function(done){
            let email = "charles@mail.com";
            let password = "test";

            request(app).post('/users/login').send({ email, password}).then(res => {
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.equal("user not found");
                done();
            });
        });
    });

    describe('Login with wrong email and password', function(){
        it('Should return error: user not found', function(done){
            let email = "test@mail.com";
            let password = "test";

            request(app).post('/users/login').send({ email, password}).then(res => {
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.equal("user not found");
                done();
            });
        });
    });

});

describe('Testing automatic login route', function(){

    describe('Automatic login with correct token', function(){
        it('Should return user', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password }).then(res => {
                request(app).post('/users/loginByToken').set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('user');
                    expect(res.body.user.email).to.equal(email);
                    done();
                });
            });
            
        });
    });

    describe('Automatic login with incorrect token', function(){
        it('Should return unauthorized', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password }).then(res => {
                request(app).post('/users/loginByToken').set({ "Authorization": `Bearer ${res.body.token}wrong` }).then(res => {
                    expect(res.status).to.equal(401);
                    done();
                });
            });
            
        });
    });

});

describe('Testing profile route', function(){


});

describe('Testing get all users route', function(){

    describe('Get all users', function(){
        it('Should return all users', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password }).then(res => {
                request(app).get('/users/').set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.users).to.length.above(0);
                    done();
                });
            });

        });
    });

    describe('Get all caregivers', function(){
        it('Should return all caregivers', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password }).then(res => {
                request(app).get('/users/?role=caregiver').set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.users).to.length.above(0);
                    done();
                });
            });

        });
    });

    describe('Get all needy users', function(){
        it('Should return all needy users', function(done){
            let email = "charles@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password }).then(res => {
                request(app).get('/users/?role=needy_user').set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.users).to.length.above(0);
                    done();
                });
            });

        });
    });

    describe('Get all facility managers', function(){
        it('Should return all facility managers', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            request(app).post('/users/login').send({ email, password }).then(res => {
                request(app).get('/users/?role=facility_manager').set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body.users).to.length.above(0);
                    done();
                });
            });

        });
    });

});

