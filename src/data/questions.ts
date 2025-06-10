export type Problem = {
  id: string;
  title: string;
  description: string;
  examples: string;
  constraints: string;
};

export const PROBLEMS: Problem[] = [
  // Easy
  {
    id: "1",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] == 9`,
    constraints:
      "- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- Only one valid answer exists."
  },
  {
    id: "2",
    title: "Palindrome Number",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: `Input: x = 121
Output: true

Input: x = -121
Output: false`,
    constraints: "-2^31 <= x <= 2^31 - 1"
  },
  {
    id: "3",
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: `Input: s = "()"
Output: true

Input: s = "([)]"
Output: false`,
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'."
  },
  {
    id: "4",
    title: "Merge Two Sorted Lists",
    description:
      "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    examples: `Input: l1 = [1,2,4], l2 = [1,3,4]
Output: [1,1,2,3,4,4]`,
    constraints:
      "The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100"
  },
  {
    id: "5",
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve from one transaction.",
    examples: `Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price=1) and sell on day 5 (price=6)`,
    constraints:
      "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4"
  },

  // Medium
  {
    id: "6",
    title: "Add Two Numbers",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.",
    examples: `Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807`,
    constraints:
      "The number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9\nIt is guaranteed that the list represents a number that does not have leading zeros."
  },
  {
    id: "7",
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: `Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`,
    constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces."
  },
  {
    id: "8",
    title: "Number of Islands",
    description:
      "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    examples: `Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1`,
    constraints:
      "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is '0' or '1'."
  },
  {
    id: "9",
    title: "Search in Rotated Sorted Array",
    description:
      "Suppose an array sorted in ascending order is rotated at some pivot unknown to you. Search a given target in this array.",
    examples: `Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4`,
    constraints:
      "1 <= nums.length <= 5000\n-10^4 <= nums[i], target <= 10^4\nAll values of nums are unique."
  },
  {
    id: "10",
    title: "Coin Change",
    description:
      "You are given coins of different denominations and a total amount of money. Compute the fewest number of coins needed to make up that amount.",
    examples: `Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1`,
    constraints:
      "1 <= coins.length <= 12\n0 <= amount <= 10^4\nYou can assume you have infinite coins of each denomination."
  },

  // Hard
  {
    id: "11",
    title: "Median of Two Sorted Arrays",
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    examples: `Input: nums1 = [1,3], nums2 = [2]
Output: 2.0`,
    constraints:
      "nums1.length == m\nnums2.length == n\n0 <= m, n <= 1000\n-10^6 <= nums1[i], nums2[i] <= 10^6"
  },
  {
    id: "12",
    title: "Longest Valid Parentheses",
    description:
      "Given a string containing just '(' and ')', find the length of the longest valid (well-formed) parentheses substring.",
    examples: `Input: s = "(()"
Output: 2`,
    constraints: "0 <= s.length <= 3 * 10^4"
  },
  {
    id: "13",
    title: "Trapping Rain Water",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: `Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6`,
    constraints: "n == height.length\n0 <= n <= 3 * 10^4\n0 <= height[i] <= 10^5"
  },
  {
    id: "14",
    title: "Word Ladder",
    description:
      "Given two words (beginWord and endWord) and a dictionary's word list, find the length of shortest transformation sequence from beginWord to endWord.",
    examples: `Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5`,
    constraints:
      "1 <= beginWord.length <= 10\nendWord.length == beginWord.length\n1 <= wordList.length <= 5000\nAll words have the same length."
  },
  {
    id: "15",
    title: "Edit Distance",
    description:
      "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
    examples: `Input: word1 = "horse", word2 = "ros"
Output: 3`,
    constraints: "0 <= word1.length, word2.length <= 500"
  },
  {
    id: "16",
    title: "Merge k Sorted Lists",
    description:
      "Merge k sorted linked lists and return it as one sorted list.",
    examples: `Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]`,
    constraints:
      "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500"
  },
  {
    id: "17",
    title: "Word Search",
    description:
      "Given a 2D board and a word, find if the word exists in the grid by constructing it from letters of sequentially adjacent cells.",
    examples: `Input: board = [["A","B","C","E"],
                     ["S","F","C","S"],
                     ["A","D","E","E"]], word = "ABCCED"
Output: true`,
    constraints:
      "m == board.length\nn == board[i].length\n1 <= m, n <= 200"
  },
  {
    id: "18",
    title: "Serialize and Deserialize Binary Tree",
    description:
      "Design an algorithm to serialize and deserialize a binary tree.",
    examples: `Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]`,
    constraints:
      "The number of nodes in the tree is in the range [0, 10^4].\n-1000 <= Node.val <= 1000"
  },
  {
    id: "19",
    title: "Largest Rectangle in Histogram",
    description:
      "Given an array of integers heights representing the histogram's bar height, find the area of largest rectangle in the histogram.",
    examples: `Input: heights = [2,1,5,6,2,3]
Output: 10`,
    constraints: "1 <= heights.length <= 10^5\n0 <= heights[i] <= 10^4"
  },
  {
    id: "20",
    title: "Sliding Window Maximum",
    description:
      "Given an array nums and a sliding window size k, return the max sliding window values.",
    examples: `Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]`,
    constraints:
      "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length"
  }
];
