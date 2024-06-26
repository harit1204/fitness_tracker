//userRoutes.js
// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/user');



// Route handler for fetching all users
router.get('/usersGet', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route handler for fetching a single user by ID
router.get('/usersGetOne/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route handler for updating a user by ID
router.patch('/usersUpdateOne/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'weight', 'height', 'diet', 'address', 'ethnicity', 'residence', 'country', 'state', 'city', 'familyDoctor', 'emergencyContactPersonName', 'emergencyContact'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route handler for deleting a user by ID
router.delete('/usersDel/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route handler for creating a new user
router.post('/createUser', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/logindone', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user with the provided email exists
    console.log("Debug");
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials1' });
    }

    // Verify the password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials2' });
    }

    // If email and password are valid, generate a JWT token and send it in the response
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

module.exports = router;
