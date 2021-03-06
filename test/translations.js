const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const expect = chai.expect;

const session = require('express-session');

const Translation = require('../models/translation');

chai.use(chaiHttp);

describe('Translations', () => {
  beforeEach((done) => {
    process.env.NODE_ENV = 'test';
    Promise.all([
      Translation.remove()
    ])
      .then(() => done(null))
      .catch(done);
  });
  describe('POST /translations', () => {
    it('should return 403 if there is no session', (done) => {
      process.env.NODE_ENV = 'no-test';
      chai.request(server)
        .post('/translations')
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.be.an('Object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Not authorized to perform this action');
          Translation.count({}, (errorCountingTranslations, count) => {
            count.should.equal(0);
            done();
          });
        });
    });
    it('should return 400 if no message is send to be translated', (done) => {
      chai.request(server)
        .post('/translations')
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
        message: 'yellow'
      };
      chai.request(server)
        .post('/translations')
        .set('userId', 'BREO')
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.an('Object');
          res.body.should.have.property('userId');
          res.body.userId.should.equal('BREO');
          res.body.should.have.property('originalText');
          res.body.originalText.should.equal('yellow');
          res.body.should.have.property('translatedText');
          res.body.translatedText.should.equal('ellowyay');
          res.body.should.have.property('createdAt');
          Translation.count({}, (errorCountingTranslations, count) => {
            count.should.equal(1);
            done();
          });
        });
    });
  });
  describe('GET /translations', () => {
    it('should return 403 if no userId is provided', (done) => {
      process.env.NODE_ENV = 'no-test';
      chai.request(server)
        .get('/translations')
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.be.an('Object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Not authorized to perform this action');
          done();
        });
    });
    it('should return all the translations made by a userId', (done) => {
      const translations = [
        { userId: 'BREO', originalText: 'snickers', translatedText: 'ickerssnay' },
        { userId: 'JEAN', originalText: 'rabbits', translatedText: 'abbitsray' },
        { userId: 'BREO', originalText: 'jeans', translatedText: 'eansjay' }
      ];
      Translation.collection.insert(translations, () => {
        chai.request(server)
          .get('/translations')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.an('Array');
            res.body.length.should.equal(2);
            res.body[0].should.have.property('userId').equal('BREO');
            res.body[0].should.have.property('originalText');
            res.body[0].should.have.property('translatedText');
            res.body[1].should.have.property('userId').equal('BREO');
            res.body[1].should.have.property('originalText');
            res.body[1].should.have.property('translatedText');
            done();
          });
      });
    });
  });
});
