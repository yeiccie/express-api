/* eslint-disable consistent-return */
const express = require('express');
const schema = require('../db/schema');
const db = require('../db/connection');

const users = db.get('users');

const router = express.Router();

/* Get all users */

router.get('/', async (req, res, next) => {
  try {
    const allUsers = await users.find({});
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

/* Get a specific users */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await users.findOne({
      _id: id,
    });

    if (!user) {
      const error = new Error('User does not exist');
      return next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});


/* Get a specific users */
router.get('/name/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await users.findOne({
      username: username,
    });

    if (!user) {
      const error = new Error('User does not exist');
      return next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});


/* Create a new user */
router.post('/', async (req, res, next) => {
  try {
    const { name, job } = req.body;
    await schema.validateAsync({ name, job });

    const user = await users.findOne({
      name,
    });

    // user already exists
    if (user) {
      const error = new Error('user already exists');
      res.status(409); // conflict error
      return next(error);
    }

    const newuser = await users.insert({
      name,
      job,
    });

    res.status(201).json(newuser);
  } catch (error) {
    next(error);
  }
});

/* Update a specific user */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, job } = req.body;
    const result = await schema.validateAsync({ name, job });
    const user = await users.findOne({
      _id: id,
    });

    // user does not exist
    if (!user) {
      return next();
    }

    const updateduser = await users.update({
      _id: id,
    }, { $set: result },
    { upsert: true });

    res.json(updateduser);
  } catch (error) {
    next(error);
  }
});

/* Delete a specific user */
// /655afa8196943302b03283bd
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await users.findOne({
      _id: id,
    });

    // user does not exist
    if (!user) {
      return next();
    }
    await users.remove({
      _id: id,
    });

    res.json({
      message: 'user has been deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
