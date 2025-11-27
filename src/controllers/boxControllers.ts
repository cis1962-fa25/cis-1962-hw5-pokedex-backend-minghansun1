import { listBoxEntriesDAO, createBoxEntryDAO, getBoxEntryByIdDAO, updateBoxEntryDAO, deleteBoxEntryDAO, deleteAllBoxEntriesDAO } from "../dao/boxDAO.js";
import { InsertBoxEntry, UpdateBoxEntry } from "../types/validation.js";

export async function listBoxEntries(req: any, res: any) {
    const user = req.decoded.pennkey;
    console.log(`Listing boxes for user: ${user}`);

    const boxEntries = await listBoxEntriesDAO(user);
    res.status(200).json(boxEntries);
}

export async function createBoxEntry(req: any, res: any) {
    const user = req.decoded.pennkey;
    console.log(`Creating box entry for user: ${user} with data:`, req.body);

    const boxEntryData = req.body;
    const validated = InsertBoxEntry.safeParse(boxEntryData);
    if (!validated.success) {
        return res.status(400).json({  code: "BAD_REQUEST", message: 'Invalid box entry data', details: validated.error.issues });
    }
    const newBoxEntryId = await createBoxEntryDAO(user, boxEntryData);
    res.status(201).json({ id: newBoxEntryId });
}

export async function getBoxEntryById(req: any, res: any) {
    const user = req.decoded.pennkey;
    const id = req.params.id;
    console.log(`Getting box entry ${id} for user: ${user}`);
    
    const boxEntry = await getBoxEntryByIdDAO(user, id);
    if (!boxEntry) {
        return res.status(404).json({ code: "NOT_FOUND", message: 'Box entry not found' });
    }
    res.status(200).json(boxEntry);
}

export async function updateBoxEntry(req: any, res: any) {
    const user = req.decoded.pennkey;
    const id = req.params.id;
    console.log(`Updating box entry ${id} for user: ${user} with data:`, req.body);
    
    const boxEntryData = req.body;
    const validated = UpdateBoxEntry.safeParse(boxEntryData);
    if (!validated.success) {
        return res.status(400).json({ code: "BAD_REQUEST", message: 'Invalid box entry data', details: validated.error.issues });
    }
    const success = await updateBoxEntryDAO(user, id, boxEntryData);
    if (!success) {
        return res.status(404).json({ code: "BAD_REQUEST", message: 'Box entry not found' });
    }
    res.status(200).json({ message: 'Box entry updated successfully' });
}

export async function deleteBoxEntry(req: any, res: any) {
    const user = req.decoded.pennkey;
    const id = req.params.id;
    console.log(`Deleting box entry ${id} for user: ${user}`);

    const success = await deleteBoxEntryDAO(user, id);
    if (!success) {
        return res.status(404).json({ code: "NOT_FOUND", message: 'Box entry not found' });
    }
    res.status(200).json({ message: 'Box entry deleted successfully' });
}

export async function deleteAllBoxEntries(req: any, res: any) {
    const user = req.decoded.pennkey;
    
    await deleteAllBoxEntriesDAO(user);
    res.status(204).json({ message: 'All box entries deleted successfully' });
}