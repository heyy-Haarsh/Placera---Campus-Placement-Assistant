/**
 * Seed demo + Barclays experiences:
 *   node seedExperiences.js
 * Safe to re-run — skips duplicates by (company + author).
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-assistant';

const ExperienceSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  author:    { type: String, default: 'Anonymous' },
  authorInit:{ type: String, default: 'A' },
  college:   { type: String, default: '' },
  company:   { type: String, required: true },
  role:      { type: String, required: true },
  ctc:       { type: String, default: '' },
  verdict:   { type: String, default: 'selected' },
  type:      { type: String, default: 'placement' },
  campus:    { type: String, default: 'oncampus' },
  diff:      { type: String, default: 'med' },
  rounds:    [{ name: String, desc: String, questions: String }],
  advice:    { type: String, default: '' },
  upvotes:   { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  voters:    { type: Map, of: String, default: {} },
  bookmarks: { type: [String], default: [] },
  comments:  { type: Number, default: 0 },
}, { timestamps: true });

const SEED_DATA = [
  // ── Google ─────────────────────────────────────────────────────────────────
  {
    author: 'Riya Desai', authorInit: 'R', college: 'IIT Bombay',
    company: 'Google', role: 'SDE II', ctc: '48 LPA',
    verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'hard', upvotes: 312,
    advice: 'Practice explaining your design decisions aloud — reasoning matters as much as the answer. Know CAP theorem cold. For Googleyness, have 3-4 STAR stories that map to multiple values.',
    rounds: [
      { name: 'Phone Screen — DSA', desc: 'Two medium/hard problems: Serialize/Deserialize Binary Tree and DP Coin Change variant.', questions: 'Serialize/Deserialize Binary Tree, Coin Change variant' },
      { name: 'Onsite — Coding', desc: "Graph problem: detect cycle in directed graph + topological sort. Follow-up: Kosaraju's SCC.", questions: 'Cycle detection, Topological sort, Kosaraju SCC' },
      { name: 'Onsite — System Design', desc: 'Distributed rate limiter at Google scale. Redis cluster, failure modes, leader election.', questions: 'Distributed rate limiter, CAP trade-offs' },
      { name: 'Googleyness & Leadership', desc: 'Times you disagreed with a decision, handled ambiguity, worked across teams.', questions: '' },
    ],
  },
  // ── Meta ───────────────────────────────────────────────────────────────────
  {
    author: 'Karan Mehta', authorInit: 'K', college: 'NIT Trichy',
    company: 'Meta', role: 'SWE E4', ctc: '52 LPA',
    verdict: 'rejected', type: 'placement', campus: 'offcampus', diff: 'hard', upvotes: 287,
    advice: 'Know the celebrity problem in feed design — hybrid push/pull is meta wants. LeetCode Hard is real. Do not let one bad round affect the next round.',
    rounds: [
      { name: 'Phone Screen', desc: 'Sliding window variant: minimum length subarray with sum >= K with negatives.', questions: 'Minimum subarray sum >= K (with negatives), Prefix sums + deque' },
      { name: 'Onsite Coding 1', desc: 'Merge intervals extension + rotated sorted array search.', questions: 'Merge intervals, Rotated array search' },
      { name: 'System Design', desc: 'Instagram feed — missed fanout details for celebrities. Should have discussed hybrid push/pull.', questions: 'Design Instagram feed, Fan-out problem, Hybrid push/pull' },
      { name: 'Behavioral', desc: 'Meta values: Move Fast, Be Bold. Had solid stories but was rattled after SD round.', questions: '' },
    ],
  },
  // ── Amazon ─────────────────────────────────────────────────────────────────
  {
    author: 'Priya Nair', authorInit: 'P', college: 'BITS Pilani',
    company: 'Amazon', role: 'SDE I', ctc: '28 LPA',
    verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'med', upvotes: 245,
    advice: "Prepare 10+ STAR stories mapped to Amazon's 16 Leadership Principles. Bar Raiser can veto the offer. Quantify impact in every LP answer.",
    rounds: [
      { name: 'Online Assessment', desc: 'Two medium coding problems + work simulation section.', questions: 'BFS variant, String manipulation' },
      { name: 'Technical Round 1', desc: 'Binary tree diameter + custom linked list problem.', questions: 'Binary tree diameter, Linked list manipulation' },
      { name: 'Bar Raiser', desc: 'Senior interviewer from different team. Hard coding + deep LP dive.', questions: 'Graph hard problem, Ownership LP stories' },
    ],
  },
  // ── Microsoft ──────────────────────────────────────────────────────────────
  {
    author: 'Saurabh K', authorInit: 'S', college: 'DTU Delhi',
    company: 'Microsoft', role: 'SWE', ctc: '32 LPA',
    verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'med', upvotes: 198,
    advice: 'Microsoft values communication — explain every step. OOP and LLD are tested more than at FAANG. The AA round is a senior coffee chat — be curious.',
    rounds: [
      { name: 'Technical Round 1', desc: 'String manipulation + OOP design (parking lot). They care about clean code.', questions: 'String manipulation, Design parking lot' },
      { name: 'Technical Round 2', desc: 'Shortest path with constraints + mini system design: notification service.', questions: 'Shortest path variants, Notification service' },
      { name: 'As-Appropriate (AA) Round', desc: 'Principal engineer from Azure team. Senior coffee chat. Offer in 5 business days.', questions: '' },
    ],
  },
  // ── Flipkart ───────────────────────────────────────────────────────────────
  {
    author: 'Aanya Rao', authorInit: 'A', college: 'VIT Vellore',
    company: 'Flipkart', role: 'SDE Intern', ctc: '1.2L/mo',
    verdict: 'intern', type: 'internship', campus: 'oncampus', diff: 'easy', upvotes: 176,
    advice: 'Flipkart intern process is entry-level friendly — focus on fundamentals. Volunteer for cross-team projects during internship for conversion.',
    rounds: [
      { name: 'CodeNation Test', desc: '2 DSA problems — easy-medium. Arrays and strings focus.', questions: 'Array problems, String manipulation' },
      { name: 'Technical Interview', desc: 'Recursion + DP fundamentals. Friendly — value clarity over speed.', questions: 'Recursion, DP basics' },
    ],
  },
  // ── Stripe ─────────────────────────────────────────────────────────────────
  {
    author: 'Dev Sharma', authorInit: 'D', college: 'IIT Madras',
    company: 'Stripe', role: 'Platform Engineer', ctc: '55 LPA',
    verdict: 'rejected', type: 'placement', campus: 'offcampus', diff: 'hard', upvotes: 167,
    advice: 'The Codelab is make-or-break — write tests, handle edge cases. Always discuss idempotency keys and retry logic for payment systems.',
    rounds: [
      { name: 'Technical Phone Screen', desc: 'Live coding on CoderPad. Two medium problems + past system architecture discussion.', questions: 'Two medium LeetCode, System architecture' },
      { name: 'Codelab Round', desc: 'Unique to Stripe: add a feature to real-ish payments codebase. Expected tests, docs, clean code.', questions: 'Payment feature implementation with tests' },
      { name: 'System Design', desc: 'Design payment processing with idempotency, retries, and double-charge prevention.', questions: 'Payment system design, Idempotency keys' },
    ],
  },
  // ── Uber ───────────────────────────────────────────────────────────────────
  {
    author: 'Meera Joshi', authorInit: 'M', college: 'IIT Delhi',
    company: 'Uber', role: 'Software Engineer', ctc: '38 LPA',
    verdict: 'selected', type: 'placement', campus: 'offcampus', diff: 'med', upvotes: 203,
    advice: 'Uber moves fast — recruiter to offer in 12 days. Study consistent hashing, geospatial indexing, and surge pricing architecture.',
    rounds: [
      { name: 'Phone Screen', desc: 'Medium-level coding on geospatial data structures.', questions: 'Geospatial nearest driver query' },
      { name: 'System Design', desc: 'Design Uber surge pricing. Consistent hashing for driver assignment.', questions: 'Surge pricing design, Consistent hashing' },
      { name: 'Behavioral', desc: 'Impact, ownership, cross-functional collaboration stories.', questions: '' },
    ],
  },
  // ── Atlassian ──────────────────────────────────────────────────────────────
  {
    author: 'Rohan Verma', authorInit: 'R', college: 'IIT Kharagpur',
    company: 'Atlassian', role: 'Software Dev', ctc: '42 LPA',
    verdict: 'selected', type: 'placement', campus: 'offcampus', diff: 'med', upvotes: 142,
    advice: 'Atlassian does a values interview — Craft, Execution, Courage, Open Company. Good code structure and communication beats raw speed.',
    rounds: [
      { name: 'Values Interview', desc: 'Very structured. Have stories for each Atlassian value.', questions: '' },
      { name: 'Technical Round', desc: 'Challenging but fair — code structure and communication matter most.', questions: 'OOP design, API design patterns' },
    ],
  },

  // ━━━ BARCLAYS (PICT Campus Experiences) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    author: 'Aditi Kulkarni', authorInit: 'A', college: 'PICT Pune',
    company: 'Barclays', role: 'Graduate Software Engineer', ctc: '9 LPA',
    verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'med', upvotes: 189,
    advice: 'Know Barclays RISES values (Respect, Integrity, Service, Excellence, Stewardship) inside out — every HR question maps to one of these. Brush up on DBMS, OOPs and OS thoroughly. Be very confident about your projects — they go deep into every line. Attend their PPT session; VPs give real hints about what they look for.',
    rounds: [
      {
        name: 'Resume Shortlisting',
        desc: 'CGPA cutoff 7.0+. 10th/12th above 60%. Strict no-active-backlogs policy. Around 80 students shortlisted from ~300 applicants.',
        questions: '',
      },
      {
        name: 'Online Assessment — HackerEarth',
        desc: '90 minute test. Section 1: 30 MCQs on OOPs (Java code output prediction), DBMS (normalization, transactions), OS (scheduling), Data Structures. Section 2: 2 SQL queries — one filtering with GROUP BY and HAVING, one multi-table JOIN. Section 3: 2 coding problems — Second Largest in Array (O(n) approach) and Max Sum Subarray of size K (sliding window). Cut-off approximately 65%.',
        questions: 'Second largest element in array, Max sum subarray of size k (sliding window), SQL GROUP BY + HAVING (aggregation), SQL multi-table JOIN, OOPs output prediction Java, DBMS normalization MCQs (1NF/2NF/3NF)',
      },
      {
        name: 'Pre-Placement Talk (PPT)',
        desc: "Interactive session by Barclays VP and HR team. They covered technology stack (Java, Python, AWS, Kubernetes) and agile development process. Emphasized RISES values throughout. Showed career growth path from Analyst to VP. Highly recommend attending — panelists often become your interviewers and they remember engaged students.",
        questions: '',
      },
      {
        name: 'Technical + HR Interview (Combined)',
        desc: 'Conducted by a VP-level interviewer (~75 minutes). Started with "Tell me about yourself" then immediately deep-dived into my final-year ML project (fraud detection system). Drew full system architecture on paper. Asked why I chose specific algorithms and how I handled edge cases. Technical: 4 pillars of OOPs with real banking examples (encapsulation in ATM, polymorphism in payment types), process vs thread with context switching, deadlock: 4 Coffman conditions + prevention strategies, write SQL to find employees earning more than department average salary. Behavioral: describe a team conflict using STAR method (tie to RISES), why do you want to work at a bank vs a startup. Final: any questions for me?',
        questions: '4 pillars of OOPs with banking real-life examples, Process vs Thread (context switching), Deadlock — 4 Coffman conditions + prevention, SQL: employees earning > department average, Merge sort (explain + pseudocode), Why Barclays / RISES values alignment, Team conflict STAR story',
      },
    ],
  },
  {
    author: 'Prathamesh Desai', authorInit: 'P', college: 'PICT Pune',
    company: 'Barclays', role: 'Technology Analyst', ctc: '9.5 LPA',
    verdict: 'selected', type: 'placement', campus: 'oncampus', diff: 'med', upvotes: 156,
    advice: "Interview is very resume-driven at Barclays — do not put anything you can't explain for 15 minutes. SQL is very important: practice joins, subqueries, and window functions. Know clustered vs non-clustered indexes. For behavioral, use STAR method and tie back to RISES values every time.",
    rounds: [
      {
        name: 'Online Assessment',
        desc: '30 MCQs covering OOPs, DBMS, Computer Networks, OS and DS theory. 2 SQL problems (moderate difficulty — aggregation and join). 2 coding problems. Scored ~75/100. Cut-off ~65%.',
        questions: 'Array rotation, Count distinct characters in string, SQL JOIN with WHERE conditions, ACID properties MCQs, OS CPU scheduling algorithm questions (FCFS/SJF/Round Robin)',
      },
      {
        name: 'Technical Round 1 — Core CS',
        desc: '~45 min with a senior developer. Project: I had built a microservices app in Java Spring Boot. Asked: why REST over SOAP, how did you implement authentication (JWT — explained the token lifecycle), what is the difference between authentication and authorization. Then CS: polymorphism with a banking example (different payment methods overriding a process() method), write Floyd\'s cycle detection algorithm in a linked list, what is indexing in DBMS and when would you NOT use an index (small tables, high write frequency, low selectivity).',
        questions: "Polymorphism in banking context (payment types), Floyd's cycle detection algorithm (code), Database indexing — when NOT to use, REST vs SOAP key differences, JWT authentication token lifecycle, Stack vs Heap memory, Clustered vs non-clustered index",
      },
      {
        name: 'HR Round',
        desc: 'Conversational and relaxed (~30 min). Standard HR questions framed around RISES values. Keep "Tell me about yourself" under 2 minutes — end with why Barclays. "Where do you see yourself in 5 years?" — technical lead at a fintech company. "Why Barclays over other offers?" — mention technology innovation in banking and global scale. "Describe a time you showed integrity." They also asked about location preferences (Mumbai/Pune/Chennai).',
        questions: 'Tell me about yourself (under 2 min), 5-year plan in fintech, Why Barclays vs startup, Integrity RISES example, Handling disagreement with manager (STAR), Location preference',
      },
    ],
  },
  {
    author: 'Sneha Patil', authorInit: 'S', college: 'PICT Pune',
    company: 'Barclays', role: 'Graduate Software Engineer', ctc: '9 LPA',
    verdict: 'rejected', type: 'placement', campus: 'oncampus', diff: 'med', upvotes: 124,
    advice: "I got rejected after the technical round. Key mistakes: (1) Could not explain project architecture clearly when pressed on scalability. (2) Fumbled on SQL self-join syntax. (3) Mixed up mutex and semaphore. Barclays interviewers go 3-4 levels deep on EVERYTHING — don't just learn surface-level. Practice saying your project out loud 10+ times. Fix these gaps before your interview: difference between primary key and unique key, how B-trees work in database indexing, what are transaction isolation levels.",
    rounds: [
      {
        name: 'Online Assessment',
        desc: 'Cleared comfortably — 78/100. MCQs on OOPs and OS. SQL: nth highest salary using OFFSET or correlated subquery. Coding: (1) Find all pairs in array with given sum using hash map O(n). (2) Check if binary tree is height-balanced using recursive approach.',
        questions: 'Pair sum in array (hash map O(n)), Height-balanced binary tree check (recursive), SQL nth highest salary (OFFSET / correlated subquery), Abstract class vs Interface (Java), OS virtual memory MCQs',
      },
      {
        name: 'Technical Interview',
        desc: '"How does your backend handle 10,000 concurrent users?" — I had no good answer (should have said: connection pooling, async processing, horizontal scaling, load balancer). SQL: write a query to find employees who earn more than their manager — I struggled with the self-join syntax. Then asked: what happens step-by-step when you type a URL in the browser — I covered DNS resolution, TCP handshake, HTTP request, but missed TLS/HTTPS handshake. Final question: what is the difference between mutex and semaphore — I mixed them up. Interviewer was patient throughout but I lost ground progressively.',
        questions: "Scalability: handling 10k concurrent users (connection pooling, load balancing, async), SQL self-join: employees earning > their manager's salary, URL to browser full flow: DNS/TCP/HTTPS/TLS/HTTP, Mutex vs Semaphore (key difference: mutex is ownership-based), Abstract class vs Interface Java (can't instantiate abstract), Deadlock 4 Coffman conditions",
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  const Experience = mongoose.model('Experience', ExperienceSchema);

  let added = 0;
  for (const entry of SEED_DATA) {
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
