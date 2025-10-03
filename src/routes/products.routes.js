const express = require('express');
const router = express.Router();

// Temporal - Estudiante 2 implementará esto
router.get('/', (req, res) => {
  res.json({ message: 'Products endpoint - En desarrollo' });
});

module.exports = router;