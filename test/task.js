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
    it("A simple test(200 status)", (done) => {
      const task = ({"flag":0, "symp": ["fever", "headache"]});
      chai.request(server)
        .post("/Diagnosis")
        .send(task)
        .end((err, response) => {
          response.should.have.status(200);
          // response.body.should.be.a('object');
          // response.body.should.have.property('id').eq(4);
          // response.body.should.have.property('name').eq("Task 4");
          // response.body.should.have.property('completed').eq(false);
          done();
        });
    });

    // it("It should NOT POST a new task without the name property", (done) => {
    //   const task = {
    //     completed: false
    //   };
    //   chai.request(server)
    //     .post("/api/tasks")
    //     .send(task)
    //     .end((err, response) => {
    //       response.should.have.status(400);
    //       response.text.should.be.eq("The name should be at least 3 chars long!");
    //       done();
    //     });
    // });

  });


});