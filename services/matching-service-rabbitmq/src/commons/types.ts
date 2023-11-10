export type Match = {
  socketId: string;
  difficulty: Difficulty;
  category: string;
  language: Language;
};

export enum Difficulty {
  Easy,
  Medium,
  Hard,
}

export const categories = new Set([
  "Array",
  "Hash Table",
  "Linked List",
  "Math",
  "Recursion",
  "String",
  "Sliding Window",
  "Binary Search",
  "Divide and Conquer",
  "Dynamic Programming",
  "Two Pointers",
  "Greedy",
  "Trie",
  "Sorting",
  "Backtracking",
  "Stack",
  "Heap (Priority Queue)",
  "Merge Sort",
  "String Matching",
  "Bit Manipulation",
  "Matrix",
  "Monotonic Stack",
  "Simulation",
  "Combinatorics",
  "Memoization",
  "Tree",
  "Depth-First Search",
  "Binary Tree",
  "Binary Search Tree",
  "Breadth-First Search",
  "Union Find",
  "Graph",
  "Design",
  "Doubly-Linked List",
  "Geometry",
  "Interactive",
  "Bucket Sort",
  "Radix Sort",
  "Counting",
  "Data Stream",
  "Iterator",
  "Rolling Hash",
  "Hash Function",
  "Enumeration",
  "Number Theory",
  "Topological Sort",
  "Prefix Sum",
  "Quickselect",
  "Binary Indexed Tree",
  "Segment Tree",
  "Line Sweep",
  "Ordered Set",
  "Queue",
  "Monotonic Queue",
  "Counting Sort",
  "Brainteaser",
  "Game Theory",
  "Eulerian Circuit",
  "Randomized",
  "Reservoir Sampling",
  "Shortest Path",
  "Bitmask",
  "Probability and Statistics",
  "Rejection Sampling",
  "Suffix Array",
  "Minimum Spanning Tree",
  "Biconnected Component",
  "Strongly Connected Component",
  "Database",
  "Shell",
  "Concurrency",
]);

export enum Language {
  CoffeeScript,
  Cpp,
  CSharp,
  Java,
  JavaScript,
  Php,
  Python,
  Ruby,
  TypeScript,
}

export const DIFFICULTIES = ["easy", "medium", "hard"];
