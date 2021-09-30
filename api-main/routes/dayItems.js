const express = require('express');
const router = express.Router();
const dayItemController = require('../controllers/dayItemController');

router.get('/', async (req, res) => {
    try {
        const result = await dayItemController.getAll();
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/needy_user/:needyUserId', async (req, res) => {
    try {
        const result = await dayItemController.getAllFromNeedyUser(req.params.needyUserId);
        if(result.length > 0) {
            res.json(result[0].dayItems);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get('/needy_user/history/:needyUserId', async (req, res) => {
    try {
        const result = await dayItemController.exportHistory(req.params.needyUserId);
        res.send(result);
    } catch (error) {
      console.log(error);
        res.status(500).json(error);
    }
});

router.get('/get_active_week_day_items/needy_user/:needyUserId', async (req, res) => {
    try {
        const result = await dayItemController.getActiveWeekDayItems(req.params.needyUserId);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/needy_user/:needyUserId', async (req, res) => {
    try {
        const result = await dayItemController.create(req.body.dayItem, req.body.dayItem.task, req.params.needyUserId);
        const dayItem = await dayItemController.findById(result._id)
        res.json(dayItem[0]);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.patch('/update_addition', async (req, res) => {
    try {
        const result = await dayItemController.updateAdditionDayItem(req.body._id, req.body.date);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.patch('/update/:needyUserId', async (req, res) => {
    try {
        const result = await dayItemController.updateDayItem(req.body._id, req.body.day, req.body.time, req.params.needyUserId);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:id/needy_user/:needyUserId', async (req, res) => {
    try {
        const result = await dayItemController.setActiveTill(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await dayItemController.delete(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:id/removals/:removalId', async (req, res) => {
    try {
        const result = await dayItemController.deleteRemovalItem(req.params.id, req.params.removalId);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:id/removal', async (req, res) => {
    try {
        const result = await dayItemController.addDayItemRemoval(req.params.id, req.body.date)
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
