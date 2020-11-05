const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');

const Neo4jApi = require('./neo4j-api');
// const rountes = require('./route')

const app = express();
const db = new Neo4jApi();
const port = process.env.PORT;

module.exports = app

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/Diagnosis', async (req, res) => {
  let symptoms = req.body.symp;
  // to record all seen symptoms
  let seen = symptoms;
  if (req.body.flag === 1) {
    let answers = req.body.answers;
    for (let item of answers) {
      for (const [condition, response] of Object.entries(item)) {
        //console.log(response);
        if (response === "yes") {
          symptoms = symptoms.concat(condition);
        }
        seen = seen.concat(condition);
      }
    }
  }
  //console.log(symptoms);
  //console.log(seen);
  let results = [];
  for (let i = 0; i < symptoms.length; i++) {
    console.log("get one symptom");
    await db.getConditions(symptoms[i])
      .then((nodes) => {
        //console.log(typeof(nodes));
        results = results.concat(nodes);
      })
      .catch(error => res.status(404).send(error));
  }
  // loop result array to count the occurrence of each disease
  let disease_count = {};
  let numSymp = {};
  for (let disease of results) {
    const name = disease.name;
    if (disease_count.hasOwnProperty(name)) {
      disease_count[name] += 1;
    } else {
      // add to size object at first seen
      disease_count[name] = 1;
      await db.nodeSize(name)
        .then((n_children) => {
          numSymp[name] = n_children[0];

        })
        .catch(error => res.status(500).send(error));
    }
  }
  // divide occurrence by number of symptoms under a disease
  for (const [key, value] of Object.entries(numSymp)) {
    disease_count[key] /= (value / 100); // a*100 / b == a / (b/100)
  }
  //console.log(disease_count);
  // use reduce to find the condition with max probability
  // get the highest disease with symptoms
  let currDisease = Object.keys(disease_count)
                          .reduce(function(a, b){
                              return disease_count[a] > disease_count[b] ? a : b
                          });
  //sort the probabilities from big to small
  let sort_Disease_count = {};
  let sortDisease = Object.keys(disease_count)
                          .sort(function (a, b){
                              return disease_count[b] - disease_count[a];
                          });
  for(let i = 0; i < sortDisease.length; i++){
    sort_Disease_count[sortDisease[i]] = disease_count[sortDisease[i]];
  }
  //console.log(sort_Disease_count);
  //console.log(disease_count[currDisease]);
  console.log(currDisease, disease_count[currDisease]);
  let endDiagnose = false;
  let finalReturn = {};
  if (disease_count[currDisease] >= 95) {
    endDiagnose = true;
    finalReturn = {"endDiagnose": endDiagnose, "probability": sort_Disease_count};
    res.json(finalReturn);
  } else {
    let currSymps = {};
    await db.getSymptoms (currDisease)
      .then((name) => {
        currSymps = name;
      })
      .catch(error => res.status(404).send(error));

    //exclude the mentioned symptoms
    currSymps = currSymps.filter(function (symp) {
      return !seen.includes(symp);
    });

    // build question object
    const question = {};
    question.text = "Do you have this symptom? "+currSymps[0];
    question.item = {};
    question.item.name = currSymps[0];
    question.item.choices = [{"id": "present",
      "label": "Yes"},
      {"id": "absent",
        "label": "No"}];

    finalReturn = {"question": question, "probability": sort_Disease_count};
    res.json(finalReturn);
  }
})

app.listen(port,
  () => console.log(`Server listening on http://localhost:${port}`));
