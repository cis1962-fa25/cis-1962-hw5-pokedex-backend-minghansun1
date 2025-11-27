import express from 'express';
import { listBoxEntries, createBoxEntry, getBoxEntryById, updateBoxEntry, deleteBoxEntry, deleteAllBoxEntries } from '../controllers/boxControllers.js';
const router = express.Router();

router.get('/', listBoxEntries);
router.post('/', createBoxEntry);
router.get('/:id', getBoxEntryById);
router.put('/:id', updateBoxEntry);
router.delete('/:id', deleteBoxEntry);
router.delete('/', deleteAllBoxEntries);

export default router;