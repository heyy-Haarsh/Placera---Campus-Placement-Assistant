/**
 * Appends the two real Barclays PICT experiences (Ketan Bajaj + Tirthraj Mahajan).
 * Run: node seedBarclaysReal.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-assistant';

const ExperienceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  author: { type: String, default: 'Anonymous' },
  authorInit: { type: String, default: 'A' },
  college: { type: String, default: '' },
  company: { type: String, required: true },
  role: { type: String, required: true },
  ctc: { type: String, default: '' },
  verdict: { type: String, default: 'selected' },
  type: { type: String, default: 'placement' },
  campus: { type: String, default: 'oncampus' },
  diff: { type: String, default: 'med' },
  rounds: [{ name: String, desc: String, questions: String }],
  advice: { type: String, default: '' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  voters: { type: Map, of: String, default: {} },
  bookmarks: { type: [String], default: [] },
  comments: { type: Number, default: 0 },
}, { timestamps: true });

const NEW_ENTRIES = [
  // ── Ketan Bajaj — via Hack-o-Hire (direct interview, no OA) ───────────────
  {
    author: 'Ketan Bajaj', authorInit: 'K', college: 'PICT Pune',
    company: 'Barclays', role: 'Summer Intern (SDE)', ctc: '1L/mo',
    verdict: 'intern', type: 'internship', campus: 'oncampus', diff: 'med', upvotes: 214,
    advice: 'I got a direct interview through Barclays Hack-o-Hire 2024 — my team ranked top 27 among 1250+ teams. This skipped the OA entirely. Key prep: be ready to deep-dive every project on your resume (architecture, trade-offs, tech stack choices). Know Java and Spring Boot since Barclays uses them heavily. Behavioral questions focus heavily on teamwork and handling challenges. No DSA/SQL was asked in my rounds — they cared more about your mindset, project understanding, and how you think about real problems.',
    rounds: [
      {
        name: 'Hack-o-Hire 2024 — Shortlisting',
        desc: 'Barclays annual hackathon for 2nd and 3rd year students. My team of 3 ranked top 27 out of 1250+ teams, which earned us a direct interview bypassing the OA. Got confirmation 2 months before interview date — used that time fully for prep.',
        questions: '',
      },
      {
        name: 'Round 1 — Technical Interview (VP @ Barclays)',
        desc: 'Offline, ~35 minutes. Interviewer was a VP. No DSA or SQL was asked — unusual for a tech interview. Discussion points: (1) Detailed project walkthrough — why I chose each tech stack, what problems they solved, architectural decisions and trade-offs. (2) Database design choices — what measures I would take if migrating to a different database. (3) OOP principles and real-world applications from my projects. (4) Interest in Java and Spring Boot — Barclays uses Java heavily, explained my familiarity and plans to deepen expertise. (5) Hack-o-Hire experience — my role, contributions, challenges faced and how we overcame them.',
        questions: 'Why this tech stack for your project?, Database migration strategy, OOP principles in real-world applications, Java and Spring Boot experience, Your role and challenges in Hack-o-Hire',
      },
      {
        name: 'Round 2 — Tech + HR Interview (VP @ Barclays)',
        desc: 'Offline, ~1 hour 30 minutes. Another VP. Comprehensive round covering: (1) Project deep-dive — why I built them, real-world problems solved. Interviewer appreciated business-oriented thinking. (2) DSA in real life — sorting algorithms and their real-world applications, Traveling Salesman Problem (I honestly admitted I had not solved it yet but was actively learning). He appreciated enthusiasm to learn. (3) SQL — I mentioned completing SQL 50 on LeetCode. (4) Hack-o-Hire system design — app architecture, database design decisions. (5) Behavioral — teamwork and problem-solving: (a) A time when a colleague and I had different solutions to the same problem. (b) How I handle too many tasks at the same time. Assessed ability to handle pressure and teamwork in corporate environment.',
        questions: 'What real-world problem does your project solve?, Sorting algorithms real-world applications, Traveling Salesman Problem (conceptual), SQL 50 LeetCode approach, Hack-o-Hire: system and database architecture, Different solutions with colleague (STAR), Handling multiple tasks simultaneously',
      },
    ],
  },

  // ── Tirthraj Mahajan — OA + Technical + HR ────────────────────────────────
  {
    author: 'Tirthraj Mahajan', authorInit: 'T', college: 'PICT Pune',
    company: 'Barclays', role: 'SDE Intern', ctc: '1L/mo',
    verdict: 'intern', type: 'internship', campus: 'oncampus', diff: 'med', upvotes: 176,
    advice: 'Almost all technical questions (except Java) were based on keywords in my resume — so know everything you have written. Strong Java focus across all interviews: String Constant Pool, OOP, Inheritance, Reflections. Know RESTful APIs, gRPC, WebSockets, microservices vs monolith. SQL: know ORDER BY without OFFSET for nth highest. The HR round tests teamwork, leadership, and proactiveness in real corporate scenarios — not just standard behavioral. Practice the "manager not giving tasks" scenario — shows your proactiveness.',
    rounds: [
      {
        name: 'Round 1 — Online Assessment (HackerEarth)',
        desc: 'Duration 1.5 hours. Structure: (1) 12 MCQ questions covering OOP, Java, Exception Handling, DSA, DBMS — difficulty Easy. (2) 2 Coding questions: one SQL-based question, one DSA question on String Manipulation — difficulty Easy to Medium. Straightforward OA compared to other companies. Focus on getting all MCQs right.',
        questions: 'SQL query (string manipulation related), DSA: String manipulation coding, OOP MCQs (Java), Exception handling MCQs, DBMS basic MCQs',
      },
      {
        name: 'Round 2 — Technical Interview (60 min, resume-based)',
        desc: 'Majorly resume-based — nearly all questions except Java ones came from keywords in my resume. Common Java pattern across all interviews. Questions covered: API & Networking: RESTful APIs definition, HTTP verbs and status codes (GET200, POST201, PUT200, DELETE204, 4xx/5xx), idempotency in API requests (GET/PUT idempotent, POST not), gRPC vs HTTP (Protocol Buffers binary vs text, HTTP/2, bidirectional streaming), why gRPC faster, WebSockets (full-duplex, upgrade mechanism). Databases: SQL vs NoSQL — when to choose each, execution order of SQL SELECT (FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT), second-highest marks without OFFSET (correlated subquery or MAX with exclusion). System Design: microservices vs monolith. Java & OOP: String Constant Pool in Java (heap vs SCP, == vs .equals()), Inheritance/Abstract Class/Interface differences, Java Reflection API, different loop types. Cloud: cloud providers, AWS services. Project-specific: image processing project in resume.',
        questions: 'RESTful APIs definition, HTTP verbs and status codes, Idempotency (GET/PUT idempotent POST not), gRPC vs HTTP (Protocol Buffers/HTTP2/streaming), WebSockets full-duplex upgrade, SQL vs NoSQL when to use, SQL SELECT execution order, 2nd highest marks without OFFSET, Microservices vs monolith, Java String Constant Pool (heap vs SCP == vs equals), Inheritance vs Abstract Class vs Interface, Java Reflection API, AWS services, Image processing project deep-dive',
      },
      {
        name: 'Round 3 — HR Interview (30 min)',
        desc: 'Not standard behavioral — tested teamwork, leadership, and proactiveness in corporate scenarios. Questions: (1) Self-introduction + interview reflection. (2) Teamwork/Leadership: group project team formation, ethical dilemma — "Did any team member deserve more credit due to unique contribution, or should all be treated equally? Follow-up: If your team won an award, what would you say in acceptance speech?" Tests individual-vs-team priority thinking. (3) Time & Deadline Management: how do you manage deadlines? Scenario: "Teammate not contributing and deadline is near — how do you handle it?" Follow-up: "How would you prevent this from happening?" (4) Problem-Solving & Proactiveness (most important): "You get selected for internship but your team and manager are not giving you tasks. You only have a few months. What would you do?" Follow-up: "You want to fix an issue but do not know where to start and manager/team are too busy — what do you do?"',
        questions: 'Team credit distribution ethical dilemma, Award acceptance speech (team vs individual), Deadline management approach, Handling non-contributing teammate (STAR), Preventing team issues proactively, Self-initiated learning when no tasks (proactiveness), Fixing issue independently without manager guidance',
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  const Experience = mongoose.model('Experience', ExperienceSchema);
  let added = 0;
  for (const entry of NEW_ENTRIES) {
    const exists = await Experience.findOne({ company: entry.company, author: entry.author });
    if (exists) {
      console.log(`  Skip  ${entry.company} by ${entry.author} (exists)`);
    } else {
      await Experience.create(entry);
      console.log(`  Added ${entry.company} — ${entry.role} by ${entry.author}`);
      added++;
    }
  }
  console.log(`\nDone! Added ${added} new experiences.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
