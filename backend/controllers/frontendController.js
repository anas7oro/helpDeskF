const Branding = require('../models/brandingModel');
const {logger} = require('../middleware/logger');
const { log } = require('winston');
const Joi = require('joi');

exports.getActiveBranding = async (req, res, next) => {
  logger.info('getActiveBranding function was called');
  console.log('getActiveBranding function was called');
  try {
      const branding = await Branding.findOne({ active: true });
      console.log('active branding found :', branding);
      res.status(200).json(branding);
  } catch (err) {
      console.error('Error:', err);
      logger.error(err.message, { userId: req.user?._id });
      res.status(500).json({ message: err.message });
  }
};
exports.getBranding = async (req, res, next) => {
  logger.info('getBranding function was called');
  console.log('getBranding function was called');
  try {
    const branding = await Branding.find();
    console.log('branding found :', branding);
    res.status(200).json(branding);
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};

exports.setBranding = async (req, res, next) => {
  console.log('setBranding function was called creating a new branding');
  logger.info('setBranding function was called creating a new branding');
  try {
    const fs = require('fs');
    const schema = Joi.object({
      logo: Joi.any().required(),
      color_ballet: Joi.array().items(Joi.string().pattern(/^#[0-9A-F]{6}$/i)).required(),
      banner: Joi.any().optional(),
        name: Joi.string().required(),
        active: Joi.boolean().required()
      });
  
      const { error, value } = schema.validate(req.body);
      if (error) {
        console.log('Invalid input data',error);
        logger.info('Invalid input data');
        return res.status(400).json(error.details[0].message);
      }
    const { logo, color_ballet, banner, name, active } = req.body;
    console.log('req.body :', req.body);
    const existingBranding = await Branding.findOne({ name: name });
    if (existingBranding) {
        logger.error('A branding with this name already exists', { userId: req.user?._id });
      return res.status(400).json({ message: 'A branding with this name already exists' });
    }
    const branding = new Branding({
      active,
      name,
      color_ballet,
      banner,
    });
    const newBranding = await branding.save();
    console.log('new Branding added');
    logger.info('new Branding added');
    res.status(201).json(newBranding);
    
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};
exports.deleteBranding = async (req, res, next) => {
  logger.info('deleteBranding function was called');
  console.log('deleteBranding function was called');
  try {
    const branding = await Branding.findByIdAndDelete(req.params.id);
    if (!branding) {
      logger.error('No branding found with this id', { userId: req.user?._id });
      return res.status(404).json({ message: 'No branding found with this id' });
    }
    logger.info('Branding deleted');
    console.log('Branding deleted');
    res.status(200).json(branding);
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
}

exports.updateBranding = async (req, res, next) => {
  console.log('updateBranding function was called');
  logger.info('updateBranding function was called');
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      logo: Joi.string().optional(),
      color_ballet: Joi.array().items(Joi.string()),
      banner: Joi.string().optional().allow(null),
      active: Joi.boolean(),
      _id: Joi.string().required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),
      __v: Joi.number().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log('Invalid input data',error);
      logger.info('Invalid input data');
      return res.status(400).json(error.details[0].message);
    }

    const updateFields = {};
    for (let key in req.body) {
      if (req.body[key]) {
        updateFields[key] = req.body[key];
      }
    }

    const updatedBranding = await Branding.findOneAndUpdate(
      { _id: req.body._id }, // find a document with `_id` equal to `req.body._id`
      { $set: updateFields }, // fields to update
      { new: true } // option to return the updated document
    );

    if (!updatedBranding) {
      logger.error('No branding found with this id', { userId: req.user?._id });
      return res.status(404).json({ message: 'No branding found with this id' });
    }

    logger.info('Branding updated');
    console.log('Branding updated');
    res.status(200).json(updatedBranding);

  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};