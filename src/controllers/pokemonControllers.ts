import Pokedex from 'pokedex-promise-v2';
import { PokeApiListPokemonResponse, Pokemon, PokemonMove } from '../types/types.js';
import { PokemonTypeColors } from '../typeColors.js';
import { dashToTitleCaseWithSpace, dashToCamelCase, capitalizeFirstLetter } from '../helpers.js';
import { PaginationParams } from '../types/validation.js';

const P = new Pokedex();

export async function listPokemon(req: any, res: any) {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const paginationParams = PaginationParams.safeParse({ limit, offset });
    if (!paginationParams.success) {
        return res.status(400).json({ error: 'Invalid pagination parameters', details: paginationParams.error.issues });
    }
    const pokemonList: PokeApiListPokemonResponse = await P.getPokemonsList({ limit, offset });
    const responseList: Pokemon[] = [];
    for (const pokemon of pokemonList.results ) {
        const pokemonData =  await getPokemonByNameHelper(pokemon.name);
        responseList.push(pokemonData);
    }
    res.json(responseList);
}

export async function getPokemonByName(req: any, res: any) {
    const name = req.params.name;
    try {
        const pokemonResponse = await getPokemonByNameHelper(name);
        res.json(pokemonResponse);
    } catch (error) {
        res.status(404).json({ error: 'Pokemon not found' });
    }
}

async function getPokemonByNameHelper(name: string): Promise<Pokemon> {
    const pokemonData =  await P.getPokemonByName(name);
    const species = await P.getPokemonSpeciesByName(name);
    const pokemonResponse : Pokemon = {
        id: pokemonData.id,
        name: capitalizeFirstLetter(pokemonData.name),
        description: species.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text.replace(/[\f\n]/g, ' ') || 'No description available.',
        types: pokemonData.types.map(type => ({
            name: type.type.name.toUpperCase(),
            color: PokemonTypeColors[type.type.name as keyof typeof PokemonTypeColors]
        })),
        moves: await Promise.all(pokemonData.moves.map(async move => {
            const moveData = await P.getMoveByName(move.move.name);
            const moveResponse: PokemonMove = {
                name: moveData.names.find(n => n.language.name === 'en')?.name || dashToTitleCaseWithSpace(moveData.name),
                power: moveData.power || undefined,
                type: {
                    name: moveData.type.name.toUpperCase(),
                    color: PokemonTypeColors[moveData.type.name as keyof typeof PokemonTypeColors]
                }
            };
            return moveResponse;
        })),
        sprites: {
            front_default: pokemonData.sprites.front_default || '',
            back_default: pokemonData.sprites.back_default || '',
            front_shiny: pokemonData.sprites.front_shiny || '',
            back_shiny: pokemonData.sprites.back_shiny || '',
        },
        stats: pokemonData.stats.reduce((acc: any, stat) => {
            acc[dashToCamelCase(stat.stat.name)] = stat.base_stat;
            return acc;
        }, {}),
    };
    return pokemonResponse;
}