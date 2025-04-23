import { getGithubRawData } from '../data/github-data.js';
import { getHistory, saveSnapshot } from './history-service.js';

//validate raw data
export const getUserFollowers = async (userId) => {
  const rawData = await getGithubRawData(userId);
  if (!Array.isArray(rawData)) {
    const err = new Error('Unexpected response from Github');
    err.status = 502;
    throw err;
  }
  //check if user already exist in our db
  const userExist = await getHistory(userId);

  //populate newUser prop to false if already exist
  if (userExist) {
    return rawData.map((user) => ({
      id: user.id,
      name: user.login,
      newUser: false,
    }));
  }

  const formattedData = rawData.map((user) => ({
    id: user.id,
    name: user.login,
  }));
  //doesn't exist add the data to our db
  await saveSnapshot(userId, formattedData);

  //return data with flag newUser set to true

  return formattedData.map((x) => ({ ...x, newUser: true }));
};
