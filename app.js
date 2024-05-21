// adding all files
require('./db');
require('./auth');

// mongoose stuff
const {spawn} = require('child_process');
const mongoose = require('mongoose'); 
const Game = mongoose.model('Game');
const Team = mongoose.model('Team');

const passport = require('passport');
const express = require('express');
const path = require('path');

const routes = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', routes);

const nameToAbr = {'Hawks': 'atl', 'Celtics': 'bos', 'Pelicans': 'no', 'Bulls': 'chi', 'Mavericks': 'dal', 'Nuggets': 'den', 'Rockets': 'hou', 'Clippers': 'lac', 'Lakers': 'lal', 'Heat': 'mia', 'Bucks': 'mil', 'Timberwolves': 'min', 'Nets': 'bkn', 'Knicks': 'nyk', 'Magic': 'orl', 'Pacers': 'ind', '76ers': 'phi', 'Suns': 'phx', 'Trail Blazers': 'por', 'Kings': 'sac', 'Spurs': 'sas', 'Thunder': 'okc', 'Raptors': 'tor', 'Jazz': 'utah', 'Grizzlies': 'mem', 'Wizards': 'was', 'Pistons': 'det', 'Hornets': 'cha', 'Cavaliers': 'cle', 'Warriors': 'gsw'};
// games page
app.get('/games', function(req, res) {
    // eslint-disable-next-line no-unused-vars
    if(req.user){
        Game.find({}, function(err, game){
            let dict = game;
            if(req.query.hasOwnProperty("filt") && req.query.filt==="my"){
                dict = game.filter(function (el){
                    return req.user.games.includes(el.id);
                });
            }
            if(req.query.hasOwnProperty("team_name")){
                dict = game.filter(function (el) {
                    return el.home.name === req.query.team_name || el.away.name === req.query.team_name;
                });
            } 
            res.render('games', {
                game: dict,
            });
        });
    } else {
        res.redirect('login');
    }
});

app.get('/about', function(req, res) {
    if(req.user){
        res.render('about', {
            user: req.user
        });
    } else {
        res.redirect('login');
    }
});

let pythonPath = '';
if(process.env.NODE_ENV === 'PRODUCTION'){
    pythonPath = 'python3.10';
} else {
    pythonPath = '/opt/Anaconda3/bin/Python';
}
// posting reviews to database
app.post('/create', function(req, res) {
    console.log("Adding a Game! ");

    // running our python script
    let dataToSend;
    let gameData;
    const python = spawn(pythonPath, ['nba/nbatemp.py',
    req.body.team1, 
    req.body.team2, 
    req.body.ml1, 
    req.body.ml2]
    );
    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
        gameData = dataToSend.replace( /[\r\n]+/gm, "" ).split(" ");
        const myGame = new Game({
            user: req.user.username,
            home: new Team({
                name: req.body.team1, 
                ml: req.body.ml1, 
                win: gameData[0], 
                kg: gameData[2],
                abr: nameToAbr[req.body.team1]
            }),
            away: new Team({
                name: req.body.team2, 
                ml: req.body.ml2, 
                win: gameData[1], 
                kg: gameData[3],
                abr: nameToAbr[req.body.team2]
            }),
            createdAt: new Date().toDateString().substring(4)
        });

        req.user.games.push(myGame);
        req.user.save(function(){
            myGame.save(function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("added");
                    res.redirect('/games');
                }
            });
        });
    });
});


app.get('/create', function(req, res) {
    if(req.user){
        res.render('create', {
            user: req.user
        });
    } else {
        res.redirect('login');
    }
});

app.listen(process.env.PORT || 3000);