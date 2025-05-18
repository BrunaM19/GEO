const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, deadline, module, status } = req.body;
    const userId = req.user.id;

    try {
      const [result] = await pool.execute(
        `INSERT INTO projects (title, description, deadline, module, status, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description || null, deadline || null, module || null, status || 'pending', userId]
      );
      res.status(201).json({ id: result.insertId, title, description, deadline, module, status, user_id: userId });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [projects] = await pool.execute('SELECT * FROM projects WHERE user_id = ?', [req.user.id]);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
