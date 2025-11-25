import express from 'express';
import pokemonRoutes from './routes/pokemonRoutes.js';
import boxRoutes from './routes/boxRoutes.js';
import authRoutes from './routes/auth.js';
const app = express();

app.use('/pokemon', pokemonRoutes);
app.use('/box', boxRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server running'));