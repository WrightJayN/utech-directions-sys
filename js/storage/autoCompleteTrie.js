// js/storage/autocompleteTrie.js

class TrieNode {
    constructor() {
        this.children = {};     // Use plain object {} for speed and simplicity
        this.isEnd = false;     // True if this node ends a complete room name
    }
}

class AutocompleteTrie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insert a single room name (lowercase)
    insert(word) {
        let node = this.root;
        let wordStr = String(word);
        for (const char of wordStr) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEnd = true;
    }

    // Insert all room names from the roomsHashMap
    insertAll(roomsHashMap) {
        for (const roomName of roomsHashMap.keys()) {
            this.insert(roomName);
        }
    }

    // Find all complete words that start with the given prefix
    // Returns array of suggestions (max 10 by default)
    getSuggestions(prefix, maxSuggestions = 10) {
        const results = [];

        // Step 1: Traverse to the end of the prefix
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) {
                return []; // No matches
            }
            node = node.children[char];
        }

        // Step 2: Use DFS to collect all complete words below this node
        const dfs = (currentNode, currentWord) => {
            if (results.length >= maxSuggestions) return;
            if (currentNode.isEnd) {
                results.push(prefix + currentWord);
            }
            // Explore children in alphabetical order for nice sorting
            const sortedChars = Object.keys(currentNode.children).sort();
            for (const char of sortedChars) {
                dfs(currentNode.children[char], currentWord + char);
            }
        };

        dfs(node, "");
        return results;
    }
}

export { AutocompleteTrie };