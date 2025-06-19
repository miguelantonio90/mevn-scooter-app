const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27020/scooter-logs';

app.use(cors());
app.use(express.json());

const LogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  voltage: { type: Number, required: true },
  kmTravelled: { type: Number, required: true },
  notes: String
});

const Log = mongoose.model('Log', LogSchema);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/logs/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/logs/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
