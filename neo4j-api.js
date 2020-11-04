const uuid = require('uuid/v4');
const neo4j = require('neo4j-driver').v1;

const graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;


class Neo4jApi {

  constructor() {
    this.driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass), {
      encrypted: 'ENCRYPTION_ON'
    });
  }

  createNode(name) {
    const session = this.driver.session();
    const resp = session
      .run(`
          CREATE (n:EXPRESS_SAMPLE_NAME {
            name: {name},
            uuid: {uuid}
          })
          RETURN n.name`, {
            name,
            uuid: uuid(),
          });

    resp.then(() => session.close())
      .catch(() => session.close());
    return resp;
  }

  getNodes(name) {
    const session = this.driver.session();
    const promise = new Promise((resolve, reject) => {
      session
        .run(`
           MATCH (sy:Symptom)-[:has_symptom]-(con:Condition{name:{name}})
            RETURN sy`, {
          name,
        })
        .then((result) => {
          session.close();
          resolve(result.records
            .map(record => record._fields[0].properties));
        })
        .catch((error) => {
          session.close();
          reject(error);
        });
    });

    return promise;
  }

  get_one_Node(name) {
    const session = this.driver.session();
    const promise = new Promise((resolve, reject) => {
      session
        .run(`
            MATCH (con:Condition)-[:has_symptom]-(sy:Symptom{name:{name}})
            RETURN con`, {
              name,
            })
        .then((result) => {
          session.close();
          resolve(result.records
            .map(record => record._fields[0].properties));
        })
        .catch((error) => {
          session.close();
          reject(error);
        });
    });

    return promise;
  }

  nodeSize(name) {
    const session = this.driver.session();
    const promise = new Promise((resolve, reject) => {
      session
        .run(`
            MATCH (con1:Condition) WHERE con1.name = {name}
            RETURN con1,size((con1)--()) as count`, {
              name,
        })
        .then((result) => {
          session.close();
          resolve(result.records
            .map(record => record._fields[1].low));
        })
        .catch((error) => {
          session.close();
          reject(error);
        });
    });

    return promise;
  }

  clearNodes() {
    const session = this.driver.session();
    return session.run(`
        MATCH (n:EXPRESS_SAMPLE_NAME)
        DELETE n`);
  }

  close() {
    this.driver.close();
  }

}

module.exports = Neo4jApi;
