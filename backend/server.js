const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const mockArenaRoutes = require('./routes/mockArenaRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const Experience = require('./models/Experience');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// ── Socket.io — works locally AND after deployment ──────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Middleware
app.use(cors());
app.use(express.json());

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/mock-arena', mockArenaRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/stats', require('./routes/statsRoutes'));

// ── REST: fetch message history for a room ───────────────────────
app.get('/api/chat/:room', async (req, res) => {
  try {
    const msgs = await Message.find({ room: req.params.room })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();
    res.json({ messages: msgs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Socket.io event handling ─────────────────────────────────────
io.on('connection', (socket) => {
  console.log('[socket] connected:', socket.id);

  // Join a room (company-channel), receive last 50 messages
  socket.on('join_room', async ({ room, username, userInit, role, userId }) => {
    socket.join(room);
    socket.data = { room, username: username || 'Anonymous', userInit: userInit || 'A', role: role || 'student', userId: userId || 'anon' };

    try {
      const history = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit('history', history.reverse());
    } catch (e) {
      socket.emit('history', []);
    }

    // Broadcast that someone joined
    socket.to(room).emit('user_joined', { username: socket.data.username });
  });

  // Leave room
  socket.on('leave_room', ({ room }) => {
    socket.leave(room);
  });

  // Send message
  socket.on('send_message', async ({ room, text }) => {
    if (!text?.trim()) return;
    const { username, userInit, role, userId } = socket.data || {};
    try {
      const msg = await Message.create({
        room,
        userId: userId || 'anon',
        username: username || 'Anonymous',
        userInit: userInit || 'A',
        role: role || 'student',
        text: text.trim().slice(0, 2000),
      });
      // Broadcast to everybody in the room (including sender)
      io.to(room).emit('new_message', msg);
    } catch (e) {
      console.error('[socket] send_message error:', e.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('[socket] disconnected:', socket.id);
  });
});

// ── MongoDB Connection ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-assistant';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Seed demo experiences if empty
    const count = await Experience.countDocuments();
    if (count === 0) {
      await Experience.insertMany([
        { author: 'Riya Desai', authorInit: 'R', college: 'IIT Bombay', company: 'Google', role: 'SDE II', ctc: '48 LPA', verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'hard', upvotes: 312, advice: 'Practice explaining your design decisions aloud. Know CAP theorem cold. For Googleyness, have 3-4 STAR stories.', rounds: [{ name: 'Phone Screen', desc: 'Trees + DP. Two medium/hard problems.', questions: 'Serialize/Deserialize Binary Tree, Coin Change variant' }, { name: 'System Design', desc: 'Distributed rate limiter at Google scale.', questions: 'Design rate limiter, CAP trade-offs, Redis cluster' }, { name: 'Googleyness', desc: 'Behavioral round — STAR stories.', questions: '' }] },
        { author: 'Karan Mehta', authorInit: 'K', college: 'NIT Trichy', company: 'Meta', role: 'SWE E4', ctc: '52 LPA', verdict: 'rejected', type: 'placement', campus: 'offcampus', diff: 'hard', upvotes: 287, advice: 'Know the celebrity problem in feed design. LeetCode Hard is real. Compartmentalize bad rounds.', rounds: [{ name: 'Phone Screen', desc: 'Sliding window hard problem.', questions: 'Minimum subarray with sum >= K (with negatives)' }, { name: 'System Design', desc: 'Instagram feed — missed fanout details.', questions: 'Design Instagram feed, fan-out problem' }] },
        { author: 'Priya Nair', authorInit: 'P', college: 'BITS Pilani', company: 'Amazon', role: 'SDE I', ctc: '28 LPA', verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'med', upvotes: 245, advice: 'Prepare 10+ STAR stories for Leadership Principles. Bar Raiser can veto. Quantify impact.', rounds: [{ name: 'Online Assessment', desc: 'BFS + string problems + work simulation.', questions: '' }, { name: 'Bar Raiser', desc: 'Hard coding + deep LP dive.', questions: 'Knapsack variant, Ownership LP' }] },
        { author: 'Saurabh K', authorInit: 'S', college: 'DTU Delhi', company: 'Microsoft', role: 'SWE', ctc: '32 LPA', verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'med', upvotes: 198, advice: 'Microsoft values communication. OOP and LLD are tested more than FAANG. AA round is conversational.', rounds: [{ name: 'Technical Round 1', desc: 'String manipulation + OOP (parking lot).', questions: '' }, { name: 'As-Appropriate Round', desc: 'Principal engineer from Azure. Senior coffee chat.', questions: '' }] },
        { author: 'Aanya Rao', authorInit: 'A', college: 'VIT Vellore', company: 'Flipkart', role: 'SDE Intern', ctc: '1.2L/mo', verdict: 'intern', type: 'internship', campus: 'oncampus', diff: 'easy', upvotes: 176, advice: 'Flipkart intern process is entry-level friendly. Volunteer for cross-team projects for conversion.', rounds: [{ name: 'CodeNation Test', desc: '2 DSA problems — easy/medium.', questions: '' }, { name: 'Technical Interview', desc: 'Recursion + DP fundamentals.', questions: '' }] },
        { author: 'Dev Sharma', authorInit: 'D', college: 'IIT Madras', company: 'Stripe', role: 'Platform Engineer', ctc: '55 LPA', verdict: 'rejected', type: 'placement', campus: 'offcampus', diff: 'hard', upvotes: 167, advice: 'Codelab is make-or-break — write tests. Always discuss idempotency keys in payment design.', rounds: [{ name: 'Codelab', desc: 'Build feature in real payments codebase with tests.', questions: '' }, { name: 'System Design', desc: 'Payment processing with idempotency and retries.', questions: '' }] },
        { author: 'Meera Joshi', authorInit: 'M', college: 'IIT Delhi', company: 'Uber', role: 'Software Engineer', ctc: '38 LPA', verdict: 'selected', type: 'placement', campus: 'offcampus', diff: 'med', upvotes: 203, advice: 'Uber moves fast — recruiter to offer in 12 days. Very collaborative interviewers.', rounds: [{ name: 'Phone Screen', desc: 'Medium-level coding problem.', questions: '' }, { name: 'System Design', desc: 'Distributed systems and behavioral.', questions: '' }] },
        { author: 'Rohan Verma', authorInit: 'R', college: 'IIT Kharagpur', company: 'Atlassian', role: 'Software Dev', ctc: '42 LPA', verdict: 'selected', type: 'placement', campus: 'offcampus', diff: 'med', upvotes: 142, advice: 'Atlassian does a values interview. They want good code structure and communication over raw speed.', rounds: [{ name: 'Values Interview', desc: 'Craft, Execution, Courage, Open Company.', questions: '' }, { name: 'Technical', desc: 'Challenging but fair — code structure matters.', questions: '' }] },
      ]);
      console.log('Seeded demo experiences');
    }

    httpServer.listen(PORT, () => {
      console.log(`Server + Socket.io running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
