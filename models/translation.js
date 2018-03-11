const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const translationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    originalText: {
        type: String,
        required: true
    },
    translatedText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Translation', translationSchema, 'Translations');
