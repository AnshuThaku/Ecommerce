const crypto = require('crypto');

const generatePassword = () => {
  // A curated list of elegant/luxury-themed words to match Truee's brand
  const words = [
    'Velvet', 'Pillar', 'Horizon', 'Crystal', 'Aura', 'Marble', 
    'Golden', 'Crown', 'Zenith', 'Silk', 'Lumina', 'Crest', 
    'Onyx', 'Platinum', 'Sterling'
  ];
  const symbols = ['!', '@', '#', '$', '%', '*', '^'];

  // Helper function to get a cryptographically secure random item from an array
  const getRandomItem = (arr) => arr[crypto.randomInt(0, arr.length)];

  // Select 3 random words
  const word1 = getRandomItem(words);
  const word2 = getRandomItem(words);
  const word3 = getRandomItem(words);

  // Generate a random 2-digit number (10 to 99)
  const number = crypto.randomInt(10, 100); 

  // Select a random symbol
  const symbol = getRandomItem(symbols);

  // Combine them into the passphrase format
  return `${word1}-${word2}-${word3}-${number}${symbol}`;
};

module.exports = generatePassword;