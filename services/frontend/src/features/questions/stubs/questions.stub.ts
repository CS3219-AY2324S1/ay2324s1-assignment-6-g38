import type { QuestionType } from "../types/question.type";
import { Difficulty } from "../types/question.type";

export const questionsStub: QuestionType[] = [
  {
    id: "1",
    title: "Reverse a String",
    categories: ["Strings", "Algorithms"],
    difficulty: Difficulty.Easy,
    description: `Write a function that reverses a string. The input string is given as an array of characters char[]. Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.
    
    Example 1:
    Input: s = ["h","e","l","l","o"]
    Output: ["o","l","l","e","h"]
    
    Example 2:
    Input: s = ["H","a","n","n","a","h"]
    Output: ["h","a","n","n","a","H"]
    
    Constraints:
    - 1 <= s.length <= 105
    - s[i] is a printable ascii character.`,
    link: "https://leetcode.com/problems/reverse-string/",
  },
  {
    id: "2",
    title: "Detect Cycle in a Linked List",
    categories: ["DataStructures", "Algorithms"],
    difficulty: Difficulty.Medium,
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.
    Example:
    Input: head = [3,2,0,-4], pos = 1
    Output: true
    The explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
    Constraints:
    - The number of the nodes in the list is in the range [0, 104].
    - -105 <= Node.val <= 105
    - pos is -1 or a valid index in the linked-list.`,
    link: "https://leetcode.com/problems/linked-list-cycle/",
  },
  {
    id: "3",
    title: "Convert Roman to Integer",
    categories: ["Algorithms"],
    difficulty: Difficulty.Medium,
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D, and M. For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.
    Given a roman numeral, convert it to an integer.
    Example:
    Input: s = "III"
    Output: 3
    Constraints:
    - 1 <= s.length <= 15
    - s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
    - It is guaranteed that s is a valid roman numeral in the range [1, 3999].`,
    link: "https://leetcode.com/problems/roman-to-integer/",
  },
  {
    id: "4",
    title: "Add Binary Numbers",
    categories: ["BitManipulation", "Algorithms"],
    difficulty: Difficulty.Hard,
    description: `Given two binary strings a and b, return their sum as a binary string. The input strings are both non-empty and contain only characters 1 or 0.
    Example:
    Input: a = "11", b = "1"
    Output: "100"
    Constraints:
    - 1 <= a.length, b.length <= 104
    - a and b consist only of '0' or '1' characters.
    - Each string does not contain leading zeros except for the zero itself.`,
    link: "https://leetcode.com/problems/add-binary/",
  },
  {
    id: "5",
    title: "Compute nth Fibonacci Number",
    categories: ["Recursion", "Algorithms"],
    difficulty: Difficulty.Medium,
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).
    Example:
    Input: n = 2
    Output: 1
    Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.
    Constraints:
    - 0 <= n <= 30`,
    link: "https://leetcode.com/problems/fibonacci-number/",
  },
];
