const REPOSITORY_SOURCES = [
  {
    name: 'modamaan/Ai-mock-Interview',
    type: 'question-bank',
    notes: 'Seed technical and behavioral prompts inspired by open-source mock interview patterns.',
  },
  {
    name: 'IliaLarchenko/Interviewer',
    type: 'voice-simulation',
    notes: 'Reference integration point for voice interview flow and interviewer persona behavior.',
  },
];

// ---------------------------------------------------------------------------
// Question bank — grouped by type AND difficulty so beginners get easy ones.
// Large pool ensures pickRandom() produces genuinely varied sessions each time.
// ---------------------------------------------------------------------------
const BASE_BANK = {
  technical: {
    easy: [
      'What is the difference between an array and a linked list? When would you use each?',
      'Can you explain what a variable is and how it is used in programming?',
      'What is the difference between a function and a method? Give a simple example.',
      'What does HTML stand for and what is its role in a web page?',
      'Can you explain what "responsive design" means in simple terms?',
      'What is the difference between frontend and backend development?',
      'What is a loop and why is it useful in programming?',
      'Explain what a database is and why applications need one.',
      'What is the difference between SQL and NoSQL databases?',
      'What does "API" stand for and how would you explain it to a friend?',
      'What is version control and why is Git important for developers?',
      'Can you explain what "debugging" means and how you typically approach it?',
      'What is the purpose of a CSS stylesheet in a website?',
      'Explain the difference between == and === in JavaScript.',
      'What is a REST API? Explain it like I am not a developer.',
      'What is a stack and a queue? Give a real-life analogy for each.',
      'What does "open source" software mean?',
      'Explain what a browser does when you type a URL and press Enter.',
    ],
    medium: [
      'Explain the time and space complexity of your approach to solving 2-sum.',
      'How would you optimize a slow database query in a student dashboard?',
      'How do you debug flaky frontend rendering bugs in React?',
      'What is the difference between synchronous and asynchronous programming?',
      'Describe the MVC architecture and give a practical example.',
      'What is a foreign key in SQL and when would you use it?',
      'Explain what CORS is and how to handle it in a web application.',
      'What is memoization and when should you use it?',
      'How does the event loop work in JavaScript?',
    ],
    hard: [
      'Implement an LRU cache and explain the trade-offs in your design.',
      'Design a REST API for campus placement drives with pagination and filtering.',
      'Explain consistent hashing and its role in distributed systems.',
      'What are the SOLID principles and how do they apply to real code?',
    ],
  },
  'system-design': {
    easy: [
      'How would you design a simple to-do list application? Walk me through the key components.',
      'If you had to build a basic contact book app, what features would it need?',
      'Describe how you would design a simple login and signup flow for a website.',
      'How would you design a basic chat feature for two users?',
      'What would a simple e-commerce product page system look like?',
      'How would you store and display user profile information in an app?',
      'If you had to build a URL shortener like bit.ly, what are the first things you would think about?',
      'How would you design a basic notification system that sends emails to users?',
      'What does a typical three-tier architecture (frontend, backend, database) look like?',
      'How would you design a basic file upload feature for a web app?',
    ],
    medium: [
      'Design a scalable notification system for placement updates and reminders.',
      'How would you design a low-latency leaderboard for mock interview scores?',
      'Design an architecture for a simple real-time interview feedback dashboard.',
      'How would you handle session management for a multi-user web app?',
      'Design a search feature for a campus job board with filters.',
    ],
    hard: [
      'Design a scalable interview scheduling platform for 100 colleges.',
      'Design an architecture for real-time interview feedback analytics at scale.',
      'How would you design a distributed job queue for background tasks?',
    ],
  },
  behavioral: {
    easy: [
      'Tell me about yourself and your interest in this field.',
      'Why did you choose your current course or branch of study?',
      'Describe a project you worked on that you are proud of.',
      'What do you enjoy most about programming or technology?',
      'Tell me about a time you learned something new quickly.',
      'How do you typically manage your time when you have multiple assignments due?',
      'Describe a situation where you helped a classmate or teammate.',
      'What motivates you to do your best work?',
      'Tell me about a hobby or interest outside of academics that has taught you something useful.',
      'Where do you see yourself in two to three years from now?',
      'How do you handle feedback or criticism on your work?',
      'Describe a challenge you faced during a group project and how you handled it.',
      'What kind of work environment do you prefer and why?',
      'Tell me about a time you made a mistake and what you learned from it.',
      'How do you stay updated with trends in technology?',
    ],
    medium: [
      'Tell me about a time you handled a tight deadline and competing priorities.',
      'Describe a project failure and what you changed afterward.',
      'How do you communicate complex technical ideas to non-technical stakeholders?',
      'Tell me about a conflict in your team and your resolution strategy.',
      'Describe a time you had to pick up a new skill quickly for a project.',
    ],
    hard: [
      'Tell me about a time you disagreed with a technical decision and how you handled it.',
      'Describe a situation where you had to influence someone without direct authority.',
      'How have you handled a situation where requirements changed mid-project?',
    ],
  },
};

const EXPERIENCE_DIFFICULTY = {
  beginner: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
};

function createQuestion(text, type, difficulty, index, source = 'seed') {
  return {
    // Add random suffix so questionId is unique even if same question text is picked
    questionId: `${type}_${index}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    prompt: text,
    difficulty,
    source,
    expectedSignals: type === 'behavioral'
      ? ['structured story', 'clear impact', 'ownership']
      : ['clarity', 'trade-off thinking', 'edge-case coverage'],
    followUps: [],
  };
}

function splitCount(total, mix) {
  const technical = Math.max(1, Math.round((mix.technical || 50) * total / 100));
  const systemDesign = Math.max(1, Math.round((mix.systemDesign || 25) * total / 100));
  const behavioral = Math.max(1, total - technical - systemDesign);
  return { technical, systemDesign, behavioral };
}

function pickRandom(arr, count) {
  const copy = [...arr];
  const selected = [];
  while (copy.length && selected.length < count) {
    const idx = Math.floor(Math.random() * copy.length);
    selected.push(copy.splice(idx, 1)[0]);
  }
  return selected;
}

// Build question pool for a given category + difficulty.
// 'easy' → only easy, 'medium' → easy + medium, 'hard' → all tiers
function getPoolForDifficulty(category, difficulty) {
  const cat = BASE_BANK[category];
  if (!cat) return [];
  if (difficulty === 'easy') return [...(cat.easy || [])];
  if (difficulty === 'medium') return [...(cat.easy || []), ...(cat.medium || [])];
  return [...(cat.easy || []), ...(cat.medium || []), ...(cat.hard || [])];
}

function getSeedQuestions({ experienceLevel = 'beginner', questionMix = {}, total = 8 }) {
  const difficulty = EXPERIENCE_DIFFICULTY[experienceLevel] || 'easy';
  const counts = splitCount(total, questionMix);

  const technical = pickRandom(getPoolForDifficulty('technical', difficulty), counts.technical)
    .map((q, i) => createQuestion(q, 'technical', difficulty, i + 1));
  const systemDesign = pickRandom(getPoolForDifficulty('system-design', difficulty), counts.systemDesign)
    .map((q, i) => createQuestion(q, 'system-design', difficulty, i + 1));
  const behavioral = pickRandom(getPoolForDifficulty('behavioral', difficulty), counts.behavioral)
    .map((q, i) => createQuestion(q, 'behavioral', difficulty, i + 1));

  return [...technical, ...systemDesign, ...behavioral];
}

module.exports = {
  REPOSITORY_SOURCES,
  getSeedQuestions,
};
