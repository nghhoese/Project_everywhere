const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const user = require('./middleware/user');
const uploadController = require("../controllers/upload");
const uploadIconController = require("../controllers/uploadIcon");

router.get('/:id', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), function (req, res, next) {
        let id = req.params.id;
        taskController.findOne(id).then(data => {
            res.send(data);
        })
            .catch(err => {
                if (err.toString().includes("404")) {
                    res.status(404).send({error: 'Not found'});
                }
            });
    });

router.get('/:id/taskItems', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), function (req, res, next) {
        let id = req.params.id;
        taskController.getAllTaskItems(id).then(data => {
            res.send(data);
        })
            .catch(err => {
                if (err.toString().includes("404")) {
                    res.status(404).send({error: 'Not found'});
                } else {
                    res.status(500).send(err);
                }

            });
    });

router.get('/', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), function (req, res, next) {
        taskController.getAll(req.query, req.user._id).then(data => {
            res.send(data);
        })
            .catch(err => {
                console.log(err)
                if (err.toString().includes("404")) {
                    res.status(404).send({error: 'Not found'});
                } else {
                    res.status(500).send(err);
                }

            });
    });

router.post('/', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), uploadController.multipleUpload, async function (req, res, next) {
        try {
            if (req.body.taskItems != null) {
                req.body.taskItems = JSON.parse(req.body.taskItems);
                let task = await taskController.create(req.body, req.user._id);
                let index = 0;
                for (i = 0; i < (req.body.taskItems.length ?? 0); i++) {
                    console.log(req.body.taskItems[i])
                    if (req.body.taskItems[i].media) {
                        req.body.taskItems[i].media = 'uploads/' + req.files[index].filename;
                        req.body.taskItems[i].mediaType = req.files[index].mimetype.split("/")[0]
                        index++;
                    }
                    let subTask = await taskController.createTaskItem(task._id, req.body.taskItems[i]);
                    task.taskItems.push(subTask._id);
                }
                let data = await taskController.edit(task._id, task);
                res.send(data);
            } else {
                res.send({err: '`taskItem` is required.'});
            }
            ;
        } catch (err) {
            res.send(err);
            console.log(err)
        }
    });

router.post('/', passport.authenticate('jwt', {session: false}), user.can('access profile'), async function (req, res, next) {
    try {
        if (req.body.taskItems != null) {

            req.body.taskItems = JSON.parse(req.body.taskItems);
            let task = await taskController.create(req.body, req.user._id);
            let index = 0;
            for (i = 0; i < (req.body.taskItems.length ?? 0); i++) {
                if (req.body.taskItems[i].media) {
                    req.body.taskItems[i].media = 'uploads/' + req.files[index].filename;
                    req.body.taskItems[i].mediaType = req.files[index].mimetype.split("/")[0]
                    index++;
                }
                let subTask = await taskController.createTaskItem(task._id, req.body.taskItems[i]);
                task.taskItems.push(subTask._id);
            }
        }
    } catch (err) {
        res.status(500).send(err);
        console.log(err)
    }
});

router.put('/:id/icon', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), uploadIconController.singleUpload, async function (req, res, next) {
        try {

            req.body.taskIcon = 'uploads/' + req.file.filename;

            let taskBody = {
                icon: req.body.taskIcon
            };

            let data = await taskController.edit(req.params.id, taskBody);
            res.send(data);
        } catch (err) {
            res.send(err);
            console.log(err)
        }
    });

router.delete('/:id', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), function (req, res, next) {

        taskController.delete(req.params.id).then(data => {
            res.send(data);
        })
            .catch(err => {
                console.log(err)
            });
    });

router.delete('/taskItems/:taskItemId', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), function (req, res, next) {

        taskController.deleteTaskItem(req.params.id).then(data => {
            res.send(data);
        })
            .catch(err => {
                console.log(err)
            });
    });

router.put('/:id', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), uploadController.multipleUpload, async function (req, res, next) {
        try {
            let files = req.files;
            req.body.taskItems = JSON.parse(req.body.taskItems);
            let taskBody = {
                name: req.body.name,
                template: req.body.template,
                category: req.body.category
            };
            let task = await taskController.edit(req.params.id, taskBody);
            for (i = 0; i < task.taskItems.length; i++) {
                let subTask = await taskController.deleteTaskItem(task.taskItems[i]);
            }
            ;
            task.taskItems = [];
            task = await taskController.edit(task._id, task);
            let index = 0;
            for (i = 0; i < req.body.taskItems.length; i++) {
                if (req.body.taskItems[i].newMedia === true) {
                    req.body.taskItems[i].media = 'uploads/' + req.files[index].filename;
                    req.body.taskItems[i].mediaType = req.files[index].mimetype.split("/")[0]
                    index++;
                }
                let subTask = await taskController.createTaskItem(task._id, req.body.taskItems[i]);
            }
            ;
            let data = await taskController.findOne(req.params.id);
            res.send(data);
        } catch (err) {
            res.status(500).send(err);
            console.log(err)
        }
    });

router.post('/template', passport.authenticate('jwt', {session: false}),
    user.can('access profile'), async function (req, res, next) {
        taskController.addSelectedTemplate(req.query.shareTaskId, req.body, req.user._id).then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
            if (err.toString().includes("404")) {
                res.status(404).send({error: 'Not found'});
            } else {
                res.status(500).send(err);
            }

        });
    });

module.exports = router;
