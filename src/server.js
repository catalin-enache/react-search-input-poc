import express from 'express';
import cors from 'cors';
import { getRandomChars } from './lib/getRandomChars.js';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cors({
    origin: '*', // Allow only this origin to access
    methods: ['POST', 'GET'] // Allow only these methods
  })
);

function generateHints(inputString) {
  return [
    `${inputString || 'default hint 1'} ${getRandomChars(3)}`,
    `${getRandomChars(3)} ${inputString || 'default hint 2'} ${getRandomChars(3)}`,
    `${getRandomChars(3)} ${inputString || 'default hint 3'}`
  ];
}

app.post('/get-hints', (req, res) => {
  if (!req.body || req.body.inputString === undefined) {
    return res.status(400).send('Bad Request: Missing "inputString" field');
  }
  const inputString = req.body.inputString;
  const hints = generateHints(inputString);
  res.json({ inputString, hints });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
