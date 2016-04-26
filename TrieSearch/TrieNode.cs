using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrieSearch {
    public class TrieNode {
        private string letter;
        private Dictionary<string, TrieNode> children;
        private bool wordEnd;
        private int numChildren;

        public TrieNode(string letter) {
            children = new Dictionary<string, TrieNode>();
            this.letter = letter;
            this.wordEnd = false;
            numChildren = 0;
        }

        public TrieNode AddEntry(string entry) {
            TrieNode child = new TrieNode(entry);
            if (!children.ContainsKey(entry)) {
                children.Add(entry, child);
            }
            numChildren++;
            return child;
        }

        public void complete() {
            wordEnd = true;
        }

        public bool IsComplete() {
            return wordEnd;
        }

        public string GetLetter() {
            return letter;
        }

        public bool HasChildren() {
            return numChildren > 0;
        }

        public Dictionary<string, TrieNode> GetChildren() {
            return children;
        }
    }
}