document.getElementById('summarizeBtn').addEventListener('click', () => {
    const text = document.getElementById('inputText').value;
    if (text.trim() === '') {
        alert('Please enter some text to summarize.');
        return;
    }
    
    const summary = summarizeText(text);
    document.getElementById('summaryOutput').textContent = summary;
});

/**
 * Summarizes text using a frequency-based extractive method.
 * @param {string} text - The input text to summarize.
 * @param {number} numSentences - The desired number of sentences in the summary.
 * @returns {string} The summarized text.
 */
function summarizeText(text, numSentences = 5) {
    // Split the text into sentences
    const sentences = text.split(/(?<=[.!?])\s/).filter(s => s.trim().length > 0);

    // Create a frequency map of words
    const wordFrequency = {};
    const words = text.toLowerCase().match(/\b\w+\b/g);
    
    // Define a simple list of common words (stopwords) to ignore
    const stopwords = new Set([
        'a', 'an', 'and', 'the', 'in', 'on', 'at', 'for', 'of', 'to', 'is', 'it', 
        'with', 'as', 'that', 'from', 'but', 'by', 'be', 'are', 'was', 'were'
    ]);

    words.forEach(word => {
        if (!stopwords.has(word) && word.length > 2) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
    });

    // Score sentences based on word frequency
    const sentenceScores = sentences.map(sentence => {
        let score = 0;
        const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        sentenceWords.forEach(word => {
            if (wordFrequency[word]) {
                score += wordFrequency[word];
            }
        });
        return { sentence, score };
    });

    // Sort sentences by score in descending order
    sentenceScores.sort((a, b) => b.score - a.score);

    // Select the top sentences for the summary
    const summarySentences = sentenceScores.slice(0, numSentences).map(s => s.sentence);

    // Reorder the summary sentences to appear in their original order
    const originalOrderSummary = sentences.filter(sentence => summarySentences.includes(sentence));

    return originalOrderSummary.join(' ');
}
