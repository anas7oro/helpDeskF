const Report = require('../models/reportModel'); 
const ticket= require('../models/ticketModel');
const workflow= require('../models/workflowModel');
const { route } = require('../routes/managerRoutes');
const {logger} = require('../middleware/logger');
const User = require('../models/userModel');
const reportModel = require('../models/reportModel');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const agent = require('../models/agentModel');
const Joi = require('joi');

//get all reports and sort them by date 
exports.getAllReports = async (req, res, next) => {
  console.log('getAllReports function was called');
  logger.info('getAllReports function was called', { userId: req.user?._id });
  try {
    const reports = await Report.find().sort({ date: -1 }); // Use Report model to find and sort reports

    res.status(200).json(reports);

  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};


exports.createReport = async (req, res, next) => {
  console.log('createReport function was called');

  const { title, description, agentId, ticketId} = req.body;
  try {
    console.log('req.body:', req.body);

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      agentId: Joi.string().required(),
      ticketId: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log('error:', error);
      logger.error('Invalid input data');
      return res.status(400).json(error.details[0].message);
    }

    const managerId=req.user._id;

    //create a new report
    const report = await Report.create({
      title,
      description,
      agentid:agentId,
      managerid:managerId,
      ticketid:ticketId
  });
    const savedReport = await report.save();

    res.status(201).json(savedReport);
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};

exports.getReport = async (req, res, next) => {
  console.log('getReport function was called');
  logger.info('getReport function was called');
 const id = req.body.id;
  //check if something is missing in the inputs
  console.log('id:', id);
  if (!id) {
   return res.status(400).json({ message: 'Missing inputs' });
  }
  try{
    const report = await reportModel.findOne({ ticketid: id });
    if (!report) {
      logger.error('No report found with this id');
      res.status(404).json({ message: 'No report found with this id' });
      return;
    }
    console.log('report found for an id :', report);
    res.status(200).json(report); 
  } catch(err){
    logger.error(err.message, { userId: req.user?._id });
        console.error('Error:', err);
  }};
 
exports.updateReport = async (req, res, next) => {
  console.log('updateReport function was called');
  logger.info('updateReport function was called');

  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      
    });

    const { error, value } = schema.validate({ ...req.body });
    if (error) {
      console.log('error:', error);
      logger.error('Invalid input data');
      return res.status(400).json(error.details[0].message);
    }
    const { title, description,} = req.body;
    const id = req.params.id;
  
    const updatedReport = await reportModel.updateOne({ _id: id }, {
      title,
      description,
    });
    if (!updatedReport) {
      logger.error("Something went wrong", { userId: req.user?._id });
      res.status(404).json({ message: 'No report found with this ID' });
      return;
    }
    logger.info('Report updated successfully');
    res.status(200).json({ message: 'Report updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};


exports.getAnalytics = async (req, res, next) => {
  console.log('getAnalytics function was called');
  logger.info('getAnalytics function was called');
  console.log('req query:', req.query);
  try {
    const schema = Joi.object({
      subCategory: Joi.string().allow(''),
      category: Joi.string().allow(''),
      creationDate: Joi.date().allow(''),
      closingDate: Joi.date().allow(''),
      openingDate: Joi.date().allow(''),
      userEmail: Joi.string().email().allow(''),
      agentEmail: Joi.string().email().allow(''), 
      status: Joi.string().allow('')
    });
    const { error, value } = schema.validate(req.query);
    if (error) {
      console.log('error:', error);
      logger.error('Invalid input data');
      return res.status(400).json(error.details[0].message);
    }
    let { subCategory, category, creationDate, closingDate, openingDate, userEmail, status } = req.query;
    console.log('before creationDate  : ', creationDate, 'closingDate : ', closingDate, 'openingDate : ', openingDate);

   // Convert date strings to MongoDB Date objects
if (creationDate) {
  creationDate = new Date(creationDate);
  creationDate.setUTCHours(0, 0, 0, 0);
}
if (closingDate) {
  closingDate = new Date(closingDate);
  closingDate.setUTCHours(0, 0, 0, 0);
}
if (openingDate) {
  openingDate = new Date(openingDate);
  openingDate.setUTCHours(0, 0, 0, 0);
}

    console.log('after creationDate  : ', creationDate, 'closingDate : ', closingDate, 'openingDate : ', openingDate);
    // Get userId and agentId from emails
    const user = userEmail ? await User.findOne({ email: userEmail }) : null;
    let userId = user ? user._id : null;

    // Prepare the query
    let query = {
      ...(creationDate && { creationDate: { $gte: creationDate, $lte: closingDate || new Date() } }),
      ...(openingDate && { openingDate: { $gte: openingDate, $lte: closingDate || new Date() } }),
      ...(userId && { userid: userId }),  
      ...(status && { status: status }),
      ...(category && { category: category }),
      ...(subCategory && { subCategory: subCategory })
    };

    const categoryCounts = await ticket.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users", 
          localField: "userid", 
          foreignField: "_id", 
          as: "user_info" 
        }
      },
      
      {
        $unwind: "$user_info" 
      },
      {
        $group: {
          _id: { category: "$category", subCategory: "$subCategory", agentId: "$agentId", userId: "$userid", userEmail: "$user_info.email", userRole: "$user_info.role" },  
          count: { $sum: 1 },
          avgRate: { $avg: "$rate" }, 
          ticket:{ $push: "$$ROOT" }
        }
      }
    ]);

    res.status(200).json(categoryCounts);

  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};

exports.getAgentsAnalytics = async (req, res, next) => {
  try {
    console.log('getAgentsAnalytics function was called');
    const agents = await agent.find();
    console.log('agents:', agents);
    const agentAnalytics = [];

    for (let i = 0; i < agents.length; i++) {
      const agentTickets = await ticket.aggregate([
        {
          $match: { agentid: agents[i]._id }
        },
        {
          $group: {
            _id: "$agentId",
            avgRate: { $avg: "$rate" },
            count: { $sum: 1 },
            tickets: { $push: "$$ROOT" }
          }
        }
      ]);
      const user = await User.findById(agents[i].userId);
    console.log('agentEmail:', user);

      agentAnalytics.push({
        agentId: agents[i].userId,
        agentEmail: user.email,
        avgRate: agentTickets.length > 0 ? agentTickets[0].avgRate : null,
        ticketCount: agentTickets.length > 0 ? agentTickets[0].count : 0,
        tickets: agentTickets.length > 0 ? agentTickets[0].tickets : []
      });
    }
    res.json(agentAnalytics);
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalyticsCharts = async (req, res, next) => {
  console.log('getAnalyticsCharts function was called');
  logger.info('getAnalyticsCharts function was called');
  try {
    // Get the number of tickets for each category
    const categoryCounts = await ticket.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Get the number of tickets for the top subcategory in each category
    const topSubcategoryCounts = await ticket.aggregate([
      { $group: { _id: { category: "$category", subCategory: "$subCategory" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $group: { _id: "$_id.category", topSubCategory: { $first: "$_id.subCategory" }, count: { $first: "$count" } } }
    ]);

    // Get the number of tickets for each status
    const statusCounts = await ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get the average rate for each agent
    const agentAvgRates = await ticket.aggregate([
      { $match: { rate: { $exists: true } } },
      { $group: { _id: "$agentId", avgRate: { $avg: "$rate" }, ratedTickets: { $sum: 1 } } }
    ]);

console.log('categoryCounts:', categoryCounts, 'topSubcategoryCounts:', topSubcategoryCounts, 'statusCounts:', statusCounts, 'agentAvgRates:', agentAvgRates);
    res.status(200).json({
      categoryCounts,
      topSubcategoryCounts,
      statusCounts,
      agentAvgRates
    });

  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};

//joi tested
exports.createWorkflow = async (req, res, next) => {
  console.log('createWorkflow function was called');
  logger.info('createWorkflow function was called');
  try {
    const schema = Joi.object({
      steps: Joi.array().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      subCategory: Joi.string().required(),
      active: Joi.boolean().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log('error:', error);
      logger.error('Invalid input data');
      return res.status(400).json(error.details[0].message);
    }
    const {  steps, description,category,subCategory,active} = req.body;
    const creator=req.user._id;
    console.log('created by:', req.user.email);
    //create a new workflow
    const newWorkflow = await workflow.create({
      steps,
      description,
      creator, 
      category,
      subCategory,
      active
  });
    const savedWorkflow = await newWorkflow.save();
    console.log('Workflow:', savedWorkflow);
    res.status(200).json(message='Workflow created successfully');
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};


//joi tested
exports.updateWorkflow = async (req, res, next) => {
  console.log('updateWorkflow function was called');
  logger.info('updateWorkflow function was called');
  const schema = Joi.object({
    _id: Joi.string().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    steps: Joi.array().required(),
    description: Joi.string().required(),
    creator: Joi.string().required(),
    active: Joi.boolean().required(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
    updatedBy: Joi.string().required(),
    __v: Joi.number().integer().required()
  }).unknown(false);
  const { error, value } = schema.validate(req.body);
  if (error) {
    console.log('error:', error);
    logger.error('Invalid input data');
    return res.status(400).json(error.details[0].message);
  }
  
  try {
    const {  name, steps, description,subCategory} = req.body;
    //check if something is missing in the inputs
    const id  = req.params.id;
    console.log('name:', req.params);
    console.log('id:', id);
  
    const updatedBy=req.user._id;
    const updatedWorkflow = await workflow.updateOne({ _id: id }, {
      name,
      steps,
      description,
      updatedBy,
      ...(subCategory && { subCategory })
    });
    if (!updatedWorkflow) {
      res.status(404).json({ message: 'No workflow found with this ID' });
      return;
    }
    logger.info('Workflow updated successfully');
    res.status(200).json({ message: 'Workflow updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkflow = async (req, res, next) => {
  console.log('getWorkflow function was called');
  logger.info('getWorkflow function was called');
  const { id } = req.query;
  //check if something is missing in the inputs
  if (!id) {
    try {
      console.log('getting all workflows');
      const workflows = await workflow.find();
      if (!workflows) {
        console.error('No workflows found');
        res.status(404).json({ message: 'No workflows found' });
        return;
      }
      console.log('workflows:', workflows);
      res.status(200).json(workflows);
    } catch (err) {
      console.error('Error:', err);
      logger.error(err.message, { userId: req.user?._id });
      res.status(500).json({ message: err.message });
    }
  } else {
    try{
      //get the workflow by id
      const foundWorkflow = await workflow.findById(id);
      if (!foundWorkflow) {
        res.status(404).json({ message: 'No workflow found with this id' });
        return;
      }
      res.status(200).json(foundWorkflow);
    } catch(err){
      logger.error(err.message, { userId: req.user?._id });
      console.error('Error:', err);
    }
  }
};

exports.getTickets = async (req, res, next) => {
  console.log('getAnalytics function was called');
  logger.info('getAnalytics function was called');
  try {
    const schema = Joi.object({
      state: Joi.string().allow(''),
      agentid: Joi.string().allow(''),
      agentEmail: Joi.string().email().allow('')
    });

    const { error, value } = schema.validate(req.query);
    if (error) {
      console.log('error:', error);
      logger.error('Invalid input data');
      return res.status(400).json(error.details[0].message);
    }

    const { state, agentid, agentEmail } = req.query;
    let query = {
      ...(state && { state: state }),
      ...(agentid && { agentid: agentid }),
      ...(agentEmail && { agentEmail: agentEmail })
    };

    const tickets = await ticket.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "userid", // name of the userId field in the Ticket collection
          foreignField: "_id", // name of the _id field in the User collection
          as: "user_info" // output array field
        }
      },
      {
        $lookup: {
          from: "reports", // name of the Report collection
          localField: "_id", // name of the _id field in the Ticket collection
          foreignField: "ticketid", // name of the ticketId field in the Report collection
          as: "report_info" // output array field
        }
      },
      {
        $unwind: "$user_info"
      },
      {
        $addFields: {
          hasReport: { $gt: [{ $size: "$report_info" }, 0] }, // add hasReport field
          agentEmail: "$user_info.email" // add agent's email
        }
      }
    ]);

    res.status(200).json(tickets);

  } catch (err) {
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
  }
};