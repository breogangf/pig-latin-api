const logger = require('../helpers/logger');
const Translation = require('../models/translation');
const translationHelper = require('../helpers/translationsHelper');

exports.translate = (req, res) => {
    //TODO recover userId from the authenticated request headers
    if (req.headers.userid === undefined) return res.status(403).send({ message: 'Not authorized to perform this action' });
    const userId = req.headers.userid;
    if (req.body.message === undefined) return res.status(400).send({ message: 'Please provide a message to be translated' });
    const originalText = req.body.message;
    const translatedText = translationHelper.translatetoPigLatin(originalText);
    const translation = {
        userId,
        originalText,
        translatedText
    };
    Translation.create(translation, (errorCreatingTranslation, createdTranslation) => {
        if (errorCreatingTranslation) {
            logger.log(`Error creating translation: ${errorCreatingTranslation}`);
            return res.status(500).send({ message: `Error creating translation: ${errorCreatingTranslation}` });
        }
        logger.log(`Created new translation: ${createdTranslation}`);
        return res.status(201).send(createdTranslation);
    });
};

exports.getTranslationsByUserId = (req, res) => {
    //TODO recover userId from the authenticated request headers
    if (req.headers.userid === undefined) return res.status(403).send({ message: 'Not authorized to perform this action' });
    const userId = req.headers.userid;
    Translation.find({ userId }, (errorRetrievingTranslations, translations) => {
        if (errorRetrievingTranslations) {
            logger.log(`Error retrieving translations form the DDBB: ${errorRetrievingTranslations}`);
            return res.status(500).send({ message: `Error retrieving translations form the DDBB: ${errorRetrievingTranslations}` });
        }
        return res.status(200).send(translations);
    });
};
