/**
 * seedChatMessages.js
 * Run: node seedChatMessages.js
 * Seeds demo messages into all company channels
 */
const mongoose = require('mongoose');
const Message  = require('./models/Message');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-assistant';

// ── Helper: minutes ago from now ──────────────────────────────────
function minsAgo(n) { return new Date(Date.now() - n * 60 * 1000); }
function hoursAgo(n) { return minsAgo(n * 60); }
function daysAgo(n)  { return hoursAgo(n * 24); }

// ── Demo messages per room ────────────────────────────────────────
const SEEDS = [

  /* ━━━━━━━━━━━━  GOOGLE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // google-general
  { room: 'google-general', username: 'Riya Desai',      userInit: 'R', role: 'senior', text: 'Hey everyone! 👋 Just got my Google SDE II offer confirmed. Happy to answer questions about the process!', createdAt: daysAgo(3) },
  { room: 'google-general', username: 'Arjun Sharma',    userInit: 'A', role: 'student', text: 'Congrats Riya!! 🎉 How many total rounds did you have?', createdAt: daysAgo(3) },
  { room: 'google-general', username: 'Riya Desai',      userInit: 'R', role: 'senior', text: '5 rounds — 1 phone screen, 2 coding, 1 system design, 1 Googleyness. The Googleyness round trips people up the most.', createdAt: daysAgo(3) },
  { room: 'google-general', username: 'Priya Nair',      userInit: 'P', role: 'student', text: 'How long did the whole process take from application to offer?', createdAt: daysAgo(3) },
  { room: 'google-general', username: 'Riya Desai',      userInit: 'R', role: 'senior', text: 'About 6 weeks. Recruiter call → phone screen → onsite loop. Offer came 5 days after the loop.', createdAt: daysAgo(3) },
  { room: 'google-general', username: 'Karan Mehta',     userInit: 'K', role: 'student', text: 'Does Google ask hard LC during phone screen or medium?', createdAt: hoursAgo(20) },
  { room: 'google-general', username: 'Riya Desai',      userInit: 'R', role: 'senior', text: 'Phone screen was 1 medium + 1 hard. Onsite coding rounds were both hard. Practice LC hard especially trees and graphs.', createdAt: hoursAgo(20) },
  { room: 'google-general', username: 'Dev Sharma',      userInit: 'D', role: 'student', text: 'What CTC did you get if you don\'t mind sharing?', createdAt: hoursAgo(8) },
  { room: 'google-general', username: 'Riya Desai',      userInit: 'R', role: 'senior', text: '48 LPA total comp. Base + joining bonus + ESOPs. Bangalore office.', createdAt: hoursAgo(8) },
  { room: 'google-general', username: 'Arjun Sharma',    userInit: 'A', role: 'student', text: 'That\'s incredible. Setting my sights on Google now 🔥', createdAt: hoursAgo(2) },

  // google-interview-prep
  { room: 'google-interview-prep', username: 'Riya Desai',   userInit: 'R', role: 'senior', text: '📌 **Google Prep Roadmap** (pinned)\n1. LC Hard: Trees, Graphs, DP\n2. System Design: Distributed systems, Rate limiters\n3. Googleyness: STAR stories for all 6 values', createdAt: daysAgo(5) },
  { room: 'google-interview-prep', username: 'Meera Joshi',  userInit: 'M', role: 'student', text: 'What resources do you recommend for system design?', createdAt: daysAgo(2) },
  { room: 'google-interview-prep', username: 'Riya Desai',   userInit: 'R', role: 'senior', text: 'Grokking System Design + Alex Xu\'s book + actual Google SRE book. Also read about Spanner, BigTable, and Chubby.', createdAt: daysAgo(2) },
  { room: 'google-interview-prep', username: 'Saurabh K',    userInit: 'S', role: 'student', text: 'Any tips for the Googleyness round specifically?', createdAt: hoursAgo(14) },
  { room: 'google-interview-prep', username: 'Riya Desai',   userInit: 'R', role: 'senior', text: 'Know Google\'s 6 values by heart. Map each STAR story to multiple values. The interviewer wants to know if you\'re genuinely "Googley" — collaborative and mission-driven, not just technically strong.', createdAt: hoursAgo(14) },
  { room: 'google-interview-prep', username: 'Priya Nair',   userInit: 'P', role: 'student', text: 'Solved 340 LC problems so far. Is that enough?', createdAt: hoursAgo(5) },
  { room: 'google-interview-prep', username: 'Riya Desai',   userInit: 'R', role: 'senior', text: 'Quality > quantity. 200 well-understood problems with clean solutions beats 500 problems copy-pasted. Focus on patterns: sliding window, monotonic stack, union-find, segment tree.', createdAt: hoursAgo(5) },

  // google-oa-discussion
  { room: 'google-oa-discussion', username: 'Karan Mehta',  userInit: 'K', role: 'student', text: 'Just gave the Google OA today. 2 problems — medium BFS and a hard DP. Got both but last DP was partial.', createdAt: daysAgo(1) },
  { room: 'google-oa-discussion', username: 'Arjun Sharma', userInit: 'A', role: 'student', text: 'Did they have a work simulation section like Amazon?', createdAt: daysAgo(1) },
  { room: 'google-oa-discussion', username: 'Karan Mehta',  userInit: 'K', role: 'student', text: 'No, just pure coding on their internal platform. 90 minutes for 2 problems.', createdAt: daysAgo(1) },
  { room: 'google-oa-discussion', username: 'Dev Sharma',   userInit: 'D', role: 'student', text: 'What was the DP problem pattern?', createdAt: hoursAgo(18) },
  { room: 'google-oa-discussion', username: 'Karan Mehta',  userInit: 'K', role: 'student', text: 'Interval DP — similar to burst balloons. Had to optimize subarray combinations under constraints.', createdAt: hoursAgo(18) },

  /* ━━━━━━━━━━━━  BARCLAYS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // barclays-general
  { room: 'barclays-general', username: 'Ketan Bajaj',      userInit: 'K', role: 'senior', text: 'Welcome to the Barclays hub! 🏦 I cleared Barclays summer intern through Hack-o-Hire 2024. Ask me anything.', createdAt: daysAgo(4) },
  { room: 'barclays-general', username: 'Aditi Kulkarni',   userInit: 'A', role: 'student', text: 'What is Hack-o-Hire exactly? Is it open to all branches?', createdAt: daysAgo(4) },
  { room: 'barclays-general', username: 'Ketan Bajaj',      userInit: 'K', role: 'senior', text: 'It\'s Barclays\' annual hackathon for 2nd and 3rd year students. Top teams get direct interview calls — no OA. Open to all branches but CS/IT dominate.', createdAt: daysAgo(4) },
  { room: 'barclays-general', username: 'Tirthraj M',       userInit: 'T', role: 'senior', text: 'I got in through the regular OA route. The OA was on HackerEarth — 3 DSA problems + 20 MCQs (OS, DBMS, networking). 90 minutes total.', createdAt: daysAgo(2) },
  { room: 'barclays-general', username: 'Sneha Patil',      userInit: 'S', role: 'student', text: 'Is the interview more technical or HR focused?', createdAt: daysAgo(2) },
  { room: 'barclays-general', username: 'Ketan Bajaj',      userInit: 'K', role: 'senior', text: 'Heavily technical in Round 1. SQL, OS concepts, your projects in detail. They go deep on every line of your resume. Round 2 is a mix of tech + HR.', createdAt: daysAgo(2) },
  { room: 'barclays-general', username: 'Prathamesh D',     userInit: 'P', role: 'student', text: 'What is the RISES values thing I keep reading about?', createdAt: hoursAgo(10) },
  { room: 'barclays-general', username: 'Tirthraj M',       userInit: 'T', role: 'senior', text: 'RISES = Respect, Integrity, Service, Excellence, Stewardship. Barclays core values. They WILL ask you to explain how you embody these. Prepare examples for each.', createdAt: hoursAgo(10) },
  { room: 'barclays-general', username: 'Aditi Kulkarni',   userInit: 'A', role: 'student', text: 'Is SQL mandatory to know deeply?', createdAt: hoursAgo(3) },
  { room: 'barclays-general', username: 'Ketan Bajaj',      userInit: 'K', role: 'senior', text: 'Yes! They asked me 4-5 SQL queries in the interview — JOINs, GROUP BY, window functions, and a normalization question. It\'s a bank — data is everything.', createdAt: hoursAgo(3) },

  // barclays-interview-prep
  { room: 'barclays-interview-prep', username: 'Ketan Bajaj',  userInit: 'K', role: 'senior', text: '📌 Barclays Interview Checklist:\n✅ SQL (JOINs, window functions)\n✅ OS fundamentals (deadlock, scheduling)\n✅ OOPS concepts\n✅ RISES values — must know\n✅ All resume projects in depth', createdAt: daysAgo(3) },
  { room: 'barclays-interview-prep', username: 'Sneha Patil',   userInit: 'S', role: 'student', text: 'Was there any DSA in the interview itself?', createdAt: daysAgo(1) },
  { room: 'barclays-interview-prep', username: 'Tirthraj M',    userInit: 'T', role: 'senior', text: 'Light DSA — nothing like Google. More conceptual. They asked me about time complexity of common sorting algorithms and when to use each.', createdAt: daysAgo(1) },
  { room: 'barclays-interview-prep', username: 'Prathamesh D',  userInit: 'P', role: 'student', text: 'What was your internship work like?', createdAt: hoursAgo(6) },
  { room: 'barclays-interview-prep', username: 'Ketan Bajaj',   userInit: 'K', role: 'senior', text: 'Working on trade settlement automation. Python + SQL + some React. Great exposure to fintech systems. Conversion chances look good!', createdAt: hoursAgo(6) },

  /* ━━━━━━━━━━━━  MICROSOFT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // microsoft-general
  { room: 'microsoft-general', username: 'Saurabh K',     userInit: 'S', role: 'senior', text: 'Microsoft SWE offer accepted ✅ Happy to help anyone preparing. The process is kinder than Google/Meta.', createdAt: daysAgo(6) },
  { room: 'microsoft-general', username: 'Rohan Verma',   userInit: 'R', role: 'student', text: 'How many rounds? Any online assessment first?', createdAt: daysAgo(6) },
  { room: 'microsoft-general', username: 'Saurabh K',     userInit: 'S', role: 'senior', text: 'No OA for campus. Direct 4 rounds — 3 technical + 1 As-Appropriate (AA) with a principal engineer. AA is the most important.', createdAt: daysAgo(6) },
  { room: 'microsoft-general', username: 'Arjun Sharma',  userInit: 'A', role: 'student', text: 'Is OOP/LLD actually heavily tested? I\'ve heard this from multiple people.', createdAt: daysAgo(3) },
  { room: 'microsoft-general', username: 'Saurabh K',     userInit: 'S', role: 'senior', text: 'YES. More than any other company. They asked me to design a parking lot system with full class diagrams. Know SOLID principles, design patterns (Factory, Observer, Strategy). Much more LLD than FAANG.', createdAt: daysAgo(3) },
  { room: 'microsoft-general', username: 'Priya Nair',    userInit: 'P', role: 'student', text: 'What\'s the CTC for new grad?', createdAt: hoursAgo(12) },
  { room: 'microsoft-general', username: 'Saurabh K',     userInit: 'S', role: 'senior', text: '32 LPA for SWE role in Noida. Hyderabad is slightly different. Good ESOPs on top.', createdAt: hoursAgo(12) },

  /* ━━━━━━━━━━━━  AMAZON ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // amazon-general
  { room: 'amazon-general', username: 'Priya Nair',     userInit: 'P', role: 'senior', text: 'Amazon SDE I offer — Hyderabad! 🎉 The LP prep was the difference-maker for me.', createdAt: daysAgo(5) },
  { room: 'amazon-general', username: 'Karan Mehta',    userInit: 'K', role: 'student', text: 'How many LP stories did you prepare?', createdAt: daysAgo(5) },
  { room: 'amazon-general', username: 'Priya Nair',     userInit: 'P', role: 'senior', text: 'I mapped 12 detailed STAR stories across all 16 LPs. Each story covered at least 3-4 LPs. The key is quantifying your impact — "I reduced latency by 40%", not "I made it faster".', createdAt: daysAgo(5) },
  { room: 'amazon-general', username: 'Dev Sharma',     userInit: 'D', role: 'student', text: 'What is the Bar Raiser round? It sounds terrifying.', createdAt: daysAgo(2) },
  { room: 'amazon-general', username: 'Priya Nair',     userInit: 'P', role: 'senior', text: 'Bar Raiser is a senior Amazonian from a DIFFERENT team. They can veto your offer. They focus on whether you raise the bar for the team. Hard coding problem + deep LP questions. Don\'t let your guard down.', createdAt: daysAgo(2) },
  { room: 'amazon-general', username: 'Meera Joshi',    userInit: 'M', role: 'student', text: 'OA pattern for 2025 batch?', createdAt: hoursAgo(15) },
  { room: 'amazon-general', username: 'Priya Nair',     userInit: 'P', role: 'senior', text: '2 coding problems (medium difficulty) + Work Simulation (30 scenarios). For work sim — always pick the "Ownership" and "Bias for Action" answer. Amazon literally filters on this.', createdAt: hoursAgo(15) },

  /* ━━━━━━━━━━━━  META ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // meta-general
  { room: 'meta-general', username: 'Karan Mehta',   userInit: 'K', role: 'student', text: 'Got Meta onsite next week. Any last-minute advice?', createdAt: daysAgo(1) },
  { room: 'meta-general', username: 'Riya Desai',    userInit: 'R', role: 'senior', text: 'Know "Move Fast" and "Be Bold" values cold. The behavioral round at Meta is valued same as coding. Also — practice the celebrity problem for system design. It ALWAYS comes up.', createdAt: daysAgo(1) },
  { room: 'meta-general', username: 'Karan Mehta',   userInit: 'K', role: 'student', text: 'What\'s the celebrity problem context for SD?', createdAt: daysAgo(1) },
  { room: 'meta-general', username: 'Riya Desai',    userInit: 'R', role: 'senior', text: 'Designing a feed system (like Instagram/Facebook) — if a celebrity with 100M followers posts, do you PUSH to all 100M feeds (fan-out on write) or PULL when they open the app? Answer is HYBRID. Push for normal users, pull for celebrities. Meta expects you to know this.', createdAt: daysAgo(1) },
  { room: 'meta-general', username: 'Arjun Sharma',  userInit: 'A', role: 'student', text: 'What DSA topics should I focus on for Meta?', createdAt: hoursAgo(8) },
  { room: 'meta-general', username: 'Karan Mehta',   userInit: 'K', role: 'student', text: 'From my experience — monotonic stack/deque, sliding window, interval problems, and graph BFS/DFS. LC Hard is real at Meta.', createdAt: hoursAgo(8) },

  /* ━━━━━━━━━━━━  PERSISTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // persistent-general
  { room: 'persistent-general', username: 'Harsh Chavan',   userInit: 'H', role: 'senior', text: 'Got placed at Persistent Systems! ASE role, Pune. Process was interesting — very project-focused.', createdAt: daysAgo(3) },
  { room: 'persistent-general', username: 'Aditi Kulkarni', userInit: 'A', role: 'student', text: 'What was the OA like?', createdAt: daysAgo(3) },
  { room: 'persistent-general', username: 'Harsh Chavan',   userInit: 'H', role: 'senior', text: 'Aptitude (Quant + Verbal) + 2 coding problems (easy-medium). Test on their own platform. The coding is easier than FAANG — focus on getting correct output.', createdAt: daysAgo(3) },
  { room: 'persistent-general', username: 'Sneha Patil',    userInit: 'S', role: 'student', text: 'How was the technical interview?', createdAt: daysAgo(2) },
  { room: 'persistent-general', username: 'Harsh Chavan',   userInit: 'H', role: 'senior', text: 'They asked heavily about my projects. Every technology I mentioned — they drilled deep. Django, REST APIs, React, Docker. Don\'t put anything on your resume you can\'t explain thoroughly.', createdAt: daysAgo(2) },
  { room: 'persistent-general', username: 'Prathamesh D',   userInit: 'P', role: 'student', text: 'Is the HR round eliminative?', createdAt: hoursAgo(7) },
  { room: 'persistent-general', username: 'Harsh Chavan',   userInit: 'H', role: 'senior', text: 'Not really, just a formality if you aced tech. Basic questions — why Persistent, career goals, relocation flexibility. CTC is 5 LPA for freshers.', createdAt: hoursAgo(7) },

  /* ━━━━━━━━━━━━  TCS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // tcs-general
  { room: 'tcs-general', username: 'Meera Joshi',   userInit: 'M', role: 'student', text: 'TCS NQT next week. Any tips?', createdAt: daysAgo(2) },
  { room: 'tcs-general', username: 'Rohan Verma',   userInit: 'R', role: 'student', text: 'NQT has 4 sections — Verbal, Aptitude, Programming Logic, Coding. The coding section is easy — basic loops/arrays. Focus more on aptitude and verbal for high score.', createdAt: daysAgo(2) },
  { room: 'tcs-general', username: 'Dev Sharma',    userInit: 'D', role: 'student', text: 'TCS ninja vs digital vs prime — what\'s the difference?', createdAt: daysAgo(1) },
  { room: 'tcs-general', username: 'Rohan Verma',   userInit: 'R', role: 'student', text: 'Based on NQT score and coding section:\n- Ninja: 7+ LPA (strong coders)\n- Digital: 3.5-5 LPA (standard)\n- Prime: 9+ LPA (90%+ score + coding excellence)\nAim for Prime — the coding section is your differentiator.', createdAt: daysAgo(1) },

  /* ━━━━━━━━━━━━  COGNIZANT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // cognizant-general
  { room: 'cognizant-general', username: 'Arjun Sharma',  userInit: 'A', role: 'student', text: 'Cognizant GenC Elevate process — anyone have info?', createdAt: daysAgo(2) },
  { room: 'cognizant-general', username: 'Priya Nair',    userInit: 'P', role: 'student', text: 'GenC Elevate is their premium track (6.5 LPA). Aptitude test + 2 coding problems (medium level) + tech interview (OOP focus). Much better package than regular GenC (3.5 LPA).', createdAt: daysAgo(2) },
  { room: 'cognizant-general', username: 'Meera Joshi',   userInit: 'M', role: 'student', text: 'Is the technical interview hard for Elevate?', createdAt: daysAgo(1) },
  { room: 'cognizant-general', username: 'Priya Nair',    userInit: 'P', role: 'student', text: 'OOPS questions (polymorphism, abstraction, real-world examples), SQL basics, and 1-2 coding problems. Easier than FAANG but solid fundamentals are expected.', createdAt: daysAgo(1) },

  /* ━━━━━━━━━━━━  INFOSYS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // infosys-general
  { room: 'infosys-general', username: 'Dev Sharma',    userInit: 'D', role: 'student', text: 'Infosys Specialist Programmer (SP) track — anyone cleared it?', createdAt: daysAgo(4) },
  { room: 'infosys-general', username: 'Saurabh K',     userInit: 'S', role: 'student', text: 'SP track is for coders. Hackathon-style selection. If you clear it, 9 LPA package. Regular track is 3.6 LPA.', createdAt: daysAgo(4) },
  { room: 'infosys-general', username: 'Dev Sharma',    userInit: 'D', role: 'student', text: 'Is Infosys a good company for growth?', createdAt: daysAgo(2) },
  { room: 'infosys-general', username: 'Karan Mehta',   userInit: 'K', role: 'student', text: 'Good for job security and training. Career growth is slow in service companies unless you use it as a stepping stone. Many people prep for product companies while at Infosys — it\'s common.', createdAt: daysAgo(2) },

  /* ━━━━━━━━━━━━  FLIPKART ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  // flipkart-general
  { room: 'flipkart-general', username: 'Aanya Rao',     userInit: 'A', role: 'senior', text: 'Flipkart intern → FTE conversion confirmed! 🛍️ Took 3 months to get the offer letter after internship.', createdAt: daysAgo(5) },
  { room: 'flipkart-general', username: 'Arjun Sharma',  userInit: 'A', role: 'student', text: 'Was the intern process through campus or off-campus?', createdAt: daysAgo(5) },
  { room: 'flipkart-general', username: 'Aanya Rao',     userInit: 'A', role: 'senior', text: 'Campus at VIT. CodeNation test first (easy DSA), then 2 tech rounds. One was pure DSA (recursion + DP), other was project-based discussion.', createdAt: daysAgo(5) },
  { room: 'flipkart-general', username: 'Sneha Patil',   userInit: 'S', role: 'student', text: 'What work did you do during the internship?', createdAt: daysAgo(2) },
  { room: 'flipkart-general', username: 'Aanya Rao',     userInit: 'A', role: 'senior', text: 'Worked on the search relevance team. Built a feature for personalized search using user behavior data. Real production impact — my feature went live!', createdAt: daysAgo(2) },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Drop only DEMO messages (we keep real user messages)
    const demoUsernames = [...new Set(SEEDS.map(s => s.username))];
    const deleted = await Message.deleteMany({ username: { $in: demoUsernames } });
    console.log(`🗑️  Removed ${deleted.deletedCount} old demo messages`);

    // Insert all seeds
    const docs = SEEDS.map(s => ({
      room:       s.room,
      userId:     'demo',
      username:   s.username,
      userInit:   s.userInit,
      role:       s.role,
      text:       s.text,
      type:       'text',
      createdAt:  s.createdAt,
      updatedAt:  s.createdAt,
    }));

    await Message.insertMany(docs, { timestamps: false });
    console.log(`✅ Seeded ${docs.length} demo messages across ${[...new Set(SEEDS.map(s => s.room))].length} rooms`);

    // Print summary
    const rooms = [...new Set(SEEDS.map(s => s.room))];
    for (const room of rooms) {
      const count = SEEDS.filter(s => s.room === room).length;
      console.log(`   ${room}: ${count} messages`);
    }

  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();
