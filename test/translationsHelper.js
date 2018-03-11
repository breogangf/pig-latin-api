const chai = require('chai');

const should = chai.should();
const expect = chai.expect;
const translationsHelper = require('../helpers/translationsHelper');

process.env.NODE_ENV = 'test';

describe('Translations Helper', () => {
  it('should translate a single word (yellow)', (done) => {
    const wordToBeTranslated = 'yellow';
    translationsHelper.translatetoPigLatin(wordToBeTranslated).should.equals('ellowyay');
    done();
  });
  it('should translate a single word (style)', (done) => {
    const wordToBeTranslated = 'style';
    translationsHelper.translatetoPigLatin(wordToBeTranslated).should.equals('ylestay');
    done();
  });
  it('should translate a single word (snickers)', (done) => {
    const wordToBeTranslated = 'snickers';
    translationsHelper.translatetoPigLatin(wordToBeTranslated).should.equals('ickerssnay');
    done();
  });
});
