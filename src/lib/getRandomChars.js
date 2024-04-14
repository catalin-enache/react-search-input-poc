// using JS to share it with server which is JS too
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const getRandomChars = (num) =>
  Array.from({ length: num })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
