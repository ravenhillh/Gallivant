import express from 'express';
import path from 'path';
require('./db')

const app = express();
app.use(express.static(path.resolve(__dirname, '../client/dist')));


app.listen(3000, () => {
  console.info('Gallivant server listening on port 3000. http://localhost:3000');
});
