using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrieSearch {
    public class TrieTree {
        private TrieNode overallRoot;
        private Int64 numWords;

        public TrieTree() {
            overallRoot = new TrieNode("");
            numWords = 0;
        }

        public void AddWord(string word) {
            AddLetter(overallRoot, word.ToLower());
            numWords++; 
        }

        private void AddLetter(TrieNode root, string s) {
            if (s.Length < 1) {
                root.complete();
            } else {
                Dictionary<string, TrieNode> children = root.GetChildren();
                TrieNode next;
                if (s[0] != ' ' && (s[0] > 'z' || s[0] < 'a')) { // Skip invalid characters
                    AddLetter(root, s.Substring(1));
                } else {
                    // Move to node if it has the key
                    if (children.ContainsKey(s.Substring(0, 1))) {
                        next = children[s.Substring(0,1)];
                    } else { // Add they new letter if not in children
                        next = root.AddEntry(s.Substring(0, 1));
                    }
                    AddLetter(next, s.Substring(1));
                }
            }
        }

        public List<string> GetSuggestions(string seq) {
            seq = seq.ToLower();
            TrieNode startFrom = LastKnownCharacter(seq, overallRoot);
            List<string> suggestions = new List<string>();
            GetSuggestions(startFrom, ref suggestions, seq);
            return suggestions;
        }

        private void GetSuggestions(TrieNode root, ref List<string> suggestions, string word) {
            if (root != null && suggestions.Count <= 10) {
                if (root.IsComplete()) {
                    suggestions.Add(word);
                }
                if (root.HasChildren()) {
                    Dictionary<string, TrieNode> children = root.GetChildren();
                    foreach (string key in children.Keys) {
                        GetSuggestions(children[key], ref suggestions, word + children[key].GetLetter());
                    }
                }
            }
        }

        private TrieNode LastKnownCharacter(string s, TrieNode root) {
            if (s.Length == 0 || root == null) {
                return root;
            } else {
                char firstChar = s.ToCharArray()[0];
                TrieNode next = null;
                if (root.GetChildren().ContainsKey(s.Substring(0, 1))) {
                    next = root.GetChildren()[s.Substring(0, 1)];
                }
                return LastKnownCharacter(s.Substring(1), next);
            }
        }
    }
}