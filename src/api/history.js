import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { getHistory, saveSnapshot } from '../services/history-service.js';
import { getUserFollowers } from '../services/github-service.js';

const historyRouter = Router();

// GET /api/history/:userId
historyRouter.get('/history/:userId', auth, async (req, res, next) => {
  try {
    const data = await getHistory(req.params.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/snapshot/:userId to trigger saving a new snapshot
historyRouter.post('/snapshot/:userId', auth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followers = await getUserFollowers(userId);
    const snap = await saveSnapshot(userId, followers);
    res.json(snap);
  } catch (err) {
    next(err);
  }
});

export { historyRouter };
