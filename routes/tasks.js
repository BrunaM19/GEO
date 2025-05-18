const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('project_id').isInt().withMessage('project_id must be an integer'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, completed, priority, due_date, project_id } = req.body;
    const userId = req.user.id;

    try {
      const [projects] = await pool.execute('SELECT * FROM projects WHERE id = ? AND user_id = ?', [project_id, userId]);
      if (projects.length === 0) return res.status(404).json({ message: 'Project not found or unauthorized' });

      const [result] = await pool.execute(
        `INSERT INTO tasks (title, description, completed, priority, due_date, project_id, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || null,
          completed ? 1 : 0,
          priority || 'medium',
          due_date || null,
          project_id,
          userId,
        ]
      );

      res.status(201).json({
        id: result.insertId,
        title,
        description,
        completed: completed ? true : false,
        priority: priority || 'medium',
        due_date,
        project_id,
        user_id: userId,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
