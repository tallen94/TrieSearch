using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace TrieSearch {
    public class TrieGraph {
        private TrieNode[] nodes;
        private int numTitles;
        private int numNodes;

        public TrieGraph() {
            nodes = new TrieNode[100];
            nodes[0] = new TrieNode("");
            numTitles = 0;
            numNodes = 1;
        }

        public int NumTitles() {
            return numTitles;
        }

        public void AddTitle(string title) {
            string remaining = title;
            int last = Build(0, ref remaining);
            if (!remaining.Equals("")) {
                TrieNode newEnd = new TrieNode(remaining);
                newEnd.isEnd = true;
                nodes[last].children.Add(numNodes);
                nodes[numNodes] = newEnd;
                numNodes++;
                numTitles++;
            }
            if (((double)numNodes) / nodes.Length > .75) {
                ExpandNodes();
            }
        }

        private void ExpandNodes() {
            TrieNode[] newNodes = new TrieNode[nodes.Length * 2];
            for (int i = 0; i < nodes.Length; i++) {
                newNodes[i] = nodes[i];
            }
            this.nodes = newNodes;
        }

        private int Build(int root, ref string remaining) {
            foreach(int child in nodes[root].children) {
                string childval = nodes[child].value;
                string match = MaxFrontMatch(childval, remaining);
                remaining = remaining.Substring(match.Length);
                if(!match.Equals("") && !remaining.Equals("")) {
                    if (match.Equals(childval)) {
                        return Build(child, ref remaining);
                    } else {
                        TrieNode spawn = new TrieNode(childval.Substring(match.Length));
                        nodes[child].value = match;
                        spawn.children = nodes[child].children;
                        nodes[child].children = new HashSet<int>();
                        nodes[child].children.Add(numNodes);
                        if(nodes[child].isEnd) {
                            spawn.isEnd = true;
                            nodes[child].isEnd = false;
                        }
                        nodes[numNodes] = spawn;
                        numNodes++;
                        return child;
                    }
                }
            }
            return root;
        }

        private string MaxFrontMatch(string s1, string s2) {
            int smallest;
            string maxMatch = "";
            if (s1.Length > s2.Length) {
                smallest = s2.Length;
            } else {
                smallest = s1.Length;
            }

            for (int i = 0; i < smallest; i++) {
                string sub1 = s1.Substring(0, i + 1);
                string sub2 = s2.Substring(0, i + 1);
                if (sub1.Equals(sub2)) {
                    maxMatch = sub1;
                } else {
                    break;
                }
            }
            return maxMatch;
        }

        public List<string> GetSuggestions(string s) {
            List<string> suggestions = new List<string>();
            string found = "";
            int last = FindLast(0, s, ref found);
            AddPathsFromNode(last, found, ref suggestions);
            return suggestions;
        }

        public int FindLast(int root, string s, ref string found) {
            foreach (int child in nodes[root].children) {
                string childValue = nodes[child].value;
                string match = MaxFrontMatch(childValue, s);
                if (match.Equals(childValue)) {
                    found = found + match;
                    return FindLast(child, s.Substring(match.Length), ref found);
                } else if (!match.Equals("")) {
                    found = found + match;
                    return child;
                }
            }
            return root;
        }

        public void AddPathsFromNode(int root, string word, ref List<string> suggestions) {
            if (suggestions.Count <= 1000) {
                if (nodes[root].isEnd) {
                    suggestions.Add(word);
                }
                foreach (int node in nodes[root].children) {
                    AddPathsFromNode(node, word + nodes[node].value, ref suggestions);
                }
            }
        }
    }
}