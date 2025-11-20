const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

// API routes
router.post('/api/links', linkController.createLink);
router.get('/api/links', linkController.getAllLinks);
router.get('/api/links/:code', linkController.getLinkStats);
router.delete('/api/links/:code', linkController.deleteLink);

// Health check
router.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0', "uptime": process.uptime(), "timestamp": new Date().toISOString() });
});

// Redirect route (must be last)
router.get('/:code', linkController.redirectLink);

module.exports = router;