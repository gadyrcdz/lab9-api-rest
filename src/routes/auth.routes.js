const express = require('express');
const router = express.Router();

// Temporal - Estudiante 1 implementará esto
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - En desarrollo' });
});

module.exports = router;