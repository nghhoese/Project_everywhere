const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController')
const passport = require('passport');
const user = require('./middleware/user');


/* GET home page. */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try{

    const result = await categoryController.getAll();
    res.json(result);
  }catch(err){
    if(err.toString().includes("404")){
      res.status(404).json({error : 'Not found'});
    }else{
      res.status(500).json(err);
    }
  }
});
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try{
    const result = await categoryController.findOne(req.params.id);
    res.json(result);
  }catch(err){
    if(err.toString().includes("404")){
      res.status(404).json({error : 'Not found'});
    }else{
      res.status(500).json(err);
    }
  }
});
router.post('/',passport.authenticate('jwt', { session: false }),
user.can('access healthcare facility'), function(req, res, next) {

    categoryController.create(req.body).then(data => {
      res.send(data);
    })
      .catch(err => {
        console.log(err)
        res.status(500).send(err);
      });
  });
  router.delete('/:id', passport.authenticate('jwt', { session: false }),
  user.can('access healthcare facility'),function(req, res, next) {

      categoryController.delete(req.params.id).then(data => {
        res.send(data);
      })
        .catch(err => {
          console.log(err)
        });
    });
    router.put('/:id', passport.authenticate('jwt', { session: false }),
    user.can('access healthcare facility'),function(req, res, next) {
        categoryController.edit(req.params.id,req.body).then(data => {
          res.send(data);
        })
        .catch(err => {
          next(err);
          console.log(err)
          if(err.toString().includes("404")){
            res.status(404).send({error : 'Not found'});
          }else{
            res.status(500).send(err);
          }
        });

    });
  module.exports = router;
