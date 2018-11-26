let chai = require("chai"),
  chaiHttp = require("chai-http"),
  mongodb = require("mongodb"),
  { ObjectId } = require("../helpers"),
  expect = chai.expect;

chai.should();
chai.use(chaiHttp);

//Our parent block
describe("Helpers", () => {
  describe("ObjectId", () => {
    it("should return a valid ObjectId if no argument is passed", async function() {
      const id = ObjectId();
      id.should.be.instanceOf(mongodb.ObjectId);
    });

    it("should throw an exception if an invalid string is passed", async function() {
      expect(() => ObjectId("43reg4")).to.throw();
    });

    it("should return a valid ObjectId an integer is passed", async function() {
      const id = ObjectId(3443);
      id.should.be.instanceOf(mongodb.ObjectId);
    });

    it("should return a valid ObjectId if a valid string is passed", async function() {
      const id = ObjectId("5bf7af548cc593805afac829");
      id.should.be.instanceOf(mongodb.ObjectId);
    });

    it("should return the same ObjectId with the same input", async function() {
      const id = ObjectId("5bf7af548cc593805afac829"),
        id2 = ObjectId("5bf7af548cc593805afac829");
      id.toHexString().should.be.eq(id2.toHexString());
    });
  });
});
