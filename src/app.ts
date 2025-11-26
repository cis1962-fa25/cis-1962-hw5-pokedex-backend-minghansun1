import express from 'express';
import pokemonRoutes from './routes/pokemonRoutes.js';
import boxRoutes from './routes/boxRoutes.js';
import authRoutes from './routes/authRoutes.js';
import {requireAuth} from './middleware/auth.js';
const app = express();

app.use(express.json());
app.use('/pokemon', pokemonRoutes);
app.use('/box', requireAuth, boxRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server running'));