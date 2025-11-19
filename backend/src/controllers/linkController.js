const { pool } = require('../config/database');
const { isValidURL, isValidCode, generateCode } = require('../utils/validation');

// Create link
exports.createLink = async (req, res) => {
  try {
    const { target_url, code } = req.body;

    if (!target_url) {
      return res.status(400).json({ error: 'target_url is required' });
    }

    if (!isValidURL(target_url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let shortCode = code;
    
    if (shortCode) {
      if (!isValidCode(shortCode)) {
        return res.status(400).json({ error: 'Code must be 6-8 alphanumeric characters' });
      }
      
      // Check if code exists
      const existing = await pool.query('SELECT * FROM links WHERE code = $1', [shortCode]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      // Generate unique code
      let attempts = 0;
      while (attempts < 10) {
        shortCode = generateCode();
        const existing = await pool.query('SELECT * FROM links WHERE code = $1', [shortCode]);
        if (existing.rows.length === 0) break;
        attempts++;
      }
      
      if (attempts === 10) {
        return res.status(500).json({ error: 'Failed to generate unique code' });
      }
    }

    const result = await pool.query(
      'INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING *',
      [shortCode, target_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all links
exports.getAllLinks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single link stats
exports.getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get link stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete link
exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Redirect and track click
exports.redirectLink = async (req, res) => {
  try {
    const { code } = req.params;
    
    const result = await pool.query(
      `UPDATE links 
       SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP 
       WHERE code = $1 
       RETURNING target_url`,
      [code]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Link not found');
    }
    
    res.redirect(302, result.rows[0].target_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Server error');
  }
};