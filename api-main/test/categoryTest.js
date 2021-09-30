require('dotenv').config()
require('../routes/middleware/auth/auth');

var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

const passport = require('passport');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const UserModel = require('../models/userModel');
const CategoryModel = require('../models/categoryModel');
var users = require('../routes/users/users');
var categories = require('../routes/categories');
app.use('/users', users);
var needyUser = require('../routes/users/needyUsers');
app.use('/needyusers', passport.authenticate('jwt', { session: false }), needyUser);
app.use('/categories', categories);


describe('Testing add category route', function(){
let r = Math.random().toString(36).substring(7);
    describe('Add new category', function(){
        it('Should return category', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let category = {
                  name : r,
                colour : "#FFF",
                          }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/categories/`).set({ "Authorization": `Bearer ${res.body.token}` }).send(category).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('name');
                    done();
                });
            });
        });
    });

    describe('Add existing category', function(){
        it('Should return error', function(done){
            let email = "admin@mail.com";
            let password = "secret";

            let category = {
                  name: r,
                  colour: "#FFF"
            }

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).post(`/categories/`).set({ "Authorization": `Bearer ${res.body.token}` }).send(category).then(res => {
                    expect(res.status).to.equal(500);
                    done();
                });
            });
        });
    });

});

describe('Testing get categories route', function(){

    describe('Get category', function(){
        it('Should return category', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            CategoryModel.findOne().exec().then(category => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).get(`/categories/${category._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('colour');
                        expect(res.body.colour).to.equal(category.colour);
                        done();
                    });
                });
            });
        });
    });
    describe('Get not existing category', function(){
        it('Should return error 404 not found', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            let id = "6075cd585ee9466d0cc60ea8";

            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).get(`/categories/${id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(404);
                    done();
                });
            });
        });
    });
    describe('Get all categories', function(){
        it('Should return array of categories', function(done){
            let email = "admin@mail.com";
            let password = "secret";


            request(app).post('/users/login').send({ email, password}).then(res => {
                request(app).get(`/categories/`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.body[0]).to.have.property('colour');

                    done();
                });
            });
        });
    });
});

describe('Testing put categories route', function(){

    describe('Edit category', function(){
        it('Should edit category colour', function(done){
            let email = "admin@mail.com";
            let password = "secret";
            CategoryModel.findOne().exec().then(category => {
                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).put(`/categories/${category._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({colour: "#666"}).then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('colour');
                        expect(res.body.colour).to.equal("#666");
                        done();
                    });
                });
            });
        });
    });
    });
