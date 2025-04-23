import FollowerSnapshot from '../db-models/follower-snapshot.js';

// Save a snapshot
export async function saveSnapshot(userId, followers) {
  return FollowerSnapshot.create({ userId, followers });
}

// Get history for a user
export async function getHistory(userId) {
  return FollowerSnapshot.find({ userId }).sort('-snapshotDate').exec();
}
