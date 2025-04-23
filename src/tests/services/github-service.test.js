import axios from 'axios';
import { getUserFollowers } from '../../services/github-service';

describe('Github services test', () => {
  it('throws on non-array response', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {},
    });
    await expect(getUserFollowers('octocat')).rejects.toThrow(
      'Unexpected response from Github'
    );
    axios.get.mockRestore();
  });

  it('transforms raw data correctly', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: [
        { id: 1, login: 'dil' },
        { id: 2, login: 'diloo' },
      ],
    });

    const result = await getUserFollowers('octocat');
    expect(result).toEqual([
      { id: 1, name: 'dil' },
      { id: 2, name: 'diloo' },
    ]);
    axios.get.mockRestore();
  });
});
