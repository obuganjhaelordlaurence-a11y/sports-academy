const path = require('path');
const express = require('express');
const app = require('./api/index');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => console.log(`🏟️  Sports Academy running on http://localhost:${PORT}`));
