let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app.js");

//Assertion Style
chai.should();

chai.use(chaiHttp);


describe('Tasks API', ()=> {
  /**
   * Test POST
   */
  describe("POST /Diagnosis", () => {

    it("Input random string as symtpom, expect 404 status", (done) => {
      const task = (
        {"flag":0, "symp": ["a"]}
      );
      chai.request(server)
        .post("/Diagnosis")
        .send(task)
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });

    it("Input fever as symtpom", (done) => {
      const task = (
        {"flag":0, "symp": ["fever"]}
        );
      chai.request(server)
        .post("/Diagnosis")
        .send(task)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('probability').exist;
          response.body.should.have.property('probability').to.include({
            "abdominal pain": 7.692307692307692,
            "COVID-19": 7.692307692307692,
            "flu": 5.88235294117647
          });
          done();
        });
    });

    it("Further input diarrhea as positive", (done) => {
      const task = (
        {"flag":1, "symp": ["fever"], "answers":[{"diarrhea":1}]}
      );
      chai.request(server)
        .post("/Diagnosis")
        .send(task)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          // response.body.should.have.property('probability').not.exist;
          done();
        });
    });

    it("Further input phlegm as negative", (done) => {
      const task = (
        {"flag":1, "symp": ["fever","diarrhea"], "answers":[{"phlegm":0}]}
      );
      chai.request(server)
        .post("/Diagnosis")
        .send(task)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          // response.body.should.have.property('probability').not.exist;
          done();
        });
    });

  });
});


  describe('Tasks API', ()=> {

    describe("POST /Diagnosis", () => {
      it("When probability of any condition is greater than 95%, it should end diagnose.",
        (done) => {
        const task = (
          {"flag":0, "symp": ["nausea","thin stools","belly bloating","watery stools","cramps"]}
        );
        chai.request(server)
          .post("/Diagnosis")
          .send(task)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('probability').exist;
            response.body.should.have.property('endDiagnose').eq(1);
            done();
          });
      });
  });
});