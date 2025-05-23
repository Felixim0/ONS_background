import express from 'express';

const app = express();

app.use(express.static('.', { extensions: ['html'] }));

console.log('Listening on port 3000! at http://localhost:3000');

app.listen(3000);