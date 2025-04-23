import request from 'supertest';
import express from 'express';
import { followerRouter } from '../../api/followers.js';
import * as service from '../../services/github-service.js';
import rateLimiter from '../../middlewares/rate-limiter.js';

const app = express();
app.use(express.json());
// app.use(rateLimiter);
app.use('/api', followerRouter);

describe('GET /api/followers/:userId', () => {
  it('returns 400 if the follower response doent match response schema', async () => {
    jest.spyOn(service, 'getUserFollowers').mockResolvedValueOnce([
      { id: 1, prop: 'dil' },
      { id: 2, prop: 'dilo' },
    ]);

    const res = await request(app).get('/api/followers/octocat');
    expect(res.status).toBe(400);
    expect(res).toHaveProperty('error');
    service.getUserFollowers.mockRestore();
  });

  it('returns 200 and follower list', async () => {
    jest.spyOn(service, 'getUserFollowers').mockResolvedValueOnce([
      { id: 1, name: 'dil' },
      { id: 2, name: 'dilo' },
    ]);

    const res = await request(app).get('/api/followers/octocat');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      count: 2,
      followers: [
        { id: 1, name: 'dil' },
        { id: 2, name: 'dilo' },
      ],
    });
    service.getUserFollowers.mockRestore();
  });

  it('returns 400 for invalid userId', async () => {
    const res = await request(app).get('/api/followers/subash!');
    expect(res.status).toBe(400);
    expect(res).toHaveProperty('error');
  });
});
