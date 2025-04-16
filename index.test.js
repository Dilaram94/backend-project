import request from 'supertest';
import app from './index.js';
import axios from 'axios';

// Tell Jest to mock axios so we can simulate API responses.
jest.mock('axios');

describe('GET /followers/:userid', () => {
  // Clear any mocks between tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of followers with name and id when GitHub returns data', async () => {
    const mockFollowers = [
      { login: 'user1', id: 101 },
      { login: 'user2', id: 202 },
    ];

    // Simulate successful Axios call returning mock followers.
    axios.get.mockResolvedValueOnce({ data: mockFollowers });

    const response = await request(app).get('/followers/octocat');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      mockFollowers.map((user) => ({ name: user.login, id: user.id }))
    );
  });

  it('should return an empty array if GitHub returns an empty list', async () => {
    // Simulate a successful Axios call returning an empty array.
    axios.get.mockResolvedValueOnce({ data: [] });

    const response = await request(app).get('/followers/someuser');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return a 500 error when the GitHub API call fails', async () => {
    // Optionally, suppress console.error log during test.
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Simulate an error from Axios.
    axios.get.mockRejectedValueOnce(new Error('GitHub API error'));

    const response = await request(app).get('/followers/octocat');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      'error',
      'Failed to fetch followers from GitHub'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching followers:',
      'GitHub API error'
    );
    consoleSpy.mockRestore();
  });

  it('should handle non-array data from GitHub gracefully', async () => {
    // Simulate an unexpected format returned by GitHub (e.g. an object instead of an array).
    axios.get.mockResolvedValueOnce({ data: {} });

    const response = await request(app).get('/followers/octocat');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      'error',
      'Failed to fetch followers from GitHub'
    );
  });
});
