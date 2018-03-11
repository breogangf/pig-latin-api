const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const expect = chai.expect;

const Translation = require('../models/translation');

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Translator', () => {
  beforeEach((done) => {
    Promise.all([
      Translation.remove()
    ])
      .then(() => done(null))
      .catch(done);
  });
  describe('POST /translate', () => {
    it('should return 400 if no message is send to be translated', (done) => {
      chai.request(server)
        .post('/translate')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.an('Object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Please provide a message to be translated');
          Translation.count({}, (errorCountingTranslations, count) => {
            count.should.equal(0);
            done();
          });
        });
    });
    it('should be able to translate the given text to pig latin', (done) => {
      const body = {
        message: 'This is the text to be translated'
      };
      chai.request(server)
        .post('/translate')
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.an('Object');
          Translation.count({}, (errorCountingTranslations, count) => {
            count.should.equal(1);
            done();
          });
        });
    });
  });
});
