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

app.get('/search', async (req, res) => {
  const name = req.body.name;
  let results = [];
  for (let i = 0; i < name.length; i++) {
    console.log("get one node");
    await db.get_one_Node(name[i])
      .then((nodes) => {
        console.log(typeof(nodes));
        results = results.concat(nodes);
        //res.render('./home.pug', { nodes });
      })
      .catch(error => res.status(404).send(error));
  }
  // loop result array to count the occurrence of each disease
  let disease_count = {};
  for (let disease of results) {
    const name = disease.name
    if (disease_count.hasOwnProperty(name)) {
      disease_count[name] += 1;
    } else {
      disease_count[name] = 1;
    }
  }
  res.json(disease_count);
})

app.post('/clear', (req, res) => {
  db.clearNodes()
    .then(() => res.redirect('/'))
    .catch(error => res.status(500).send(error));
});

app.listen(port,
  () => console.log(`Server listening on http://localhost:${port}`));
