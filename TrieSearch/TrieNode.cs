using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrieSearch {
    public class TrieNode {
        public ISet<int> children;
        public string value;
        public bool isEnd;

        public TrieNode(string value) {
            children = new HashSet<int>();
            this.value = value;
            this.isEnd = false;
        }
    }
}