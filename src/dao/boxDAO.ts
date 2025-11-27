import { BoxEntry, InsertBoxEntry, UpdateBoxEntry } from 'src/types/types.js';
import {createId} from "@paralleldrive/cuid2";
import client from '../redisClient.js';

export async function listBoxEntriesDAO(pennkey: string) {
    const key = `box:${pennkey}`;
    const boxEntryIDs: string[] = await client.SMEMBERS(key);
    return boxEntryIDs;
}

export async function createBoxEntryDAO(pennkey: string, boxEntry: InsertBoxEntry): Promise<string> {
    const boxKey = `box:${pennkey}`;
    const id = createId();
    const boxEntryKey = `${pennkey}:pokedex:${id}`;
    await client.SADD(boxKey, id);
    await client.HSET(boxEntryKey, { createdAt: boxEntry.createdAt, level: boxEntry.level.toString(), location: boxEntry.location, notes: boxEntry.notes || '', pokemonId: boxEntry.pokemonId.toString() });
    return id;
}

export async function getBoxEntryByIdDAO(pennkey: string, id: string): Promise<BoxEntry | null> {
    const boxEntryKey = `${pennkey}:pokedex:${id}`;
    const boxEntry = await client.HGETALL(boxEntryKey);
    if (Object.keys(boxEntry).length === 0) {
        return null;
    }
    return {
        id: id,
        createdAt: boxEntry.createdAt,
        level: parseInt(boxEntry.level),
        location: boxEntry.location,
        notes: boxEntry.notes || '',
        pokemonId: parseInt(boxEntry.pokemonId)
    };
}

export async function updateBoxEntryDAO(pennkey: string, id: string, updates: UpdateBoxEntry): Promise<boolean> {
    const boxEntryKey = `${pennkey}:pokedex:${id}`;
    const existingEntry = await client.HGETALL(boxEntryKey);
    if (Object.keys(existingEntry).length === 0) {
        return false;
    }
    const updatedEntry = {
        createdAt: updates.createdAt || existingEntry.createdAt,
        level: updates.level !== undefined ? updates.level.toString() : existingEntry.level,
        location: updates.location || existingEntry.location,
        notes: updates.notes !== undefined ? updates.notes : existingEntry.notes,
        pokemonId: updates.pokemonId !== undefined ? updates.pokemonId.toString() : existingEntry.pokemonId
    };
    await client.HSET(boxEntryKey, updatedEntry);
    return true;
}

export async function deleteBoxEntryDAO(pennkey: string, id: string): Promise<boolean> {
    const boxKey = `box:${pennkey}`;
    const boxEntryKey = `${pennkey}:pokedex:${id}`;
    const removedFromSet = await client.SREM(boxKey, id);
    const deletedHash = await client.DEL(boxEntryKey);
    return removedFromSet > 0 && deletedHash > 0;
}

export async function deleteAllBoxEntriesDAO(pennkey: string): Promise<void> {
    const boxKey = `box:${pennkey}`;
    const boxEntryIDs: string[] = await client.SMEMBERS(boxKey);
    const boxEntryKeys = boxEntryIDs.map(id => `${pennkey}:pokedex:${id}`);
    if (boxEntryKeys.length > 0) {
        await (client.DEL as (...args: string[]) => Promise<number>)(...boxEntryKeys);
    }
    await client.DEL(boxKey);
}