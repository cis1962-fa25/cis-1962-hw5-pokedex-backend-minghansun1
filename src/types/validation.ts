import { z } from 'zod';

export const InsertBoxEntry = z.object({
  createdAt: z.string().datetime(),
  level: z.number().int().positive().max(100),
  location: z.string().min(1).max(255),
  notes: z.string().max(1000).optional(),
  pokemonId: z.number().int().positive()
});

export const UpdateBoxEntry = z.object({
  createdAt: z.string().datetime().optional(),
  level: z.number().int().positive().max(100).optional(),
  location: z.string().min(1).max(255).optional(),
  notes: z.string().max(1000).optional(),
  pokemonId: z.number().int().positive().optional()
});

export const PaginationParams = z.object({
    limit: z.number().int().min(1).optional(),
    offset: z.number().int().min(0).optional()
});