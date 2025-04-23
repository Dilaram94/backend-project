import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  followersRequestSchema,
  followersResponseSchema,
} from '../schemas/followers.js';
import { getUserFollowers } from '../services/github-service.js';

const followerRouter = Router();

followerRouter.get('/followers/:userId', auth, async (req, res, next) => {
  try {
    // validate request
    const { userId } = followersRequestSchema.parse({
      userId: req.params.userId,
    });

    //service layer i.e. fetch formatted data
    const followers = await getUserFollowers(userId);
    //response format
    const responseFormatted = { count: followers.length, followers };
    //validate response format
    followersResponseSchema.parse(responseFormatted);

    res.json(responseFormatted);
  } catch (err) {
    if (err.name === 'ZodError') {
      const message = err.errors.map(({ message }) => message).join('. ');
      err = new Error(message);
      err.status = 400;
    }
    next(err);
  }
});

export { followerRouter };
