const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../.env.production.local' : '../.env'), quiet: true });
