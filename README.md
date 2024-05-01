# Node.JS Restful API & Neo4j graph database for a health application
#### This is an example of a Node.js Restful Api, using Neo4j graph database and Heroku cloud service, realizing CRUD opeartions and calculating the probabilities of diseases based on JSON format input of symptoms.

## Project Setup Instructions

### Set up environment for MacOS

Follow these steps to set up your development environment:

#### 1. Download and install NodeJS
```bash
brew install node
```
#### 2. Download and install Neo4j Desktop
https://neo4j.com/download/neo4j-%20desktop/?edition=desktop&flavour=osx&release=1.3.10&offline=false
#### 3. Download and install IntelliJ IDEA
https://www.jetbrains.com/idea/download/#section=mac
#### 4. Download and install Postman
https://dl.pstmn.io/download/latest/osx
#### 5. Download and install the Heroku Cli on your laptop
```bash
brew install Heroku
```
#### 6. Login to Heroku
```bash
$ heroku login
```
#### 7. Use Git to clone the project
```bash
$ heroku git: clone -a node.js-neo4j-restfulApi
$ cd node.js-neo4j-restfulApi
```
#### 8. Install all the dependencies
```bash
npm install
```
#### 9. Run the project
#### 10. Give the HTTP request through Postman
```json
{
  "flag": 1,
  "symp": ["fever", "headache"],
  "answers": {"diarrhea": 1, "chill": 0}
}
```

