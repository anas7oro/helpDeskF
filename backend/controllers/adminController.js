const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Joi = require('joi');
const {logger} = require('../middleware/logger');
const { log } = require('winston');
const fs = require('fs');
const path = require('path');
const errorSchema= require('../models/logs');
const { spawn } = require('child_process');

const assignRole = asyncHandler(async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        role: Joi.string().valid('client','admin','agent','manager').required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        logger.info('Invalid input data');
        return res.status(400).json(error.details[0].message);
    }

        const { email, role } = req.body;
        const admin = await User.findById(req.user.id);

        if (admin.role !== "admin") {
            logger.info('user in not authorized');
            return res.json("not authorized");
        }

        await User.updateOne({ email: email }, { role: role });
        return res.json("role assigned");
    } catch (error) {
        console.error(error);
        logger.error(err.message, { userId: req.user?._id });
        return res.status(500).json("Internal Server Error");
    }
});

const createUser = asyncHandler(async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (admin.role !== "admin") {
            return res.json("not authorized");
        }

        const schema = Joi.object({
            name: Joi.string().min(3).max(200).required(),
            email: Joi.string().min(3).max(200).required(),
            password: Joi.string().min(3).max(200).required(),
            dateOfBirth: Joi.date().required(),
            address: Joi.string().min(3).max(200).required(),
            phoneNumber: Joi.string().min(3).max(200).required(),
            role: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            logger.error(error.details[0].message);
            return res.send(error.details[0].message, { userId: req.user?._id });
        }

        const { name, email, password, role, dateOfBirth, address, phoneNumber } = req.body;

        const exist = await User.findOne({ email });

        if (exist) {
          logger.error('user exists', { userId: req.user?._id });
            return res.status(200).json("user exists");
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(8));

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            dateOfBirth,
            address,
            phoneNumber
        });

        if (user) {
            logger.info('user registered successfully');
            return res.status(200).json("user registered successfully");
        }
        logger.error('Unable to register user', { userId: req.user?._id });
        res.status(400).json("Unable to register user");
    } catch (error) {
        console.error(error);
        logger.error(err.message, { userId: req.user?._id });
        return res.status(500).json("Internal Server Error");
    }
});

const getErrorLogs = asyncHandler(async (req, res) => {
  try {
    console.log("getting error logs");
    const errorLogs = await errorSchema.find();
    logger.info('Successfully read error log file',errorLogs);
    res.send(errorLogs);
  } catch (error) {
    logger.error(err.message, { userId: req.user?._id });
    console.error(error.message);
  }
  });


const getCombinedLogs = asyncHandler(async (req, res) => {
    const logFile = path.join(__dirname, '../combined.log');
  
    fs.readFile(logFile, 'utf8', (err, data) => {
      if (err) {
        logger.error(err.message, { userId: req.user?._id });
        res.status(500).json({ message: 'Failed to read combined log file' });
      } else {
        logger.info('Successfully read combined log file');
        res.send(data);
      }
    });
  });

const createBackup = asyncHandler(async (req, res) => {
  try {
    console.log("creating backup");
    const ARCHIVE_PATH = path.join(__dirname, '../backup', `${Date.now()}.gz`);

    const backup = new Promise((resolve, reject) => {
      const child = spawn('mongodump', [
        `--uri=${process.env.MONGO_URI}`,
        `--archive=${ARCHIVE_PATH}`,
        '--gzip',
      ]);

      child.stdout.on('data', (data) => {
        console.log('stdout:\n', data);
      });
      child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString());
      });
      child.on('error', (error) => {
        console.log('error:\n', error);
        reject(error);
      });
      child.on('exit', (code, signal) => {
        if (code) {
          console.log('Process exit with code:', code);
          reject(new Error(`Process exit with code: ${code}`));
        } else if (signal) {
          console.log('Process killed with signal:', signal);
          reject(new Error(`Process killed with signal: ${signal}`));
        } else {
          console.log('Backup is successful ✅');
          resolve();
        }
      });
    });

    backup.then(() => {
      res.status(200).json({ message: 'Successfully created backup' });
    }).catch((error) => {
      logger.error(error.message, { userId: req.user?._id });
      console.error(error.message);
      res.status(500).json({ message: 'Failed to create backup' });
    });

  } catch (error) {
    logger.error(error.message, { userId: req.user?._id });
    console.error(error.message);
    res.status(500).json({ message: 'Failed to create backup' });
  }
});

const restoreLatestBackup = asyncHandler(async (req, res) => {
  try {
    console.log("restoring latest backup");
    const { exec } = require('child_process');
    const BACKUP_DIR = path.join(__dirname, '../backup');
    const files = fs.readdirSync(BACKUP_DIR);

    // Sort the files by modified date
    files.sort((a, b) => fs.statSync(path.join(BACKUP_DIR, b)).mtime.getTime() - fs.statSync(path.join(BACKUP_DIR, a)).mtime.getTime());
    const BACKUP_PATH = path.join(BACKUP_DIR, files[0]);
    const MONGO_URI = process.env.MONGO_URI;

    const restore = new Promise((resolve, reject) => {
      exec(`mongorestore --uri=${MONGO_URI} --gzip --archive=${BACKUP_PATH}`, (err, stdout, stderr) => {
        if (err) {
          logger.error(err.message, { userId: req.user?._id });
          console.error(`exec error: ${err}`);
          reject(err);
        } else {
          logger.info('Successfully restored database');
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve(stdout);
        }
      });
    });

    restore.then((stdout) => {
      res.status(200).json({ message: 'Successfully restored database', restoreStatus: stdout });
    }).catch((error) => {
      res.status(500).json({ message: 'Failed to restore database' });
    });

  } catch (error) {
    logger.error(error.message, { userId: req.user?._id });
    console.error(error.message);
    res.status(500).json({ message: 'Failed to restore database' });
  }
});

const restoreBackup = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    time: Joi.date().iso()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    logger.info('Invalid input data');
    return res.status(400).json(error.details[0].message);
  }
  
  try {
    console.log("restoring backup",req.body);
    console.log("restoring backup",req.body.name);
    const { exec } = require('child_process');
    const BACKUP_DIR = path.join(__dirname, '../backup');
    const BACKUP_PATH = path.join(BACKUP_DIR, req.body.name);
    const MONGO_URI = process.env.MONGO_URI;

    const restore = new Promise((resolve, reject) => {
      exec(`mongorestore --uri=${MONGO_URI} --gzip --archive=${BACKUP_PATH}`, (err, stdout, stderr) => {
        if (err) {
          logger.error(err.message, { userId: req.user?._id });
          console.error(`exec error: ${err}`);
          reject(err);
        } else {
          logger.info('Successfully restored database');
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve(stdout);
        }
      });
    });

    restore.then((stdout) => {
      res.status(200).json({ message: 'Successfully restored database', restoreStatus: stdout });
    }).catch((error) => {
      res.status(500).json({ message: 'Failed to restore database' });
    });

  } catch (error) {
    logger.error(error.message, { userId: req.user?._id });
    console.error(error.message);
    res.status(500).json({ message: 'Failed to restore database' });
  }
});


const getBackups = asyncHandler(async (req, res) => {
  try {
    console.log("getting backups");
    const BACKUP_DIR = path.join(__dirname, '../backup');
    const files = fs.readdirSync(BACKUP_DIR);
    const backups = files.map((file) => ({
      name: file,
      time: fs.statSync(path.join(BACKUP_DIR, file)).mtime,
    }));
    logger.info('Successfully read backup directory');
    res.send(backups);
  } catch (error) {
    logger.error(error.message, { userId: req.user?._id });
    console.error(error.message);
    res.status(500).json({ message: 'Failed to read backup directory' });
  }
});

module.exports = {
    assignRole,
    createUser,
    getErrorLogs,
    getCombinedLogs,
    restoreLatestBackup,
    createBackup,
    getBackups,
    restoreBackup
};
