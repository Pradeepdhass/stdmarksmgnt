const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static assets from Vite's compilation directory 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Serve React root SPA index.html for all undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 SRMS Production React Server running on http://localhost:${PORT}`);
});
