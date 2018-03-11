const logger = require('../helpers/logger');
const Translation = require('../models/translation');

exports.translate = (req, res) => {
    if (req.body.message === undefined) return res.status(400).send({ message: 'Please provide a message to be translated' });
    //TODO recover userId from the authenticated request headers
    const userId = 'user_id_testing';
    const originalText = req.body.message;
    //TODO translate the text to pig latin, for now translated text is only the original message
    const translatedText = req.body.message;
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
