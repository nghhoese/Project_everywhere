require('dotenv').config()
require('../routes/middleware/auth/auth');

let request = require('supertest');
let expect = require('chai').expect;
let should = require('chai').should();

const express = require('express');
const app = express();
const TaskModel = require("../models/taskModel");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let tasks = require('../routes/tasks');
var users = require('../routes/users/users');
app.use('/tasks', tasks);
app.use('/users', users);

let authToken;
describe('profile route with correct token', function () {
  it('Should return message and user', function (done) {
    var email = "charles@mail.com";
    var password = "secret";
    request(app).post('/users/login').send({ email, password }).then(res => {
      authToken = res.body.token;
      done();
    });
  });
});

describe('Testing tasks route', function () {
  describe('Create task with name and taskitem', function () {
    it('Should return task with name and taskitem', function (done) 
    {
      let name = "testTask";
      let taskItems = [{ shortDescription: "testDescription" }];
      request(app).post('/tasks')
        .set({ "Authorization": `Bearer ${authToken}` })
        .set("Content-Type", "application/json")
        .send({ name: name, taskItems: JSON.stringify(taskItems)}).then(res => {
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal(name);
          expect(res.body).to.have.property('taskItems');
          expect(res.body.taskItems).to.not.be.undefined;
          done();
        });
    });
  });

  describe('Create task without name', function () {
    it('Should return error: Path `name` is required', function (done) {
      let name;
      let taskItems = [{ shortDescription: "testDescription" }];
      request(app).post('/tasks')
        .set({ "Authorization": `Bearer ${authToken}` })
        .set("Content-Type", "application/json")
        .send({ name: name, taskItems: JSON.stringify(taskItems) }).then(res => {
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.name.message).to.equal('Path `name` is required.');
          done();
        });
    });
  });

  describe('Create task without taskitem', function () {
    it('Should return error: Path `taskItem` is required', function (done) {
      let name = "testTask";
      request(app).post('/tasks')
        .set({ "Authorization": `Bearer ${authToken}` })
        .set("Content-Type", "application/json")
        .send({ name: name }).then(res => {
          expect(res.body).to.have.property('err');
          expect(res.body.err).to.equal('`taskItem` is required.');
          done();
        });
    });
  });
});


describe('Testing edit task route', function () {
  describe('Edit task name', function () {
    it('Should return task with new name', (done) => {
      let taskItems = [{ shortDescription: "testDescription" }];
      const task = TaskModel.findOne()
        .then(task => {
          const change = task.name + "new";
          const url = '/tasks/' + task._id;
          request(app).put(url)
            .set({ "Authorization": `Bearer ${authToken}` })
            .set("Content-Type", "application/json")
            .send({ name: change, taskItems: JSON.stringify(taskItems) })
            .then((res) => {
              expect(res.body).to.have.property('name');
              expect(res.body.name).to.equal(change);
              expect(res.statusCode).to.equal(200);
              done();
            })
            .catch((err) => done(err))
        })
    });
  });
});

describe('Testing delete task route', function () {
  describe('Delete task using id', function () {
    it('Should return ok and deletedCount', (done) => {
      const task = TaskModel.findOne().then(task => {
        request(app).delete('/tasks/' + task._id)
          .set({ "Authorization": `Bearer ${authToken}` })
          .set("Content-Type", "application/json")
          .send().then(res => {
            expect(res.body).to.have.property('ok');
            expect(res.body.ok).to.equal(1);
            expect(res.body).to.have.property('deletedCount');
            expect(res.body.deletedCount).to.equal(1);
            expect(res.statusCode).to.equal(200);
            done();
          })
          .catch((err) => done(err))
      })
    });
  });
});

describe('Get all tasks', function () {
  it('Should return array of tasks', function (done) {
    request(app).get(`/tasks/`).set({ "Authorization": `Bearer ${authToken}` }).then(res => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      done();
    });
  });
});