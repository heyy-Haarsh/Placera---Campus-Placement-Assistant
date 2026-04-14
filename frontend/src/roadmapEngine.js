// ═══════════════════════════════════════════════════════════════════
//  roadmapEngine.js  —  Placera AI Roadmap Intelligence Engine v2
//  Architecture: Company Profiles → Question Scoring → Phase Builder
// ═══════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────────
// 1.  COMPANY PROFILES  (weights + round structure, no hardcoded Qs)
// ──────────────────────────────────────────────────────────────────

export const COMPANY_PROFILES = {
  Google: {
    dsaWeights: { graphs: 0.95, dp: 0.92, trees: 0.85, arrays: 0.75, strings: 0.65, heaps: 0.80, backtracking: 0.70, binarysearch: 0.75, hashing: 0.70, twopointers: 0.65, sql: 0.30, oop: 0.40, concurrency: 0.55, security: 0.30, greedy: 0.70 },
    sdWeights: { distributed: 0.95, scalability: 0.95, realtime: 0.75, ratelimiting: 0.80, search: 0.90, streaming: 0.75, microservices: 0.70, caching: 0.80, payments: 0.30, fraud: 0.30, security: 0.60, telecom: 0.10 },
    roundStructure: ['DSA', 'DSA', 'System Design', 'Behavioral', 'Googleyness'],
    focusTags: ['large-scale', 'low-latency', 'search', 'distributed-systems'],
    difficulty: 'hard',
    color: '#4285F4',
    emoji: '🔵',
  },
  Amazon: {
    dsaWeights: { arrays: 0.85, dp: 0.80, graphs: 0.75, trees: 0.80, strings: 0.70, heaps: 0.75, binarysearch: 0.70, hashing: 0.75, twopointers: 0.70, backtracking: 0.55, sql: 0.50, oop: 0.70, concurrency: 0.65, security: 0.40, greedy: 0.65 },
    sdWeights: { distributed: 0.90, scalability: 0.92, microservices: 0.88, caching: 0.85, streaming: 0.80, payments: 0.70, ratelimiting: 0.75, search: 0.75, realtime: 0.70, security: 0.60, fraud: 0.55, telecom: 0.10 },
    roundStructure: ['DSA', 'DSA', 'System Design', 'Behavioral (LP)', 'Bar Raiser'],
    focusTags: ['leadership-principles', 'microservices', 'cloud-scale', 'customer-obsession'],
    difficulty: 'hard',
    color: '#FF9900',
    emoji: '🟠',
  },
  Meta: {
    dsaWeights: { arrays: 0.80, graphs: 0.88, dp: 0.82, trees: 0.80, strings: 0.75, hashing: 0.78, twopointers: 0.75, heaps: 0.72, backtracking: 0.65, binarysearch: 0.70, sql: 0.40, oop: 0.55, concurrency: 0.60, security: 0.45, greedy: 0.65 },
    sdWeights: { distributed: 0.88, scalability: 0.92, realtime: 0.90, caching: 0.85, search: 0.80, streaming: 0.85, microservices: 0.80, ratelimiting: 0.70, payments: 0.50, fraud: 0.60, security: 0.55, telecom: 0.10 },
    roundStructure: ['DSA', 'DSA', 'System Design', 'Behavioral', 'Culture Fit'],
    focusTags: ['social-scale', 'real-time', 'newsfeed', 'graph-traversal'],
    difficulty: 'hard',
    color: '#0866FF',
    emoji: '🟣',
  },
  Microsoft: {
    dsaWeights: { arrays: 0.80, trees: 0.82, graphs: 0.72, dp: 0.75, strings: 0.75, oop: 0.85, hashing: 0.72, twopointers: 0.68, heaps: 0.68, binarysearch: 0.72, concurrency: 0.70, sql: 0.60, security: 0.50, backtracking: 0.58, greedy: 0.62 },
    sdWeights: { microservices: 0.88, distributed: 0.82, scalability: 0.85, caching: 0.80, security: 0.75, realtime: 0.72, search: 0.75, streaming: 0.70, ratelimiting: 0.65, payments: 0.50, fraud: 0.40, telecom: 0.20 },
    roundStructure: ['DSA', 'DSA', 'System Design', 'Behavioral', 'Hiring Manager'],
    focusTags: ['azure-native', 'oop-heavy', 'enterprise', 'scalable-services'],
    difficulty: 'medium-hard',
    color: '#00BCF2',
    emoji: '🔷',
  },
  Uber: {
    dsaWeights: { graphs: 0.95, dp: 0.78, arrays: 0.75, concurrency: 0.90, trees: 0.72, heaps: 0.80, binarysearch: 0.70, twopointers: 0.68, hashing: 0.72, strings: 0.60, oop: 0.65, sql: 0.55, security: 0.45, backtracking: 0.50, greedy: 0.72 },
    sdWeights: { realtime: 0.95, distributed: 0.90, scalability: 0.88, ratelimiting: 0.85, payments: 0.85, streaming: 0.80, caching: 0.78, microservices: 0.80, search: 0.65, fraud: 0.75, security: 0.60, telecom: 0.10 },
    roundStructure: ['DSA', 'System Design', 'Concurrency & Systems', 'Behavioral'],
    focusTags: ['geospatial', 'real-time-matching', 'payments', 'concurrent-systems'],
    difficulty: 'hard',
    color: '#1A1A1A',
    emoji: '⚫',
  },
  Netflix: {
    dsaWeights: { arrays: 0.75, dp: 0.78, graphs: 0.72, streaming: 0.90, concurrency: 0.85, trees: 0.70, hashing: 0.72, heaps: 0.75, binarysearch: 0.65, twopointers: 0.65, oop: 0.70, strings: 0.60, sql: 0.45, security: 0.50, backtracking: 0.50 },
    sdWeights: { streaming: 0.98, caching: 0.92, distributed: 0.88, scalability: 0.90, realtime: 0.85, microservices: 0.85, search: 0.75, ratelimiting: 0.72, payments: 0.40, fraud: 0.45, security: 0.60, telecom: 0.10 },
    roundStructure: ['DSA', 'System Design', 'Culture (Freedom & Responsibility)', 'Hiring Manager'],
    focusTags: ['video-streaming', 'content-delivery', 'recommendation-engine', 'cdn'],
    difficulty: 'hard',
    color: '#E50914',
    emoji: '🔴',
  },
  Stripe: {
    dsaWeights: { arrays: 0.78, dp: 0.72, graphs: 0.65, security: 0.88, sql: 0.80, oop: 0.80, concurrency: 0.78, trees: 0.70, hashing: 0.75, strings: 0.72, heaps: 0.65, twopointers: 0.65, binarysearch: 0.68, backtracking: 0.50, greedy: 0.60 },
    sdWeights: { payments: 0.98, security: 0.92, distributed: 0.85, fraud: 0.88, ratelimiting: 0.85, scalability: 0.82, microservices: 0.80, caching: 0.75, realtime: 0.70, streaming: 0.60, search: 0.55, telecom: 0.10 },
    roundStructure: ['DSA', 'System Design', 'Payment Systems', 'Behavioral'],
    focusTags: ['payments-infra', 'financial-apis', 'idempotency', 'fraud-prevention'],
    difficulty: 'hard',
    color: '#635BFF',
    emoji: '🟦',
  },
  Barclays: {
    dsaWeights: { arrays: 0.80, strings: 0.72, sql: 0.92, dp: 0.52, graphs: 0.42, security: 0.85, oop: 0.78, hashing: 0.68, twopointers: 0.60, heaps: 0.50, trees: 0.60, binarysearch: 0.58, concurrency: 0.65, backtracking: 0.35, greedy: 0.55 },
    sdWeights: { security: 0.92, payments: 0.92, fraud: 0.88, distributed: 0.65, ratelimiting: 0.72, microservices: 0.70, caching: 0.65, scalability: 0.68, realtime: 0.55, streaming: 0.45, search: 0.40, telecom: 0.20 },
    roundStructure: ['DSA', 'System Design', 'Behavioral', 'HR'],
    focusTags: ['fintech', 'payments', 'security', 'banking-compliance'],
    difficulty: 'medium',
    color: '#00AEEF',
    emoji: '🏦',
  },
  PhonePe: {
    dsaWeights: { arrays: 0.82, graphs: 0.72, dp: 0.75, concurrency: 0.88, sql: 0.80, oop: 0.78, strings: 0.70, hashing: 0.72, heaps: 0.68, twopointers: 0.68, trees: 0.68, binarysearch: 0.62, security: 0.70, backtracking: 0.45, greedy: 0.65 },
    sdWeights: { payments: 1.0, distributed: 0.92, realtime: 0.88, scalability: 0.88, fraud: 0.85, ratelimiting: 0.82, microservices: 0.85, caching: 0.80, security: 0.78, streaming: 0.65, search: 0.50, telecom: 0.20 },
    roundStructure: ['DSA', 'System Design', 'System Design (Payments)', 'Behavioral'],
    focusTags: ['upi', 'fintech', 'high-throughput', 'microservices-payments'],
    difficulty: 'medium-hard',
    color: '#5F259F',
    emoji: '💳',
  },
  Amdocs: {
    dsaWeights: { arrays: 0.72, strings: 0.82, sql: 0.85, oop: 0.95, dp: 0.42, graphs: 0.38, hashing: 0.70, twopointers: 0.60, trees: 0.55, binarysearch: 0.55, concurrency: 0.65, security: 0.58, heaps: 0.45, backtracking: 0.30, greedy: 0.50 },
    sdWeights: { telecom: 0.95, microservices: 0.82, security: 0.70, distributed: 0.60, caching: 0.65, ratelimiting: 0.60, scalability: 0.65, payments: 0.55, realtime: 0.50, streaming: 0.40, fraud: 0.35, search: 0.40 },
    roundStructure: ['DSA', 'OOP / LLD', 'Behavioral', 'HR'],
    focusTags: ['telecom', 'billing-systems', 'crm', 'java-oop-heavy'],
    difficulty: 'medium',
    color: '#FF6600',
    emoji: '📡',
  },
  Mastercard: {
    dsaWeights: { arrays: 0.82, strings: 0.72, sql: 0.82, security: 0.92, graphs: 0.65, dp: 0.62, oop: 0.80, hashing: 0.72, twopointers: 0.65, heaps: 0.58, trees: 0.65, binarysearch: 0.62, concurrency: 0.68, backtracking: 0.40, greedy: 0.60 },
    sdWeights: { payments: 1.0, security: 0.95, fraud: 0.95, distributed: 0.72, ratelimiting: 0.78, microservices: 0.75, caching: 0.70, scalability: 0.72, realtime: 0.62, streaming: 0.50, search: 0.45, telecom: 0.20 },
    roundStructure: ['DSA', 'System Design', 'Security Round', 'Behavioral'],
    focusTags: ['payment-networks', 'fraud-detection', 'encryption', 'pci-dss-compliance'],
    difficulty: 'medium-hard',
    color: '#EB001B',
    emoji: '🔐',
  },
  Goldman_Sachs: {
    dsaWeights: { arrays: 0.80, dp: 0.85, graphs: 0.70, sql: 0.88, security: 0.82, strings: 0.72, oop: 0.80, hashing: 0.75, concurrency: 0.72, trees: 0.68, heaps: 0.70, twopointers: 0.65, binarysearch: 0.68, backtracking: 0.55, greedy: 0.72 },
    sdWeights: { payments: 0.95, security: 0.92, fraud: 0.90, distributed: 0.80, ratelimiting: 0.78, scalability: 0.80, microservices: 0.75, caching: 0.72, realtime: 0.65, streaming: 0.60, search: 0.50, telecom: 0.15 },
    roundStructure: ['DSA', 'DSA', 'System Design', 'Behavioral', 'Hiring Manager'],
    focusTags: ['quantitative', 'risk-systems', 'trading-infra', 'low-latency-finance'],
    difficulty: 'hard',
    color: '#5B9BD5',
    emoji: '💰',
  },
  Flipkart: {
    dsaWeights: { arrays: 0.82, graphs: 0.75, dp: 0.78, trees: 0.75, strings: 0.70, hashing: 0.72, heaps: 0.70, twopointers: 0.68, oop: 0.72, concurrency: 0.70, sql: 0.65, binarysearch: 0.68, backtracking: 0.55, security: 0.45, greedy: 0.68 },
    sdWeights: { scalability: 0.92, distributed: 0.88, caching: 0.85, payments: 0.82, microservices: 0.85, search: 0.80, streaming: 0.72, realtime: 0.72, ratelimiting: 0.72, fraud: 0.65, security: 0.58, telecom: 0.15 },
    roundStructure: ['DSA', 'System Design (E-Commerce)', 'Behavioral', 'Hiring Manager'],
    focusTags: ['e-commerce-scale', 'search-ranking', 'catalog-systems', 'supply-chain'],
    difficulty: 'medium-hard',
    color: '#F7CB15',
    emoji: '🛒',
  },
  Razorpay: {
    dsaWeights: { arrays: 0.78, sql: 0.88, security: 0.90, dp: 0.68, graphs: 0.62, oop: 0.82, concurrency: 0.80, strings: 0.72, hashing: 0.72, trees: 0.65, heaps: 0.60, twopointers: 0.65, binarysearch: 0.60, backtracking: 0.40, greedy: 0.62 },
    sdWeights: { payments: 0.98, fraud: 0.90, security: 0.90, distributed: 0.80, ratelimiting: 0.85, microservices: 0.82, caching: 0.78, realtime: 0.75, scalability: 0.80, streaming: 0.60, search: 0.45, telecom: 0.20 },
    roundStructure: ['DSA', 'System Design (Payments)', 'Behavioral', 'Culture Fit'],
    focusTags: ['payment-gateway', 'merchant-apis', 'webhook-reliability', 'fintech-apis'],
    difficulty: 'medium-hard',
    color: '#2B61D1',
    emoji: '⚡',
  },
  Zoho: {
    dsaWeights: { arrays: 0.80, strings: 0.85, sql: 0.88, oop: 0.90, dp: 0.55, graphs: 0.50, hashing: 0.75, twopointers: 0.68, trees: 0.65, binarysearch: 0.65, concurrency: 0.60, heaps: 0.55, security: 0.50, backtracking: 0.45, greedy: 0.60 },
    sdWeights: { microservices: 0.85, distributed: 0.72, caching: 0.75, scalability: 0.78, search: 0.70, ratelimiting: 0.68, realtime: 0.65, security: 0.65, streaming: 0.55, payments: 0.50, fraud: 0.38, telecom: 0.25 },
    roundStructure: ['Coding Round 1', 'Coding Round 2', 'Technical Interview', 'HR'],
    focusTags: ['saas-products', 'oop-design', 'database-heavy', 'java-python'],
    difficulty: 'medium',
    color: '#E42527',
    emoji: '🏢',
  },
  Infosys: {
    dsaWeights: { arrays: 0.82, strings: 0.80, sql: 0.85, oop: 0.85, dp: 0.50, graphs: 0.45, hashing: 0.75, twopointers: 0.65, trees: 0.60, binarysearch: 0.62, concurrency: 0.55, heaps: 0.50, security: 0.45, backtracking: 0.38, greedy: 0.55 },
    sdWeights: { microservices: 0.80, distributed: 0.68, caching: 0.70, scalability: 0.72, search: 0.60, ratelimiting: 0.60, realtime: 0.58, security: 0.60, streaming: 0.50, payments: 0.55, fraud: 0.35, telecom: 0.40 },
    roundStructure: ['Online Test', 'Technical Interview', 'Behavioral / HR', 'Final HR'],
    focusTags: ['service-delivery', 'java-enterprise', 'agile-projects', 'client-facing'],
    difficulty: 'medium',
    color: '#007CC3',
    emoji: '🌐',
  },
};

// ──────────────────────────────────────────────────────────────────
// 2.  MASTER DSA QUESTION BANK  — topic-tagged only (no company tags)
// ──────────────────────────────────────────────────────────────────

export const DSA_BANK = [
  // ── Arrays ───────────────────────────────────────────────────────
  { id: 'dsa_001', title: 'Two Sum', topic: 'arrays', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
  { id: 'dsa_002', title: 'Best Time to Buy and Sell Stock', topic: 'arrays', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 'dsa_003', title: 'Maximum Subarray (Kadane\'s)', topic: 'arrays', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 'dsa_004', title: 'Container With Most Water', topic: 'arrays', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
  { id: 'dsa_005', title: 'Trapping Rain Water', topic: 'arrays', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/' },
  { id: 'dsa_006', title: 'Product of Array Except Self', topic: 'arrays', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { id: 'dsa_007', title: '3Sum', topic: 'twopointers', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
  // ── Strings ──────────────────────────────────────────────────────
  { id: 'dsa_008', title: 'Longest Substring Without Repeating', topic: 'strings', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 'dsa_009', title: 'Minimum Window Substring', topic: 'strings', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },
  { id: 'dsa_010', title: 'Valid Parentheses', topic: 'strings', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 'dsa_011', title: 'Longest Palindromic Substring', topic: 'strings', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 'dsa_012', title: 'Group Anagrams', topic: 'hashing', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
  // ── Sliding Window ───────────────────────────────────────────────
  { id: 'dsa_013', title: 'Sliding Window Maximum', topic: 'slidingwindow', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/' },
  { id: 'dsa_014', title: 'Find All Anagrams in a String', topic: 'slidingwindow', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/' },
  // ── Two Pointers / Greedy ─────────────────────────────────────────
  { id: 'dsa_015', title: 'Jump Game', topic: 'greedy', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/jump-game/' },
  { id: 'dsa_016', title: 'Merge Intervals', topic: 'greedy', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
  // ── Binary Search ────────────────────────────────────────────────
  { id: 'dsa_017', title: 'Binary Search', topic: 'binarysearch', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
  { id: 'dsa_018', title: 'Search in Rotated Sorted Array', topic: 'binarysearch', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 'dsa_019', title: 'Median of Two Sorted Arrays', topic: 'binarysearch', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  // ── Trees ─────────────────────────────────────────────────────────
  { id: 'dsa_020', title: 'LCA of Binary Tree', topic: 'trees', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
  { id: 'dsa_021', title: 'Serialize and Deserialize Binary Tree', topic: 'trees', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
  { id: 'dsa_022', title: 'Binary Tree Maximum Path Sum', topic: 'trees', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
  { id: 'dsa_023', title: 'Binary Tree Level Order Traversal', topic: 'trees', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 'dsa_024', title: 'Validate Binary Search Tree', topic: 'trees', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  // ── Graphs ───────────────────────────────────────────────────────
  { id: 'dsa_025', title: 'Number of Islands', topic: 'graphs', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 'dsa_026', title: 'Course Schedule', topic: 'graphs', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/' },
  { id: 'dsa_027', title: 'Word Ladder', topic: 'graphs', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },
  { id: 'dsa_028', title: 'Clone Graph', topic: 'graphs', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/' },
  { id: 'dsa_029', title: 'Cheapest Flights Within K Stops', topic: 'graphs', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
  // ── DP ───────────────────────────────────────────────────────────
  { id: 'dsa_030', title: 'Coin Change', topic: 'dp', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
  { id: 'dsa_031', title: 'Edit Distance', topic: 'dp', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
  { id: 'dsa_032', title: 'Longest Common Subsequence', topic: 'dp', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { id: 'dsa_033', title: 'Longest Increasing Subsequence', topic: 'dp', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 'dsa_034', title: 'Burst Balloons', topic: 'dp', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/' },
  { id: 'dsa_035', title: 'Word Break', topic: 'dp', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
  // ── Heaps ────────────────────────────────────────────────────────
  { id: 'dsa_036', title: 'Merge K Sorted Lists', topic: 'heaps', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  { id: 'dsa_037', title: 'Top K Frequent Elements', topic: 'heaps', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { id: 'dsa_038', title: 'Find Median from Data Stream', topic: 'heaps', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/' },
  // ── Backtracking ─────────────────────────────────────────────────
  { id: 'dsa_039', title: 'N-Queens', topic: 'backtracking', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },
  { id: 'dsa_040', title: 'Word Search', topic: 'backtracking', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
  { id: 'dsa_041', title: 'Subsets II', topic: 'backtracking', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/' },
  // ── OOP / Design ─────────────────────────────────────────────────
  { id: 'dsa_042', title: 'LRU Cache', topic: 'oop', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/lru-cache/' },
  { id: 'dsa_043', title: 'Min Stack', topic: 'oop', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
  { id: 'dsa_044', title: 'Design Twitter (OOP)', topic: 'oop', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/design-twitter/' },
  { id: 'dsa_045', title: 'Design Circular Queue', topic: 'oop', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/design-circular-queue/' },
  // ── SQL ──────────────────────────────────────────────────────────
  { id: 'dsa_046', title: 'Rank Scores', topic: 'sql', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/rank-scores/' },
  { id: 'dsa_047', title: 'Department Top 3 Salaries', topic: 'sql', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/department-top-three-salaries/' },
  { id: 'dsa_048', title: 'Consecutive Numbers', topic: 'sql', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/consecutive-numbers/' },
  { id: 'dsa_049', title: 'Find Duplicate Emails', topic: 'sql', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/duplicate-emails/' },
  // ── Concurrency ──────────────────────────────────────────────────
  { id: 'dsa_050', title: 'Print in Order (Thread Sync)', topic: 'concurrency', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/print-in-order/' },
  { id: 'dsa_051', title: 'Print FooBar Alternately', topic: 'concurrency', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/print-foobar-alternately/' },
  { id: 'dsa_052', title: 'The Dining Philosophers', topic: 'concurrency', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/the-dining-philosophers/' },
  // ── Security ─────────────────────────────────────────────────────
  { id: 'dsa_053', title: 'Detect XSS Patterns (Regex)', topic: 'security', difficulty: 'Med', leetcodeUrl: null },
  { id: 'dsa_054', title: 'Implement a Hash Map (Collision handling)', topic: 'security', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/design-hashmap/' },
  // ── Hashing ──────────────────────────────────────────────────────
  { id: 'dsa_055', title: 'Four Sum II', topic: 'hashing', difficulty: 'Med', leetcodeUrl: 'https://leetcode.com/problems/4sum-ii/' },
];

// ──────────────────────────────────────────────────────────────────
// 3.  MASTER SYSTEM DESIGN QUESTION BANK  — domain-tagged only
// ──────────────────────────────────────────────────────────────────

export const SD_BANK = [
  // Payments ────────────────────────────────────────────────────────
  { id: 'sd_001', title: 'Design a Payment Gateway', domain: 'payments', difficulty: 'Hard', components: ['API Gateway', 'Idempotency Layer', 'Ledger DB', 'Queue', 'Fraud Service'], concepts: ['ACID', 'idempotency', 'double-entry'] },
  { id: 'sd_002', title: 'Design UPI Transaction System', domain: 'payments', difficulty: 'Hard', components: ['Bank Switch', 'NPCI Interface', 'Queue (Kafka)', 'Cassandra', 'Retry Engine'], concepts: ['eventual consistency', '2PC', 'high-throughput'] },
  { id: 'sd_003', title: 'Design Billing & Subscription Service', domain: 'payments', difficulty: 'Med', components: ['Billing Engine', 'Invoice Generator', 'Scheduler', 'Payment Adapter', 'Webhook'], concepts: ['idempotency', 'retry logic', 'proration'] },
  // Distributed ─────────────────────────────────────────────────────
  { id: 'sd_004', title: 'Design Distributed Key-Value Store', domain: 'distributed', difficulty: 'Hard', components: ['Consistent Hash Ring', 'Gossip Protocol', 'Vector Clocks', 'SSTable', 'Bloom Filter'], concepts: ['CAP theorem', 'consistent hashing', 'quorum'] },
  { id: 'sd_005', title: 'Design Distributed Message Queue', domain: 'distributed', difficulty: 'Hard', components: ['Broker', 'Partition', 'Consumer Group', 'ZooKeeper', 'Offset Store'], concepts: ['at-least-once delivery', 'partitioning', 'replication'] },
  { id: 'sd_006', title: 'Design URL Shortener (TinyURL)', domain: 'scalability', difficulty: 'Med', components: ['Hash Service', 'NoSQL DB', 'Redis Cache', 'CDN', 'Analytics Service'], concepts: ['hashing', 'caching', 'sharding'] },
  // Real-time ───────────────────────────────────────────────────────
  { id: 'sd_007', title: 'Design Real-time Chat (WhatsApp)', domain: 'realtime', difficulty: 'Hard', components: ['WebSocket Server', 'Kafka', 'Redis Pub/Sub', 'Cassandra', 'Push Notifications'], concepts: ['WebSockets', 'fan-out', 'message ordering'] },
  { id: 'sd_008', title: 'Design Live Sports Score System', domain: 'realtime', difficulty: 'Med', components: ['Event Ingestion', 'SSE/WebSocket', 'Redis Pub/Sub', 'CDN', 'Score DB'], concepts: ['SSE', 'pub/sub', 'eventual consistency'] },
  // Rate Limiting ───────────────────────────────────────────────────
  { id: 'sd_009', title: 'Design Rate Limiter', domain: 'ratelimiting', difficulty: 'Med', components: ['Token Bucket / Sliding Window', 'Redis', 'API Gateway', 'Distributed Counter'], concepts: ['token bucket', 'sliding window', 'Redis pipelines'] },
  // Fraud ───────────────────────────────────────────────────────────
  { id: 'sd_010', title: 'Design Fraud Detection System', domain: 'fraud', difficulty: 'Hard', components: ['Rule Engine', 'ML Scoring Service', 'Graph DB', 'Event Stream', 'Alert Service'], concepts: ['real-time scoring', 'graph analysis', 'ML pipelines'] },
  { id: 'sd_011', title: 'Design Anti-Money Laundering System', domain: 'fraud', difficulty: 'Hard', components: ['Transaction Monitor', 'Risk Scoring Engine', 'Regulatory Reporter', 'Case Management'], concepts: ['pattern detection', 'compliance', 'data lineage'] },
  // Security ────────────────────────────────────────────────────────
  { id: 'sd_012', title: 'Design OAuth 2.0 Authorization Server', domain: 'security', difficulty: 'Hard', components: ['Auth Server', 'JWT Service', 'Redis (token store)', 'PKCE', 'Refresh Token Rotation'], concepts: ['OAuth flows', 'JWT', 'PKCE', 'token expiry'] },
  { id: 'sd_013', title: 'Design PKI Certificate Management', domain: 'security', difficulty: 'Hard', components: ['Root CA', 'Intermediate CA', 'CRL', 'OCSP', 'HSM'], concepts: ['X.509', 'certificate chain', 'revocation'] },
  // Microservices ───────────────────────────────────────────────────
  { id: 'sd_014', title: 'Design API Gateway', domain: 'microservices', difficulty: 'Med', components: ['Reverse Proxy', 'Rate Limiter', 'Auth Middleware', 'Load Balancer', 'Circuit Breaker'], concepts: ['API composition', 'circuit breaker', 'auth delegation'] },
  { id: 'sd_015', title: 'Design Notification System', domain: 'microservices', difficulty: 'Med', components: ['Kafka', 'FCM/APNs', 'Template Engine', 'User Prefs DB', 'Dead Letter Queue'], concepts: ['fan-out', 'at-least-once', 'deduplication'] },
  // Streaming ───────────────────────────────────────────────────────
  { id: 'sd_016', title: 'Design YouTube / Netflix Streaming', domain: 'streaming', difficulty: 'Hard', components: ['CDN', 'Transcoding Pipeline', 'Blob Storage', 'Metadata DB', 'Recommendation Engine'], concepts: ['adaptive bitrate', 'CDN', 'data partitioning'] },
  { id: 'sd_017', title: 'Design Event Streaming Platform (Kafka-like)', domain: 'streaming', difficulty: 'Hard', components: ['Log-Structured Storage', 'Partition', 'Consumer Groups', 'Replication', 'Schema Registry'], concepts: ['log compaction', 'offset management', 'exactly-once semantics'] },
  // Caching ─────────────────────────────────────────────────────────
  { id: 'sd_018', title: 'Design CDN', domain: 'caching', difficulty: 'Med', components: ['Edge Nodes', 'Origin Pull', 'Cache Invalidation', 'Anycast Routing', 'TLS Termination'], concepts: ['cache invalidation', 'anycast', 'origin shield'] },
  // Search ──────────────────────────────────────────────────────────
  { id: 'sd_019', title: 'Design Search Autocomplete System', domain: 'search', difficulty: 'Med', components: ['Trie / Prefix Tree', 'Redis', 'Ranking Service', 'Analytics Pipeline', 'CDN'], concepts: ['trie', 'caching', 'personalization'] },
  { id: 'sd_020', title: 'Design Google Search Index', domain: 'search', difficulty: 'Hard', components: ['Web Crawler', 'Inverted Index', 'PageRank', 'Serving Layer', 'Query Processor'], concepts: ['inverted index', 'MapReduce', 'PageRank'] },
  // Telecom ─────────────────────────────────────────────────────────
  { id: 'sd_021', title: 'Design Telecom Billing System', domain: 'telecom', difficulty: 'Hard', components: ['CDR Processor', 'Rating Engine', 'Invoice Generator', 'Revenue Assurance', 'Mediation Layer'], concepts: ['CDR processing', 'mediation', 'revenue assurance'] },
  { id: 'sd_022', title: 'Design Ride Dispatch System (Uber)', domain: 'realtime', difficulty: 'Hard', components: ['Geo Index', 'Matching Engine', 'Surge Pricing', 'Event Bus', 'Driver State Machine'], concepts: ['geohashing', 'real-time matching', 'supply-demand'] },
];

// ──────────────────────────────────────────────────────────────────
// 4.  OOP / LLD TASK BANK  (for Amdocs / design-heavy companies)
// ──────────────────────────────────────────────────────────────────

const OOP_TASKS = [
  { id: 'oop_01', title: 'LLD: Design a Parking Lot System', difficulty: 'Med' },
  { id: 'oop_02', title: 'LLD: Design a Library Management System', difficulty: 'Med' },
  { id: 'oop_03', title: 'LLD: Design a Chess Game Engine', difficulty: 'Hard' },
  { id: 'oop_04', title: 'LLD: Design an Elevator Control System', difficulty: 'Hard' },
  { id: 'oop_05', title: 'LLD: Design a Hotel Booking System', difficulty: 'Med' },
  { id: 'oop_06', title: 'Apply SOLID Principles to a CRM module', difficulty: 'Med' },
  { id: 'oop_07', title: 'Implement Observer Pattern (Event Bus)', difficulty: 'Med' },
  { id: 'oop_08', title: 'Implement Strategy Pattern (Payment Switch)', difficulty: 'Med' },
  { id: 'oop_09', title: 'LLD: Design a Vending Machine', difficulty: 'Med' },
  { id: 'oop_10', title: 'UML Class Diagram: Telecom Subscription', difficulty: 'Med' },
];

const BEHAVIORAL_QUESTIONS = [
  'Tell me about a major technical challenge you overcame',
  'Describe a conflict with a teammate and how you resolved it',
  'Give an example of leadership without authority',
  'Tell me about a project you are most proud of and why',
  'Describe a time you failed and what you learned from it',
  'How do you prioritize when facing multiple competing deadlines?',
  'Tell me about a time you disagreed with your manager',
  'Describe a time you identified and fixed a production incident under pressure',
  'Give an example of when you delivered impact beyond your scope',
  'How do you handle ambiguity in requirements?',
];

// ──────────────────────────────────────────────────────────────────
// 5.  LEVEL TABLE & XP
// ──────────────────────────────────────────────────────────────────

const LEVEL_TABLE = [
  { level: 1, name: 'Newbie', minXP: 0, maxXP: 300 },
  { level: 2, name: 'Explorer', minXP: 300, maxXP: 700 },
  { level: 3, name: 'Coder', minXP: 700, maxXP: 1200 },
  { level: 4, name: 'Problem Solver', minXP: 1200, maxXP: 1900 },
  { level: 5, name: 'DSA Ninja', minXP: 1900, maxXP: 2600 },
  { level: 6, name: 'Design Thinker', minXP: 2600, maxXP: 3500 },
  { level: 7, name: 'Placement Warrior', minXP: 3500, maxXP: 4500 },
  { level: 8, name: 'Tech Gladiator', minXP: 4500, maxXP: 5800 },
  { level: 9, name: 'System Sage', minXP: 5800, maxXP: 7500 },
  { level: 10, name: 'FAANG Legend', minXP: 7500, maxXP: Infinity },
];

export const XP_VALUES = {
  Easy: 10, Med: 20, Hard: 30, Mock: 50,
  Read: 15, Review: 10, SystemDesign: 35, OOP: 25, Behavioral: 20,
};

export function getXPLevel(xp) {
  const entry = LEVEL_TABLE.find(l => xp >= l.minXP && xp < l.maxXP) || LEVEL_TABLE[LEVEL_TABLE.length - 1];
  const next = LEVEL_TABLE.find(l => l.level === entry.level + 1);
  return {
    level: entry.level,
    name: entry.name,
    currentXP: xp,
    levelXP: entry.minXP,
    nextLevelXP: next ? next.minXP : entry.maxXP,
    progress: next ? ((xp - entry.minXP) / (next.minXP - entry.minXP)) * 100 : 100,
    xpToNext: next ? next.minXP - xp : 0,
  };
}

// ──────────────────────────────────────────────────────────────────
// 6.  AI INFERENCE — Gemini (with retry) + Claude fallback
// ──────────────────────────────────────────────────────────────────

const GEMINI_KEY = 'AIzaSyB8VnEcZY6uqz3LuxihO9e_wWVFx8v_KVA';

// ⚠️  Replace with your real Anthropic key.
// For production, proxy this through a backend — never expose keys in client JS.
const ANTHROPIC_KEY = 'YOUR_ANTHROPIC_API_KEY';

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.0-pro',
];

// ── 6a. Gemini caller — exponential backoff on 429 ────────────────
async function callGemini(prompt) {
  const MAX_RETRIES = 3;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1200 },
          }),
        });

        if (res.status === 404) break; // this model doesn't exist — try next

        if (res.status === 429) {
          // Rate limited — wait exponentially, then retry the same model
          const waitMs = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.warn(`Gemini 429 on ${model}, retrying in ${Math.round(waitMs)}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(r => setTimeout(r, waitMs));
          continue; // retry same model
        }

        if (!res.ok) throw new Error(`Gemini API error ${res.status}`);

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return text; // success

      } catch (err) {
        if (err.message?.includes('404')) break; // try next model
        if (attempt === MAX_RETRIES - 1) throw err; // out of retries — bubble up
        // For other transient errors, wait briefly then retry
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  throw new Error('Gemini unavailable — all models and retries exhausted');
}

// ── 6b. Claude fallback caller ────────────────────────────────────
async function callClaudeFallback(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true', // required for browser calls
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001', // fastest + cheapest
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Claude fallback failed with status ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  // Claude returns content as an array of blocks
  const text = data.content
    ?.filter(block => block.type === 'text')
    ?.map(block => block.text)
    ?.join('') || '';

  return text;
}

// ── 6c. Profile inferrer — tries Gemini, falls back to Claude ─────
export async function inferCompanyProfile(companyName) {
  const prompt = `You are a placement coach with deep knowledge of tech company interviews.
Return ONLY a valid JSON object (no explanation, no markdown fences) for this company's placement interview profile.
Company: ${companyName}

Return EXACTLY this JSON shape with numeric values between 0 and 1:
{
  "dsaWeights": {
    "arrays": 0.0, "strings": 0.0, "graphs": 0.0, "dp": 0.0, "trees": 0.0,
    "sql": 0.0, "security": 0.0, "oop": 0.0, "concurrency": 0.0, "heaps": 0.0,
    "hashing": 0.0, "twopointers": 0.0, "binarysearch": 0.0, "backtracking": 0.0,
    "greedy": 0.0, "slidingwindow": 0.0
  },
  "sdWeights": {
    "distributed": 0.0, "scalability": 0.0, "payments": 0.0, "security": 0.0,
    "realtime": 0.0, "ratelimiting": 0.0, "microservices": 0.0, "caching": 0.0,
    "streaming": 0.0, "fraud": 0.0, "search": 0.0, "telecom": 0.0
  },
  "roundStructure": ["Round Name 1", "Round Name 2", "Round Name 3", "Round Name 4"],
  "focusTags": ["tag1", "tag2", "tag3", "tag4"],
  "difficulty": "medium",
  "color": "#4B5563",
  "emoji": "🏢"
}`;

  let rawText;

  // Try Gemini first (with retry logic)
  try {
    rawText = await callGemini(prompt);
  } catch (geminiErr) {
    console.warn(`Gemini failed (${geminiErr.message}), switching to Claude fallback…`);
    try {
      rawText = await callClaudeFallback(prompt);
    } catch (claudeErr) {
      // Both APIs failed — throw a clear combined error
      throw new Error(
        `Failed to infer profile for "${companyName}".\n` +
        `Gemini: ${geminiErr.message}\n` +
        `Claude: ${claudeErr.message}`
      );
    }
  }

  // Extract JSON — handles any surrounding text or markdown fences
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Could not parse profile JSON for "${companyName}" from AI response`);

  const profile = JSON.parse(jsonMatch[0]);

  // Validate + set defaults for any missing fields
  if (!profile.dsaWeights) profile.dsaWeights = {};
  if (!profile.sdWeights) profile.sdWeights = {};
  if (!profile.roundStructure) profile.roundStructure = ['DSA', 'System Design', 'Behavioral', 'HR'];
  if (!profile.focusTags) profile.focusTags = [companyName.toLowerCase(), 'tech'];
  if (!profile.difficulty) profile.difficulty = 'medium';
  if (!profile.color) profile.color = '#6366F1';
  if (!profile.emoji) profile.emoji = '🏢';

  // Cache for this session — same company never calls the API twice
  COMPANY_PROFILES[companyName] = profile;

  return profile;
}


// ──────────────────────────────────────────────────────────────────
// 7.  ROADMAP GENERATOR  — Scoring + Phase Builder
// ──────────────────────────────────────────────────────────────────

// Foundation topics are always taught first regardless of company weight
const FOUNDATION_TOPICS = new Set(['arrays', 'strings', 'hashing', 'twopointers', 'slidingwindow', 'greedy', 'binarysearch']);

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function makeTask(q, phaseIdx, weekIdx, taskIdx, type) {
  const prefixes = { DSA: 'Solve', SystemDesign: 'Design', OOP: 'Practice LLD', Mock: 'Mock', Read: 'Read', Review: 'Review' };
  return {
    id: `p${phaseIdx}_w${weekIdx}_${type}_${taskIdx}_${q.id || taskIdx}`,
    title: `${prefixes[type] || type}: ${q.title || q}`,
    type,
    difficulty: q.difficulty || (type === 'Mock' ? 'Hard' : type === 'Read' ? 'Med' : 'Easy'),
    resourceUrl: q.leetcodeUrl || null,
    completed: false,
    topic: q.topic || q.domain || null,
    score: q.score || 0,
    components: q.components || null,
  };
}

function makeSimple(title, phaseIdx, weekIdx, taskIdx, type, difficulty = 'Med') {
  return {
    id: `p${phaseIdx}_w${weekIdx}_${type}_simple_${taskIdx}`,
    title,
    type,
    difficulty,
    resourceUrl: null,
    completed: false,
    topic: null,
    components: null,
  };
}

export function generateRoadmap(companyProfile, daysToInterview, companyName) {
  // ── Step 1: Score every DSA question against company weights ──
  const scoredDSA = DSA_BANK
    .map(q => ({ ...q, score: companyProfile.dsaWeights[q.topic] ?? 0.3 }))
    .sort((a, b) => b.score - a.score);

  // ── Step 2: Score every SD question against company weights ──
  const scoredSD = SD_BANK
    .map(q => ({ ...q, score: companyProfile.sdWeights[q.domain] ?? 0.3 }))
    .sort((a, b) => b.score - a.score);

  // ── Step 3: Determine intensity based on days ──
  const intensity = daysToInterview < 30 ? 'sprint' : daysToInterview < 60 ? 'normal' : 'deep';
  const dsaCount = { sprint: 14, normal: 22, deep: 32 }[intensity];
  const sdCount = { sprint: 5, normal: 9, deep: 14 }[intensity];

  const topDSA = scoredDSA.slice(0, dsaCount);
  const topSD = scoredSD.slice(0, sdCount);

  // ── Step 4: Detect round structure specifics ──
  const rounds = companyProfile.roundStructure || ['DSA', 'System Design', 'Behavioral', 'HR'];
  const hasOOP = rounds.some(r => /oop|lld/i.test(r));
  const hasSecurity = rounds.some(r => /security/i.test(r));
  const hasTwoSD = rounds.filter(r => /system design/i.test(r)).length >= 2;
  const hasCompanyRound = rounds.length >= 5; // e.g., Googleyness, Bar Raiser

  // ── Step 5: Partition DSA into Foundation vs Advanced ──
  const foundationDSA = topDSA.filter(q => FOUNDATION_TOPICS.has(q.topic));
  const advancedDSA = topDSA.filter(q => !FOUNDATION_TOPICS.has(q.topic));

  // ── Step 6: Pick phase 2 questions ──
  const phase2Questions = hasOOP
    ? [...advancedDSA.filter(q => ['oop', 'concurrency', 'sql'].includes(q.topic)), ...OOP_TASKS.slice(0, 4)]
    : advancedDSA;

  // ── Step 7: Filter phase 3 SD ──
  const phase3SD = hasSecurity
    ? [...topSD.filter(q => ['security', 'fraud', 'payments'].includes(q.domain)), ...topSD.filter(q => !['security', 'fraud', 'payments'].includes(q.domain))].slice(0, sdCount)
    : topSD;

  // ── Step 8: Compute week distribution ──
  const totalWeeks = Math.max(5, Math.floor(daysToInterview / 7));
  const phaseWeeks = [0.20, 0.25, 0.25, 0.15, 0.15].map(s => Math.max(1, Math.round(totalWeeks * s)));

  // ── Phase names from round structure ──
  const phaseTitle2 = hasOOP ? 'OOP & Low-Level Design' : hasTwoSD ? 'DSA Mastery' : 'Advanced DSA';
  const phaseTitle3 = hasSecurity ? 'Security & System Design' : hasTwoSD ? 'System Design (Round 2)' : 'System Design';
  const phaseTitle4 = rounds.find(r => /behavioral|hr/i.test(r)) || 'Behavioral';
  const phaseTitle5 = hasCompanyRound ? (rounds[4] || 'Final Sprint') : 'Final Sprint';

  const ph1w = phaseWeeks[0], ph2w = phaseWeeks[1], ph3w = phaseWeeks[2], ph4w = phaseWeeks[3], ph5w = phaseWeeks[4];

  // ─── Build Phase 1: Foundation ────────────────────────────────
  const ph1Chunks = chunk(foundationDSA.length ? foundationDSA : topDSA.slice(0, 8), Math.max(1, Math.ceil(Math.min(foundationDSA.length || 8, 8) / ph1w)));
  const phase1 = {
    id: 'phase_1', phaseNum: 1, title: 'Foundation', icon: '📐',
    description: `Core ${hasOOP ? 'Arrays, Strings, SQL' : 'Arrays, Strings, Hashing'} — essential for ${companyName}`,
    type: 'DSA',
    weeks: Array.from({ length: ph1w }, (_, wi) => {
      const qs = ph1Chunks[wi] || [];
      return {
        id: `p1_w${wi + 1}`,
        title: `Week ${wi + 1} · Foundation Essentials`,
        meta: 'Arrays · Strings · Hashing — the building blocks',
        topics: ['arrays', 'strings', 'hashing'],
        tasks: [
          ...qs.map((q, ti) => makeTask(q, 1, wi + 1, ti, 'DSA')),
          makeSimple(`Read: Time & Space Complexity cheatsheet for ${companyName}`, 1, wi + 1, 'r1', 'Read', 'Easy'),
          makeSimple(`Review: ${companyName} most-asked foundation problems`, 1, wi + 1, 'rv1', 'Review', 'Easy'),
        ],
      };
    }),
  };

  // ─── Build Phase 2: Advanced DSA or OOP ───────────────────────
  const ph2Chunks = chunk(phase2Questions.length ? phase2Questions : advancedDSA.slice(0, 10), Math.max(1, Math.ceil(Math.min(phase2Questions.length || 10, 14) / ph2w)));
  const advTopicLabels = hasOOP ? ['OOP Design', 'Concurrency', 'SQL Mastery', 'LLD Patterns'] : ['Graphs & BFS/DFS', 'Dynamic Programming', 'Trees & BSTs', 'Heaps & Backtracking'];
  const phase2 = {
    id: 'phase_2', phaseNum: 2, title: phaseTitle2, icon: hasOOP ? '🏗️' : '⚡',
    description: hasOOP ? `${companyName} OOP/LLD heavy round — class design & design patterns` : `Trees, Graphs, DP, Heaps — ${companyName}'s hard rounds`,
    type: hasOOP ? 'OOP' : 'DSA',
    weeks: Array.from({ length: ph2w }, (_, wi) => {
      const qs = ph2Chunks[wi] || [];
      const topicLabel = advTopicLabels[wi % advTopicLabels.length];
      return {
        id: `p2_w${wi + 1}`,
        title: `Week ${ph1w + wi + 1} · ${topicLabel}`,
        meta: `${topicLabel} — ${companyName} interview focus area`,
        topics: [topicLabel],
        tasks: [
          ...qs.map((q, ti) => makeTask(q, 2, wi + 1, ti, hasOOP ? 'OOP' : 'DSA')),
          makeSimple(`Read: ${topicLabel} patterns & templates`, 2, wi + 1, 'r1', 'Read', 'Med'),
          makeSimple(`Mock: Timed ${topicLabel} sprint (5 problems, 90 min)`, 2, wi + 1, 'm1', 'Mock', 'Hard'),
        ],
      };
    }),
  };

  // ─── Build Phase 3: System Design (or Security SD) ────────────
  const ph3Chunks = chunk(phase3SD, Math.max(1, Math.ceil(phase3SD.length / ph3w)));
  const off3 = ph1w + ph2w;
  const phase3 = {
    id: 'phase_3', phaseNum: 3, title: phaseTitle3, icon: hasSecurity ? '🔐' : '🏛️',
    description: hasSecurity
      ? `Security-first system design for ${companyName} — fraud, auth, encryption`
      : `Top system design questions weighted for ${companyName}`,
    type: 'SystemDesign',
    weeks: Array.from({ length: ph3w }, (_, wi) => {
      const qs = ph3Chunks[wi] || [];
      return {
        id: `p3_w${wi + 1}`,
        title: `Week ${off3 + wi + 1} · ${hasSecurity ? 'Security Design' : 'System Design'} ${wi + 1}`,
        meta: qs.map(q => q.title.split(' ').slice(0, 3).join(' ')).join(' · ') || 'Architecture & Scale',
        topics: ['SystemDesign'],
        tasks: [
          ...qs.map((q, ti) => makeTask(q, 3, wi + 1, ti, 'SystemDesign')),
          makeSimple(`Read: Designing Data-Intensive Applications — Chapter relevant to ${companyProfile.focusTags[0] || 'scale'}`, 3, wi + 1, 'r1', 'Read', 'Hard'),
          makeSimple(`Mock: Full SD interview (${companyName}-style, 45 min)`, 3, wi + 1, 'm1', 'Mock', 'Hard'),
          makeSimple(`Review: 5 ${companyName} System Design experiences in Vault`, 3, wi + 1, 'rv1', 'Review', 'Easy'),
        ],
      };
    }),
  };

  // ─── Build Phase 4: Behavioral ────────────────────────────────
  const off4 = off3 + ph3w;
  const bqChunks = chunk(BEHAVIORAL_QUESTIONS, Math.max(1, Math.ceil(BEHAVIORAL_QUESTIONS.length / ph4w)));
  const phase4 = {
    id: 'phase_4', phaseNum: 4, title: phaseTitle4, icon: '🤝',
    description: `STAR format stories · ${companyName} values alignment · Leadership principles`,
    type: 'Behavioral',
    weeks: Array.from({ length: ph4w }, (_, wi) => ({
      id: `p4_w${wi + 1}`,
      title: `Week ${off4 + wi + 1} · Behavioral & Culture Fit`,
      meta: 'STAR format • leadership impact • culture alignment',
      topics: ['Behavioral'],
      tasks: [
        ...(bqChunks[wi] || []).map((q, ti) => makeSimple(`Practice STAR: ${q}`, 4, wi + 1, `bq_${ti}`, 'Mock', 'Med')),
        makeSimple(`Read: ${companyName} engineering culture, values & leadership principles`, 4, wi + 1, 'r1', 'Read', 'Easy'),
        makeSimple(`Mock: Full behavioral round (30 min, timer on)`, 4, wi + 1, 'm1', 'Mock', 'Hard'),
      ],
    })),
  };

  // ─── Build Phase 5: Final Sprint ──────────────────────────────
  const off5 = off4 + ph4w;
  const phase5 = {
    id: 'phase_5', phaseNum: 5, title: phaseTitle5, icon: '🎯',
    description: `Full ${companyName} loop simulation · weak area drills · final refinement`,
    type: 'Mock',
    weeks: Array.from({ length: ph5w }, (_, wi) => ({
      id: `p5_w${wi + 1}`,
      title: `Week ${off5 + wi + 1} · Mock Gauntlet ${wi + 1}`,
      meta: `Simulating the full ${companyName} interview loop`,
      topics: ['Mock', 'Revision'],
      tasks: [
        makeSimple(`Mock: ${companyName} DSA Round — 2 problems, 60 min, under pressure`, 5, wi + 1, 'm1', 'Mock', 'Hard'),
        makeSimple(`Mock: ${companyName} ${hasSecurity ? 'Security/SD' : 'System Design'} Round — 45 min`, 5, wi + 1, 'm2', 'Mock', 'Hard'),
        makeSimple(`Mock: ${companyName} ${phaseTitle4} Round — 30 min`, 5, wi + 1, 'm3', 'Mock', 'Hard'),
        makeSimple(`Review: Revisit all wrong answers from mock sessions`, 5, wi + 1, 'rv1', 'Review', 'Med'),
        makeSimple(`Read: ${companyName} engineering blog — 3 recent architecture articles`, 5, wi + 1, 'r1', 'Read', 'Easy'),
        makeSimple(`Drill: Top 5 most-missed ${companyName} ${companyProfile.focusTags[0] || 'DSA'} patterns`, 5, wi + 1, 'dsa1', 'DSA', 'Hard'),
      ],
    })),
  };

  return {
    id: `roadmap_${companyName}_${Date.now()}`,
    company: companyName,
    profile: companyProfile,
    daysToInterview,
    totalWeeks,
    intensity,
    focusTags: companyProfile.focusTags || [],
    roundStructure: rounds,
    generatedAt: new Date().toISOString(),
    phases: [phase1, phase2, phase3, phase4, phase5],
  };
}

// ──────────────────────────────────────────────────────────────────
// 8.  GAMIFICATION HELPERS
// ──────────────────────────────────────────────────────────────────

export function createInitialProgress() {
  return {
    userId: 'local_user',
    completedTasks: [],
    xp: 0,
    currentPhase: 1,
    currentWeek: 1,
    completionDates: [],
    lastActive: null,
  };
}

export function getAllTasks(roadmap) {
  if (!roadmap) return [];
  return roadmap.phases.flatMap(ph => ph.weeks.flatMap(w => w.tasks));
}

export function completeTask(taskId, userProgress, roadmap) {
  const allTasks = getAllTasks(roadmap);
  const task = allTasks.find(t => t.id === taskId);

  const calcXP = (t) => {
    if (!t) return 10;
    if (t.type === 'Mock') return XP_VALUES.Mock;
    if (t.type === 'SystemDesign') return XP_VALUES.SystemDesign;
    if (t.type === 'OOP') return XP_VALUES.OOP;
    if (t.type === 'Read') return XP_VALUES.Read;
    if (t.type === 'Review') return XP_VALUES.Review;
    if (t.difficulty === 'Hard') return XP_VALUES.Hard;
    if (t.difficulty === 'Med') return XP_VALUES.Med;
    return XP_VALUES.Easy;
  };

  if (userProgress.completedTasks.includes(taskId)) {
    return {
      ...userProgress,
      completedTasks: userProgress.completedTasks.filter(id => id !== taskId),
      xp: Math.max(0, userProgress.xp - calcXP(task)),
    };
  }

  const today = new Date().toDateString();
  return {
    ...userProgress,
    completedTasks: [...userProgress.completedTasks, taskId],
    xp: userProgress.xp + calcXP(task),
    completionDates: [...userProgress.completionDates, today],
    lastActive: today,
  };
}

export function unlockNextPhase(userProgress, roadmap) {
  if (!roadmap || userProgress.currentPhase >= 5) return userProgress;
  const phase = roadmap.phases[userProgress.currentPhase - 1];
  if (!phase) return userProgress;
  const phaseTasks = phase.weeks.flatMap(w => w.tasks);
  const done = phaseTasks.filter(t => userProgress.completedTasks.includes(t.id)).length;
  if (phaseTasks.length > 0 && (done / phaseTasks.length) >= 0.80) {
    return { ...userProgress, currentPhase: userProgress.currentPhase + 1 };
  }
  return userProgress;
}

export function calculateStreak(completionDates) {
  if (!completionDates?.length) return { current: 0, best: 0 };
  const unique = [...new Set(completionDates)]
    .map(d => { const dt = new Date(d); dt.setHours(0, 0, 0, 0); return dt; })
    .sort((a, b) => b - a);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diffLatest = Math.floor((today - unique[0]) / 86400000);
  let current = diffLatest <= 1 ? 1 : 0;
  if (current) {
    for (let i = 1; i < unique.length; i++) {
      if (Math.floor((unique[i - 1] - unique[i]) / 86400000) === 1) current++;
      else break;
    }
  }
  let best = current, temp = 1;
  for (let i = 1; i < unique.length; i++) {
    if (Math.floor((unique[i - 1] - unique[i]) / 86400000) === 1) { temp++; if (temp > best) best = temp; }
    else temp = 1;
  }
  return { current, best: Math.max(best, current, unique.length ? 1 : 0) };
}

export function getAIInsight(userProgress, roadmap) {
  if (!roadmap) return '⚡ Search for a company above to generate your AI-personalized roadmap. The engine will score questions against your target company\'s interview pattern.';

  const allTasks = getAllTasks(roadmap);
  const streak = calculateStreak(userProgress.completionDates);
  const level = getXPLevel(userProgress.xp);
  const done = userProgress.completedTasks.filter(id => allTasks.some(t => t.id === id)).length;
  const pct = allTasks.length > 0 ? Math.round((done / allTasks.length) * 100) : 0;
  const company = roadmap.company;
  const focusTags = roadmap.focusTags.slice(0, 2).join(' · ');

  const topicMap = {};
  allTasks.forEach(t => {
    const k = t.topic || t.type || 'General';
    if (!topicMap[k]) topicMap[k] = { total: 0, done: 0 };
    topicMap[k].total++;
    if (userProgress.completedTasks.includes(t.id)) topicMap[k].done++;
  });
  const weakest = Object.entries(topicMap)
    .filter(([k]) => !['Read', 'Review', 'Mock', 'General', null].includes(k))
    .map(([k, v]) => ({ topic: k, pct: v.total ? (v.done / v.total) * 100 : 0 }))
    .sort((a, b) => a.pct - b.pct)[0];

  if (!done) return `🚀 Your ${company} roadmap is live! Focus on the top-weighted topics: ${focusTags}. Start Phase 1 — ${company} asks these in 90% of screening rounds.`;
  if (streak.current === 0) return `⚠️ No activity today. You're ${pct}% done with your ${company} roadmap — don't break momentum. Solve one problem to restart your streak. Best so far: ${streak.best} days.`;
  if (streak.current >= 14) return `🔥 ${streak.current}-day streak — elite consistency! Level ${level.level}: ${level.name}. Next target: ${weakest?.topic || 'System Design'} (${Math.round(weakest?.pct || 0)}% complete). ${company} interviews are close!`;
  if (weakest && weakest.pct < 25) return `📊 ${pct}% through ${company} roadmap. Critical gap: "${weakest.topic}" at ${Math.round(weakest.pct)}% — ${company} weights this at ${Math.round((roadmap.profile?.dsaWeights?.[weakest.topic] || 0.5) * 100)}%. Fix this before mocks!`;

  return `✅ ${pct}% complete — Level ${level.level} (${level.name}). ${company} focus areas: ${focusTags}. ${streak.current}-day streak 🔥. ${weakest ? `Weakest: ${weakest.topic}.` : 'Solid across all topics!'} ${level.xpToNext} XP to level up.`;
}