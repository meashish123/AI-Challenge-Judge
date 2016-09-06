var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var userSchema = new Schema({
    userName: String,
    id: String,
    password: String,
    name: String,
    email: String,
    college: String,
    year: String,
    contact: String,
    score: Number,
    time: String
});

var tempUserSchema = new Schema({
    userName: String,
    id: String,
    password: String,
    name: String,
    email: String,
    college: String,
    year: String,
    contact: String
});

var problemSchema = new Schema({
    id: Number,
    name: String,
    statement: String,
    level: Number,
    answer: String
});

var submissionsSchema = new Schema({
    submissionsId: Number,
    userName: String,
    language: Number,
    code: String,
    opponentSubmissionId: Number,
    opponentUserName: String,
    progress: Number,
    game: Schema.Types.Mixed
}, {
    timestamps: true
});

var gameSchema = new Schema({
    submissionsId: Number,
    userName: String,
    language: Number,
    code: String,
    opponentSubmissionId: Number,
    opponentUserName: String,
    progress: Number,
    game: Schema.Types.Mixed
}, {
    timestamps: true
});

submissionsSchema.plugin(mongoosePaginate);

var infinitumSubmissionsSchema = new Schema({
    submissionsId: Number,
    userName: String,
    problemId: Number,
    correct: String
}, {
    timestamps: true
});

var contestSchema = new Schema({
    name: String,
    startTime: Date,
    duration: Number
});

var Counters = new Schema({
    _id: String,
    seq: Number
});
Counters.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};
var Counter = mongoose.model('counters', Counters);
var Contest = mongoose.model('Contest', contestSchema);

var contest = new Contest({
    name: "AI",
    startTime: new Date(new Date().getTime() + 2 * 86400000),
    duration: 2 * 86400000
});

exports.Contest = Contest;
exports.InfinitumSubmission = mongoose.model('InfinitumSubmission', infinitumSubmissionsSchema);
exports.Problem = mongoose.model('Problem', problemSchema);
exports.Game = mongoose.model('Game', gameSchema);
exports.Submission = mongoose.model('Submission', submissionsSchema);
exports.TempUser = mongoose.model('TempUser', tempUserSchema);
exports.User = mongoose.model('User', userSchema);
exports.Counter = Counter;