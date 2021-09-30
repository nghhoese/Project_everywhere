const CategoryModel = require('../models/categoryModel');
const DayItemModel = require('../models/dayItemModel');
const ItemRemoval = require('../models/itemRemovalModel');

module.exports = () => new Promise(async (resolve, reject) => {

    const dayItem = await DayItemModel.create({
        day: 1,
        time: '12:30',
        active_since: new Date(1995, 11, 17),
        active_till: new Date(2030, 11, 17),
        item_removals: [],
        task: null,
    });

    const itemRemoval = ItemRemoval.create({
        date: new Date('2021-04-19T12:30:00')
    })

    const category = await CategoryModel.create({
        name: "hygiene",
        colour: "red"
    })

    resolve();
})
