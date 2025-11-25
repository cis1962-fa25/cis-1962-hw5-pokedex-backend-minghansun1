import express from 'express';
import { listPokemon, getPokemonByName } from '../controllers/pokemonControllers.js';

const router = express.Router();

router.get('/', (req, res) => listPokemon(req, res));
router.get('/:name', (req, res) => getPokemonByName(req, res));

export default router;