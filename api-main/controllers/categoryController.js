const CategoryModel = require('../models/categoryModel');

exports.create = async (category) => {
  let newCategory = new CategoryModel({
    name: category.name,
    colour: category.colour
  });
  let result = await newCategory.save(newCategory);
  return result;
}

exports.delete = async (categoryId) => {
    return CategoryModel.deleteOne({ _id: categoryId });
}

exports.getAll = async () => {
  let categories = await CategoryModel.find();
  if (categories == null) {
    throw new Error('404');
  }
    return categories;
}

exports.findOne = async (categoryId) => {
    let category = await CategoryModel.findById(categoryId);
    if (category == null) {
      throw new Error('404');
    }
      return category;
}

exports.edit = async(categoryId,category) =>{
       let editCategory = await CategoryModel.findById(categoryId);
       if (editCategory == null) {
         throw new Error('404');
       }
       editCategory.name = category.name ?? editCategory.name;
       editCategory.colour = category.colour ?? editCategory.colour;
       let result = await editCategory.save();
       return result;
}
