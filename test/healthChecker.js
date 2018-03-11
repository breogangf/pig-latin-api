const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('HealthChecker', () => {
  describe('GET /', () => {
    it('Should check that our app is up and running', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Everything seems to be working 😎');
          done();
        });
    });
  });
});
