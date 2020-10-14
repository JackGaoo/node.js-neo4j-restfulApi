const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');

const Neo4jApi = require('./neo4j-api');


const app = express();
const db = new Neo4jApi();
const port = process.env.PORT;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log("get nodes");
  db.getNodes ()
    .then((nodes) => {
      res.json(nodes);
      //res.render('./home.pug', { nodes });
    })
    .catch(error => res.status(404).send(error));
});

app.post('/', (req, res) => {
  const name = req.body.name;
  console.log(name);
  db.createNode(name)
    .then(() => res.redirect('/'))
    .catch(error => res.status(500).send(error));
});
//aaa
app.get('/search', (req, res) => {
  console.log("get nodes");
  const name = req.body.name;
  db.get_one_Node(name)
    .then((nodes) => {
      res.json(nodes);
      //res.render('./home.pug', { nodes });
    })
    .catch(error => res.status(404).send(error));
});

app.post('/clear', (req, res) => {
  db.clearNodes()
    .then(() => res.redirect('/'))
    .catch(error => res.status(500).send(error));
});

app.listen(port,
  () => console.log(`Server listening on http://localhost:${port}`));
