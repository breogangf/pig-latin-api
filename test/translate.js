const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Translator', () => {
  describe('POST /', () => {
    it('should be able to translate the given text to pig latin', (done) => {
      chai.request(server)
        .post('/translate')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('Array');
          res.body.length.should.equal(0);
          done();
        });
    });
  });
});
