//data layer for fetching data with Github API
import axios from 'axios';
export const getGithubRawData = async (userId) => {
  const url = `https://api.github.com/users/${userId}/followers`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    const errMessage =
      err.response?.status === 404
        ? 'Github user doesnt exist'
        : 'Error fetching data from Github';
    const error = new Error(errMessage);
    error.status = err.response?.status || 500;
    throw error;
  }
};
