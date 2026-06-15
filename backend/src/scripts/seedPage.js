require('dotenv').config();
const prisma = require('../lib/prisma');

prisma.config.upsert({
  where: { key: 'lastFetchedPage' },
  update: { value: '3' },
  create: { key: 'lastFetchedPage', value: '3' },
}).then(() => {
  console.log('lastFetchedPage set to 3 — next run will start from page 4');
  process.exit(0);
}).catch((err) => { console.error(err); process.exit(1); });
