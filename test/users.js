const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const expect = chai.expect;

const User = require('../models/user');

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Users', () => {
  beforeEach((done) => {
    Promise.all([
      User.remove()
    ])
      .then(() => done(null))
      .catch(done);
  });
  describe('POST /users', () => {
    it('should return 400 if all the mandatory register fields were not provided', (done) => {
      chai.request(server)
				.post('/users')
				.send({ username: 'breogangf', password: 'awesomePassword' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.an('Object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Please provide email, username, password');
          User.count({}, (errorCountingTranslations, count) => {
            count.should.equal(0);
            done();
          });
        });
		});
		it('should create a new user', (done) => {
			const body = { email: 'example@gmail.com', username: 'breogangf', password: 'awesomePassword' };
      chai.request(server)
				.post('/users')
				.send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
					res.body.should.be.an('Object');
					res.body.should.have.property('username').equal(body.username);
					res.body.should.have.property('email').equal(body.email);
					res.body.should.have.property('password').not.equal(body.password);
          User.count({}, (errorCountingTranslations, count) => {
            count.should.equal(1);
            done();
          });
        });
    });
  });
  describe('POST /users/login', () => {
    it('should return 401 if the provided email + password combination does not match', (done) => {
      const user = { username: 'breogangf', email: 'example@gmail.com', password: 'awesomePassword' };
      User.create(user, (errorCreatingUser, createdUser) => {
        chai.request(server)
				.post('/users/login')
				.send({ email: 'wrong@gmail.com', password: 'wrongpass' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
      });
    });
    it('should return the user after the successful login', (done) => {
      const user = { username: 'breogangf', email: 'example@gmail.com', password: 'awesomePassword' };
      User.create(user, (errorCreatingUser, createdUser) => {
        chai.request(server)
				.post('/users/login')
				.send({ email: 'example@gmail.com', password: 'awesomePassword' })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
					res.body.should.be.an('Object');
					res.body.should.have.property('username').equal(user.username);
					res.body.should.have.property('email').equal(user.email);
					res.body.should.have.property('password').not.equal(user.password);
          done();
        });
      });
		});
  });
});
