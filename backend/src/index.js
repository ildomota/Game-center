require('dotenv').config();
const express = require('express');
const cors = require('cors');
const gamesRouter = require('./routes/games');
const pricingRouter = require('./routes/pricing');
const steamRouter = require('./routes/steam');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

app.use('/api/games', gamesRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/steam', steamRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`GameCenter API running on port ${PORT}`));
