
const serveStatic = require('serve-static')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const multer  = require('multer')
// const upload = multer({ dest: "uploads/" })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const app = express()

app.use('/', serveStatic(path.join(__dirname, '/dist')))

const url = `mongodb+srv://glebClusterUser:glebClusterUserPassword@cluster0.fvfru.mongodb.net/games?retryWrites=true&w=majority`;



var options = {
    root: path.join(__dirname, 'views'),
}   

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.connect(url, connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const GameSchema = new mongoose.Schema({
    name: String,
    genre: {
        type: String,
        enum: [ 'popular', 'arcade', 'quests', 'matchthree' ],
        default: "popular"
    },
    free: {
        type: String,
        default: "false"
    },
    cost: {
        type: Number,
        default: 0
    },
    description: String,
    likes: {
        type: Number,
        default: 0
    },
    imageurl: {
        type: String,
        default: 'empty'
    },
    downloads: {
        type: Number,
        default: 0
    },
    downloaded: [mongoose.Schema.Types.Map],
    sender: String,
    created: {
        default: new Date().toLocaleString(),
        type: String
    },
}, { collection : 'mygames' });

const GameModel = mongoose.model('GameModel', GameSchema);

const CommentSchema = new mongoose.Schema({
    content: String,
    sender: String,
    created: {
        default: new Date().toLocaleString(),
        type: String
    },
}, { collection : 'mycomments' });
const CommentModel = mongoose.model('CommentModel', CommentSchema, 'mycomments');

const GameDeveloperSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    age: Number,
    imageurl: {
        type: String,
        default: 'empty'
    },
    games: [mongoose.Schema.Types.Map],
    installedapps: [mongoose.Schema.Types.Map],
}, { collection : 'mygamedevelopers' });

const GameDeveloperModel = mongoose.model('GameDeveloperModel', GameDeveloperSchema, 'mygamedevelopers');

app.get('/main', async (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    if(Array(req.query.auth)[0] === undefined){
        return res.json({ "status": "Error"  })
    } else {
        let queryOfListGames = GameModel.find({ }, (err, allGames) => {
            if(err){
                return res.json({ "status": "Error"  })
            } else {
                if(req.query.searchText.includes('none')){
                    return res.json({ "allGames": allGames, "touser": req.query.touser  })
                } else if(!req.query.searchText.includes('none')){
                    allGames = allGames.filter((game)=>{
                        if(game.name.includes(`${req.query.searchText}`)){
                            return true
                        }
                        return false
                    })
                    return res.json({ "allGames": allGames, "touser": req.query.touser  })
                }
            }
        });
    }
})

app.get('/games/list', (req, res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = GameDeveloperModel.findOne({ email: req.query.touser })
    query.exec(async (err, developer) => {
        if (err){
            return res.json({ "status": "Error"  })
        }
        res.json({ "touser": req.query.touser, "myGames": developer.installedapps })
    })
})

app.get('/games/publishlist', (req, res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = GameDeveloperModel.findOne({ email: req.query.touser })
    query.exec(async (err, developer) => {
        if (err){
            return res.json({ "status": "Error"  })
        }
        res.json({ "touser": req.query.touser, "games": developer.games })
    })
})

app.get('/games/gamecreatesuccess', async (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    
    let query = GameModel.find({})
    query.exec(async (err, allGames) => {
        if (err){
            return
        }
        var gameExists = false;
        if(gameExists){
            console.log('in', req.query.gamename in allGames)
            console.log('rollback')
            return res.send('rollback')
        } else {
            console.log('создание', req.query.gamename in allGames)
            const game = new GameModel({ name: req.query.gamename, description:req.query.gamedescription, cost: req.query.gamecost, imageurl: req.query.gameimageurl, sender: req.query.touser, free: req.query.gamefree, genre: req.query.gamegenre });
            game.save(async function (err) {
                if(err){
                    return res.json({ "status": "Error"  })
                } else {
                    GameDeveloperModel.updateOne({ email: req.query.touser },
                        { $push: 
                            {
                                games: [
                                    {
                                        id: game._id,
                                        name: req.query.gamename,
                                        description: req.query.gamedescription,
                                        sender: req.query.touser,
                                        cost: req.query.gamecost,
                                        imageurl: req.query.gameimageurl,
                                        free: Number(req.query.gamecost) > 0 ? "false" : "true",
                                        genre: req.query.gamegenre,
                                        likes: Number(0)
                                    }
                                ]
                                
                            }
                    }, (err) => {
                        if(err){
                            return res.json({ "status": "Error"  })
                        } else {
                            return res.json({ "status": "OK" })
                        } 
                    })
                }
            })
            
        }
    })
})

app.get('/game', (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");


    let query = GameModel.findOne({'_id': req.query.gameid }, function(err, game){
        query.exec((err, game) => {
            if (err){
                return res.json({ "status": "Error"  })
            }
            res.json({ "gameImage": game.imageurl, "gameid": game._id, "gameName": game.name, "gameDesc": game.description, "gameFree": game.free, "gameCost": game.cost, "gameCountLikes": game.likes, "gameBy": game.sender, "gameDateOfCreated": game.created, "gameCountDownloads": game.downloads, "touser": req.query.touser, "gameGenre": game.genre,  "downloaded": game.downloaded })
        });  
    })
})

app.get('/games/likes', (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = GameModel.findOne({'_id': req.query.gameid }, function(err, game){
        if (err || Array(req.query.gameid)[0] === undefined){
            return res.json({ "status": "Error" })
        } else {
            if(game != null && game != undefined){
                GameModel.updateOne({ name: req.query.gamename }, 
                { 
                    "$inc": { "likes": Number(req.query.likes) }
                }, (err) => {
                    if (err) {
                        return res.json({ "status": "OK" })
                    } else {
                        return res.json({ "status": "OK" })
                    }
                })
            }
        }
    })
    
})

app.get('/games/downloads', (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type, Accept, Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    // res.setHeader('Content-disposition', 'attachment; filename=textFile.txt');
    // res.setHeader('Content-Type', 'text/plain');

    let query = GameModel.findOne({'name': req.query.gamename }, function(err, game){
        if (err || Array(req.query.gamename)[0] === undefined){
            return res.json({ "status": "Error"  })
        } else {
            if(game != null && game != undefined){
                GameModel.updateOne({ name: req.query.gamename }, 
                { 
                    "$inc": { "downloads": 1 },
                    "$push": { 
                        downloaded: [
                            {
                                name: req.query.touser
                            }
                        ]
                    }
                }, async (err) => {
                        console.log("path to file", path.join(__dirname, `uploads/${req.query.gamename}.txt`))
                        await res.download(path.join(__dirname, `uploads/${req.query.gamename}.txt`), `${req.query.gamename}.txt`, function (err) {
                            if (err) {
                                //error to download file
                                return res.json({ "status": "error to download file" })
                            } else {
                                
                                //file success download
                                return res.json({ "status": "file success download" })
                            }
                        })

                    GameDeveloperModel.updateOne({ email: req.query.touser },
                        { $push: 
                            {
                                installedapps: [
                                    {
                                        _id: req.query.gameid,
                                        name: req.query.gamename,
                                        imageurl: req.query.gameImage,
                                        downloads: Number(req.query.gameCountDownloads),
                                        likes: Number(req.query.gameCountLikes),
                                        sender: req.query.gameBy,
                                        created: req.query.gameDateOfCreated,
                                        free: req.query.gameFree,
                                        description: req.query.gameDesc,
                                        cost: Number(req.query.gameCost)
                                    }
                                ]
                                
                            }
                        }, (err, user) => {
                            return res.json({ "status": "OK" })
                        }
                    )
                        
                })
                
            }
        }
    })
})

app.get('/users/check', (req,res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    if(req.query.developerpassword !== ''){
        let query =  GameDeveloperModel.findOne({'email': req.query.developeremail}, function(err, developer){
            if (err){
                res.json({ "status": "Error" })
            } else {
                const passwordCheck = bcrypt.compareSync(req.query.developerpassword, developer.password) && req.query.developerpassword !== ''
                if(developer != null && developer != undefined && passwordCheck){
                    res.json({ "status": "OK", "developeremail": developer.email })
                } else {
                    res.json({ "status": "Error" })
                }
            }
        })
    }
})

app.get('/users/usercreatesuccess',async (req, res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = GameDeveloperModel.find({}).select(['email']);
    query.exec(async (err, allDevelopers) => {
        if (err){
            return
        }
        
        var developerExists = false;

        allDevelopers.forEach(developer => {
            if(developer.email.includes(req.query.developeremail)){
                developerExists = true
            }
        });
        if(developerExists){
            return res.json({ "status": "Error" })
        } else {
            let encodedPassword = "#"
            const salt = bcrypt.genSalt(saltRounds)
            encodedPassword = bcrypt.hashSync(req.query.developerpassword, saltRounds)
            
            const developer = await new GameDeveloperModel({ email: req.query.developeremail, password: encodedPassword, name:req.query.developername, age: Number(req.query.developerage), imageurl: req.query.developerimageurl });
            developer.save(function (err) {
                if(err){
                    console.log('создание ошибка')
                    console.log(err)
                    return
                } else {
                    res.json({ "status": "OK", "developeremail": req.query.developeremail })
                }
            })
        }
    });
})

app.post('/games/uploads', upload.array('myFiles', 2), (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    
    // const file = req.file
    const file = req.files

    if(!file){
        console.log("Error to upload file ")
    }

    // это использовать только в том случае если работаете с разными localhost 
    //если всё происходить на 1 домене то надо return res.redirect("/")
    
    // return res.redirect('http://localhost:8081/')

    let query = GameModel.find({})
    query.exec(async (err, allGames) => {
        if (err){
            return
        }
        var gameExists = false;
        if(gameExists){
            console.log('in', req.query.gamename in allGames)
            console.log('rollback')
            return res.send('rollback')
        } else {
            console.log('создание', req.query.gamename in allGames)

            const game = new GameModel({ name: req.query.gamename, description:req.query.gamedescription, cost: req.query.gamecost, imageurl: req.query.gameimageurl, sender: req.query.touser, free: req.query.gamefree, genre: req.query.gamegenre });

            game.save(async function (err) {
                if(err){
                    console.log('создание ошибка')
                    console.log(err)
                    return
                } else {
                    GameDeveloperModel.updateOne({ email: req.query.touser },
                        { $push: 
                            {
                                games: [
                                    {
                                        id: game._id,
                                        name: req.query.gamename,
                                        description: req.query.gamedescription,
                                        sender: req.query.touser,
                                        cost: req.query.gamecost,
                                        imageurl: req.query.gameimageurl,
                                        free: Number(req.query.gamecost) > 0 ? "false" : "true",
                                        genre: req.query.gamegenre,
                                        likes: Number(0)
                                    }
                                ]
                                
                            }
                    }, (err) => {
                        if(err){
                            return
                        } else {
                            return res.redirect("https://vuesupergames.herokuapp.com/")
                        } 
                    })
                }
            })
            
        }
    })
})

app.get('/games/getimage', (req, res)=>{
        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    res.sendFile(__dirname + `/uploads/${req.query.gamename}.png`)

})


/*
    начало бекенда игры
*/

    const storageForPlayers = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'players')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
    const uploadsForPlayers = multer({ storage: storageForPlayers })

    const PlayerSchema = new mongoose.Schema({
        name: String,
        password: String,
        points: {
            type: Number,
            default: 0
        },
        imageurl: {
            type: String,
            default: 'empty'
        }
    }, { collection : 'myplayers' });

    const PlayersModel = mongoose.model('PlayersModel', PlayerSchema, 'myplayers');

    app.get('/getplayers', (req, res)=>{
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        
        let queryOfPlayers = PlayersModel.find({});
        queryOfPlayers.exec( (err, allPlayers) => {
            if (err){
                return
            }
            return res.json({"players": allPlayers})
        });
    })

    app.get('/players/create', (req, res)=>{
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        
        let encodedPasswordForPlayer = "#"
        encodedPasswordForPlayer = bcrypt.hashSync(req.query.playerpassword, saltRounds)

        new PlayersModel({ name: req.query.playername, password: encodedPasswordForPlayer, imageurl: req.query.playerimageurl  }).save(function (err, player) {
            if(err){
                return res.json({ "status": "error" })
            } else {
                return res.json({ "status": "OK", "id": player._id })
            }
        })
    })

    app.post('/players/uploads', uploadsForPlayers.single('myplayerfile'), (req, res)=>{
    
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        
        const fileForPlayers = req.file
        if(!fileForPlayers){
            console.log("Error to upload file")
        }
        console.log("success to upload file")
        res.json({ 'status': 'OK' })
    })
    
    app.get('/players/getphoto', (req, res)=>{
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        
        res.sendFile(__dirname + `/players/${req.query.playerid}.png`)

    })

    app.get('/players/points', (req, res)=>{
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        
        let query = PlayersModel.findOne({'_id': req.query.playerid }, function(err, player){
            if (err || Array(req.query.playerid)[0] === undefined){
                return res.json({ "status": "error" })
            } else {
                if(player != null && player != undefined){
                    PlayersModel.updateOne({ _id: req.query.playerid }, 
                    { 
                        "points": Number(req.query.newplayerpoints)
                    }, (err, player) => {
                        if (err) {
                            console.log("error to evaluate likes", err)
                            res.json({ "status": "error" })
                        } else {
                            res.json({ "status": "OK" })
                        }
                    })
                }
            }
        })
    })

/*
    конец бекенда игры
*/


app.get('**', (req, res) => {
    console.log('redirect')
    return res.redirect(`/?redirectroute=${req.path}`)
})

// const port = 4000
const port = process.env.PORT || 8080
app.listen(port)