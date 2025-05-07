
const express = require('express');
const app = express();
const port = 3000; 


const users = [
  { id: 1, username: 'JohnDoe' },
  { id: 2, username: 'JaneSmith' },
  { id: 3, username: 'PeterPan' },
  { id: 4, username: 'AliceWonder' },
  { id: 5, username: 'CharlieBrown' },
  { id: 6, username: 'LucyVanPelt' },
  { id: 7, username: 'LinusVanPelt' },
  { id: 8, username: 'SallyBrown' },
  { id: 9, username: 'Schroeder' },
  { id: 10, username: 'PeppermintPatty' },
];


const posts = [
  { id: 101, userid: 1, content: 'Just posted my first tweet!' },
  { id: 102, userid: 2, content: 'Enjoying a sunny day.' },
  { id: 103, userid: 1, content: 'Learning about microservices.' },
  { id: 104, userid: 3, content: 'Off to Neverland!' },
  { id: 105, userid: 2, content: 'Having some coffee.' },
  { id: 106, userid: 4, content: 'Down the rabbit hole I go...' },
  { id: 107, userid: 5, content: 'Good grief!' },
  { id: 108, userid: 6, content: 'The doctor is in.' },
  { id: 109, userid: 7, content: 'My blanket is my security.' },
  { id: 110, userid: 8, content: 'Poor sweet baby.' },
  { id: 111, userid: 9, content: 'Playing Beethoven.' },
  { id: 112, userid: 10, content: 'Good ol\' Chuck!' },
  { id: 113, userid: 1, content: 'Another update from me.' },
  { id: 114, userid: 2, content: 'Weekend vibes.' },
];


app.get('/users', (req, res) => {
  res.json(users.map(user => ({ id: user.id, username: user.username })));
});


app.get('/users/:userid/posts', (req, res) => {
  const userId = parseInt(req.params.userid);
  const userPosts = posts.filter(post => post.userid === userId);
  res.json(userPosts);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});