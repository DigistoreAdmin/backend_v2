const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envFile = path.join(process.cwd(), `.env.${process.env.NODE_ENV}`);

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
}
