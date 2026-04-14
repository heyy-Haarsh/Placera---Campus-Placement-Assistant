const Experience = require('../models/Experience');

// GET /api/experiences  — filterable list
async function listExperiences(req, res) {
  try {
    const { company, verdict, diff, type, campus, search, limit = 50, skip = 0 } = req.query;
    const query = {};
    if (company && company !== 'All') query.company = { $regex: company, $options: 'i' };
    if (verdict && verdict !== 'All') query.verdict = verdict.toLowerCase();
    if (diff && diff !== 'All') {
      const diffMap = { Easy: 'easy', Medium: 'med', Hard: 'hard', easy: 'easy', med: 'med', hard: 'hard' };
      query.diff = diffMap[diff] || diff;
    }
    if (type && type !== 'All') query.type = type.toLowerCase();
    if (campus && campus !== 'All') {
      const campusMap = { 'On-campus': 'oncampus', 'Off-campus': 'offcampus', oncampus: 'oncampus', offcampus: 'offcampus' };
      query.campus = campusMap[campus] || campus;
    }
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { advice: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const [experiences, total] = await Promise.all([
      Experience.find(query).sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit)),
      Experience.countDocuments(query),
    ]);

    res.json({ experiences, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/experiences/:id
async function getExperience(req, res) {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });
    res.json({ experience: exp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/experiences  — create
async function createExperience(req, res) {
  try {
    const { company, role, ctc, verdict, type, campus, diff, rounds, advice, author, authorInit, college, userId } = req.body;
    if (!company || !role) return res.status(400).json({ error: 'company and role are required' });

    const exp = await Experience.create({
      userId: userId || undefined,
      author: author || 'Anonymous',
      authorInit: authorInit || (author ? author[0].toUpperCase() : 'A'),
      college: college || '',
      company, role, ctc: ctc || '', verdict: verdict || 'selected',
      type: type || 'placement', campus: campus || 'oncampus', diff: diff || 'med',
      rounds: (rounds || []).map(r => ({ name: r.name || '', desc: r.desc || '', questions: r.questions || '' })),
      advice: advice || '',
    });
    res.status(201).json({ experience: exp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/experiences/:id/vote  — upvote / toggle
async function voteExperience(req, res) {
  try {
    const { userId, direction } = req.body; // direction: 'up' | 'down'
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });

    const key = userId || 'anon';
    const prev = exp.voters.get(key);

    if (prev === direction) {
      // toggle off
      exp.voters.delete(key);
      if (direction === 'up') exp.upvotes = Math.max(0, exp.upvotes - 1);
      else exp.downvotes = Math.max(0, exp.downvotes - 1);
    } else {
      // undo old vote if any
      if (prev === 'up') exp.upvotes = Math.max(0, exp.upvotes - 1);
      if (prev === 'down') exp.downvotes = Math.max(0, exp.downvotes - 1);
      // apply new
      exp.voters.set(key, direction);
      if (direction === 'up') exp.upvotes += 1;
      else exp.downvotes += 1;
    }
    exp.markModified('voters');
    await exp.save();
    res.json({ upvotes: exp.upvotes, downvotes: exp.downvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listExperiences, getExperience, createExperience, voteExperience };
