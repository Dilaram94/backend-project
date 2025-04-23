import mongoose from '../db/mongo.js';
const { Schema, model } = mongoose;

const followerSnapshotSchema = new Schema({
  userId: { type: String, required: true },
  followers: [{ id: Number, name: String }],
  snapshotDate: { type: Date, default: () => new Date() },
});

export default model('FollowerSnapshot', followerSnapshotSchema);
