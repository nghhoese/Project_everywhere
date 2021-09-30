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
const TaskModel = require('../models/taskModel');
const DayItemModel = require('../models/dayItemModel');
const UserModel = require('../models/userModel')
const users = require('../routes/users/users');
app.use('/users', users);
const dayItems = require('../routes/dayItems');
app.use('/day_items', passport.authenticate('jwt', { session: false }), dayItems);


describe('Testing add dayItem', () => {

    describe('Add new dayItem', () => {
        it('Should return a dayItem', (done) => {
            const email = "admin@mail.com";
            const password = "secret";
            console.log("====================")

            UserModel.find({}, (err, users) => {
                users = users.filter(user => {
                    return (user.roles[0].name.toString() === "guardian")
                })

                TaskModel.find({}, (err, tasks) => {
                    if(tasks.length === 0) {
                        console.error("There needs to be at least one task in the database.")
                    }

                    const dayItem = {
                        day: 0,
                        time: "12:00",
                        active_since: "2021-04-20T10:00:00",
                        active_till: null,
                        item_removals: [],
                        task: tasks[0]._id
                    }

                    request(app).post('/users/login').send({ email, password}).then(res => {
                        request(app).post(`/day_items/needy_user/${users[0]._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).send({ dayItem }).then(dayItemRes => {
                            expect(dayItemRes.status).to.equal(200);
                            done();
                        });
                    });
                });
            });

        });
    });

    describe('Add item_removal', () => {
        it('Should return dayItems', (done) => {
            const email = "admin@mail.com";
            const password = "secret";

            const date = "2021-04-20T10:00:00";
            DayItemModel.find({}, (err, dayItems) => {

                if(dayItems.length === 0) {
                    console.error("There is no dayItem")
                }

                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).post(`/day_items/${dayItems[0]._id}/removal`).set({ "Authorization": `Bearer ${res.body.token}` }).send({ date }).then(res => {
                        expect(res.status).to.equal(200);
                        done();
                    });
                });
            })

        });
    });

});

describe('Testing get all dayItems', () => {

    // describe('Get all dayItems', () => {
    //     it('Should return dayItems', (done) => {
    //         const email = "admin@mail.com";
    //         const password = "secret";

    //         UserModel.find({}, (err, users) => {
    //             users = users.filter(user => {
    //                 return (user.roles[0].name.toString() === "guardian")
    //             })

    //             request(app).post('/users/login').send({ email, password}).then(res => {
    //                 request(app).get(`/day_items/needy_user/${users[0]._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
    //                     expect(res.status).to.equal(200);
    //                     done();
    //                 });
    //             });
    //         });

    //     });
    // });

    // describe('Get all week dayItems', () => {
        // it('Should return dayItems', (done) => {
        //     const email = "admin@mail.com";
        //     const password = "secret";

        //     UserModel.find({}, (err, users) => {
        //         users = users.filter(user => {
        //             return (user.roles[0].name.toString() === "guardian")
        //         })
        //         request(app).post('/users/login').send({ email, password}).then(res => {
        //             request(app).get(`/day_items/get_active_week_day_items/needy_user/${users[0]._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
        //                 expect(res.status).to.equal(200);
        //                 done();
        //             });
        //         });
        //     });

        // });
    // });

});

describe('Testing update dayItemAddition', () => {

    // describe('Update dayItem addition', () => {
    //     it('Should return dayItems', (done) => {
    //         const email = "admin@mail.com";
    //         const password = "secret";
    //
    //         const date = "2021-04-20T10:00:00";
    //         DayItemModel.find({}, (err, dayItems) => {
    //
    //             if(dayItems.length === 0) {
    //                 console.error("There is no dayItem")
    //             }
    //
    //             request(app).post('/users/login').send({ email, password}).then(res => {
    //                 request(app).patch(`/day_items/update_addition`).set({ "Authorization": `Bearer ${res.body.token}` }).send({ _id: dayItems[0]._id, date }).then(res => {
    //                     expect(res.status).to.equal(200);
    //                     done();
    //                 });
    //             });
    //         })
    //
    //     });
    // });

    // describe('Update dayItem', () => {
    //     it('Should return dayItem', (done) => {
    //         const email = "admin@mail.com";
    //         const password = "secret";
    //
    //         const day = 2;
    //         const time = "11:00";
    //         DayItemModel.find({}, (err, dayItems) => {
    //
    //             if(dayItems.length === 0) {
    //                 console.error("There is no dayItem")
    //             }
    //
    //             request(app).post('/users/login').send({ email, password}).then(res => {
    //                 request(app).patch(`/day_items/update`).set({ "Authorization": `Bearer ${res.body.token}` }).send({ _id: dayItems[0]._id, day, time }).then(res => {
    //                     expect(res.status).to.equal(200);
    //                     done();
    //                 });
    //             });
    //         })
    //
    //     });
    // });
});

describe('Testing date dayItem', () => {

    describe('Delete taskRemoval', () => {
        it('Should return dayItems', (done) => {
            const email = "admin@mail.com";
            const password = "secret";

            DayItemModel.find({}, (err, dayItems) => {
                if(dayItems.length === 0) {
                    console.error("There is no dayItem")
                }

                request(app).post('/users/login').send({ email, password}).then(res => {
                    request(app).delete(`/day_items/${dayItems[0]._id}/removals/${dayItems[0].item_removals[0]}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
                        expect(res.status).to.equal(200);
                        done();
                    });
                });
            })

        });
    });

    // describe('Delete dayItem', () => {
    //     it('Should return dayItems', (done) => {
    //         const email = "admin@mail.com";
    //         const password = "secret";
    //
    //         DayItemModel.find({}, (err, dayItems) => {
    //             if(dayItems.length === 0) {
    //                 console.error("There is no dayItem")
    //             }
    //
    //             UserModel.find({}, (err, users) => {
    //                 users = users.filter(user => {
    //                     return (user.roles[0].name.toString() === "guardian")
    //                 })
    //                 request(app).post('/users/login').send({ email, password}).then(res => {
    //                     request(app).delete(`/day_items/${dayItems[0]._id}/needy_user/${users[0]._id}`).set({ "Authorization": `Bearer ${res.body.token}` }).then(res => {
    //                         expect(res.status).to.equal(200);
    //                         done();
    //                     });
    //                 });
    //             });
    //
    //         })
    //
    //     });
    // });
});
