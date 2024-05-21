const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
});

// TODO: create schema and register models
const Team = new mongoose.Schema({
  name: {type: String, required: true},
  ml: {type: Number, required: true},
  win: {type: Number, required: true}, 
  kg: {type: Number, required: true},
  abr: {type: String, required: true}
});

const Game = new mongoose.Schema({
	// user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	user: {type: String, required: true},
	home: {type: Team, required: true},
  away: {type: Team, required: true},
	createdAt: {type: String, required: true}
});

User.plugin(passportLocalMongoose);

mongoose.model('Team', Team);
mongoose.model('Game', Game);
mongoose.model('User', User);
// OPTIONAL: modify the connection code below if
// using mongodb authentication
const mongooseOpts = {
  useNewUrlParser: true,  
  useUnifiedTopology: true
};

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/gamedb';
}

// eslint-disable-next-line no-unused-vars
mongoose.connect(dbconf, mongooseOpts, (err, db) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to database'); 
  }
});
