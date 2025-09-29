const { required } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alumniSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    graduationYear: {
        type: Number,
        required: true,
    },
    collegeEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    linkedin: {
        type: String,
        match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn profile URL'],
        trim: true,
    },
    degreeCertificate: {
        type: String,
        required:true,
    },
    profilePhoto: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['alumni'],
        required: true,
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true,
});

const Alumni = mongoose.model('Alumni', alumniSchema);

module.exports = Alumni;