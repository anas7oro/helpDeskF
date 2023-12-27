const ticket= require('../models/ticketModel');
const {logger} = require('../middleware/logger');
const knowledgeBaseModel = require('../models/knowledgeBaseModel');
const Joi = require('joi');

exports.getAllTickets = async (req, res, next) => {
  console.log('getAllTicket function was called');
  try {
    const tickets = await ticket.find().sort({ date: -1 }); 
    console.log('tickets:', tickets);
    res.status(200).json(tickets);

  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.createQandA = async (req, res, next) => {
  console.log('createQandA function was called');
  try {
    const schema = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.info('Invalid input data');
      return res.status(400).json(error.details[0].message);
    }

    const { question, answer } = value;
    const newQandA = new knowledgeBaseModel({
      question,
      answer,
    });
    const savedQandA = await newQandA.save();
    res.status(200).json(savedQandA);
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};