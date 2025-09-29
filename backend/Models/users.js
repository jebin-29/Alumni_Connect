const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    graduationYear: {
        type: Number,
        required: true
    },
    collegeEmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
        trim: true
    },
    
    course: {
        type: String,
        required: true
    },
    usn: {
        type: String,
        trim: true
    },
    fieldOfStudy: {
        type: String,
        required: true
    },
    linkedin: {
        type: String,
        match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn profile URL'],
        trim: true
    },
    github: {
        type: String,
        match: [/^https?:\/\/(www\.)?github\.com\/.*$/, 'Please provide a valid GitHub profile URL'],
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePhoto: {
        type: String
    },

    followingStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followingAlumni: [{ type: Schema.Types.ObjectId, ref: 'Alumni' }],

    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;