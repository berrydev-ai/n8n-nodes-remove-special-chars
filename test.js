// Simple test script for the RemoveSpecialChars node
const { RemoveSpecialCharsNode } = require('./dist/nodes/RemoveSpecialChars/RemoveSpecialChars.node');

// Create a sample text with special characters
const sampleText = 'Here is some text with\u200B invisible\u200C characters\u200D and\uFEFF watermarks\u00AD.';
console.log('Original text:', sampleText);
console.log('Original length:', sampleText.length);

// Test the standard clean function
const cleanText = require('./dist/nodes/RemoveSpecialChars/RemoveSpecialChars.node').__test.cleanSpecialCharacters(sampleText);
console.log('Cleaned text:', cleanText);
console.log('Cleaned length:', cleanText.length);

// Test the aggressive clean function
const aggressiveCleanText = require('./dist/nodes/RemoveSpecialChars/RemoveSpecialChars.node').__test.aggressiveClean(sampleText);
console.log('Aggressively cleaned text:', aggressiveCleanText);
console.log('Aggressively cleaned length:', aggressiveCleanText.length);

// Test the smart clean function
const smartCleanText = require('./dist/nodes/RemoveSpecialChars/RemoveSpecialChars.node').__test.smartClean(sampleText);
console.log('Smart cleaned text:', smartCleanText);
console.log('Smart cleaned length:', smartCleanText.length);

// Display node properties
const node = new RemoveSpecialCharsNode();
console.log('\nNode Properties:');
console.log('Name:', node.description.name);
console.log('Display Name:', node.description.displayName);
console.log('Version:', node.description.version);
console.log('Description:', node.description.description);