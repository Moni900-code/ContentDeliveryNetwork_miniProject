const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Primary Server running on port ${PORT}`));