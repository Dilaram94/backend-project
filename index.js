import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/followers/:userid', async (req, res) => {
  const { userid } = req.params;
  const githubUrl = `https://api.github.com/users/${userid}/followers`;

  try {
    const response = await axios.get(githubUrl);
    const followers = response.data;

    const followersData = followers.map((user) => ({
      name: user.login,
      id: user.id,
    }));

    res.json(followersData);
  } catch (error) {
    console.error('Error fetching followers:', error.message);
    res.status(500).json({ error: 'Failed to fetch followers from GitHub' });
  }
});

if (process.argv[1].endsWith('index.js')) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
