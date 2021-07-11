
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

// app.set('view engine', 'ejs')

app.get('/main', async (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    if(Array(req.query.auth)[0] === undefined){
        // res.redirect('/users/login')
    } else {
        let queryOfListGames = GameModel.find({ }, (err, allGames) => {
            if(err){
                return
            } else {
                if(req.query.searchText.includes('none')){
                    // return res.render('index', { allGames, touser: req.query.touser })
                    return res.json({ "allGames": allGames, "touser": req.query.touser  })
                } else if(!req.query.searchText.includes('none')){
                    allGames = allGames.filter((game)=>{
                        if(game.name.includes(`${req.query.searchText}`)){
                            return true
                        }
                        return false
                    })
                    // return res.render('index', { allGames, touser: req.query.touser })
                    return res.json({ "allGames": allGames, "touser": req.query.touser  })
                }
            }
        });
    }
    
    

    // if(Array(req.query.auth)[0] !== undefined){
    //     //получение всех записей текущего пользователя и его друзей
    //     let queryOfFriendsBefore =  UsersModel.findOne({'email': req.query.sender + "@mail.ru"}, function(err, beforeUser){
    //         if(err){
    //             console.log('ошибка получение всех записей текущего пользователя и его друзей')
    //             return
    //         } else {
    //             console.log('получение всех записей текущего пользователя и его друзей')
    //             //console.log(new Array(beforeUser.friends).flat(3)[0].values())
    //             const friendsPosts = []
    //             beforeUser.friends.map((friendKey, friendValue) => {
    //                 console.log("friendKey", friendKey)
    //                 console.log("friendValue", friendValue)
    //                 console.log(new Map(friendKey).get('email'))
                    
    //                 friendsPosts.push(new Map(friendKey).get('email').split('@')[0])
    //             })
    //             console.log(new Array(beforeUser.friends))
    //             let query = PostModel.find({ $or:[ {  sender: { $eq: req.query.sender } }, { sender: { $in: friendsPosts }  } ] }, null, { sort: { created: -1 } }).select(['content', 'sender']);
    //             query.exec((err, allPosts) => {
    //                 if (err){
    //                     console.log('ошибка получение всех записей текущего пользователя и его друзей')
    //                     return
    //                 }
    //                 if(Array(req.query.auth)[0] === undefined){
    //                     return res.render('index', { allPosts: null, guest: false, auth:false, allFriends: null})
    //                 }
    //                 let nickOfUser = req.query.sender
    //                 let queryOfFriends =  UsersModel.findOne({'email': req.query.sender + "@mail.ru"}, function(err, user){
    //                     if (err){
    //                         return
    //                     } else {
                            
    //                         console.log('friends', user.friends)
    //                         console.log('likes', user.likes)
    //                         console.log('groups', user.groups)
                            
    //                         const userGroupsArray = []
    //                         user.groups.map((groupKey, groupValue) => {
    //                             userGroupsArray.push(new Map(groupKey).get('name'))
    //                         })
    //                         console.log('userGroupsArray', userGroupsArray)
    //                         const groupsWithData = []
    //                         const queryOfGroupsWithData = GroupsModel.find({ name: { $in: userGroupsArray } }).select(['name', 'description', 'access', 'imageurl', 'partisipants' ])
    //                         queryOfGroupsWithData.exec((error, groups) => {
    //                             if(error){
    //                                 console.log('error Group')
    //                                 return
    //                             }
    //                             console.log('group success')
    //                             groups.forEach((g) => {
    //                                 groupsWithData.push(g)
    //                             })
    //                             console.log('groups', groups)
    //                             console.log('groupsWithData', groupsWithData)
    //                             if(req.query.guest.includes('true')){
    //                                 res.render('index', { allPosts: allPosts, auth:true, guest: true, touser:req.query.touser, sender: nickOfUser, allFriends: user.friends, likes: user.likes, allGroups: user.groups, imageurl: user.imageurl, name: user.name, age: user.age, password: user.password, groupswithdata: groupsWithData })
    //                             } else if(req.query.guest.includes('false')){
    //                                 res.render('index', { allPosts: allPosts, auth:true, guest: false, sender: nickOfUser, allFriends: user.friends, likes: user.likes, allGroups: user.groups, imageurl: user.imageurl, name: user.name, age: user.age, password: user.password, groupswithdata: groupsWithData })
    //                             }
    //                             console.log("пользовтель",user)
    //                         })

                            
    //                     }
    //                 })
    //             })
    //         }
    //     })
    // } else if (Array(req.query.auth)[0] === undefined){
    //     // res.redirect('/users/login')
    // }
})
// app.get('/post/:postID',(req, res)=>{
//     let query = PostModel.findById(req.params.postID);
//         query.exec((err, post) => {
//         if (err){
//             return
//         }
//         console.log(post)
//         res.render('post', { post: post })
//     });  
// })

// app.get('/users/edit',(req, res)=>{
//     res.render('useredit', { auth:true, touser: req.query.touser, imageurl: req.query.imageurl, name: req.query.name, age: req.query.age, email: req.query.email, password: req.query.password  })
// })

// app.get('/users/editsuccess', async (req, res)=>{
//     await UsersModel.updateOne({ email: req.query.touser },
//         {
//             imageurl: req.query.imageurl,
//             name: req.query.name,
//             age: req.query.age,
//             email: req.query.email,
//             password: req.query.password,
//         }, (err) => {
//             if(err){
//                 return
//             } else {
//                 let queryOfFriends =  UsersModel.findOne({'email': req.query.email}, function(err, user){
//                     if (err){
//                         return
//                     } else {
//                         const userGroupsArray = []
//                         user.groups.map((groupKey, groupValue) => {
//                             userGroupsArray.push(new Map(groupKey).get('name'))
//                         })
//                         console.log('userGroupsArray', userGroupsArray)
//                         const groupsWithData = []
//                         const queryOfGroupsWithData = GroupsModel.find({ name: { $in: userGroupsArray } }).select(['name', 'description', 'access', 'imageurl', 'partisipants' ])
//                         queryOfGroupsWithData.exec( async (error, groups) => {
//                             if(error){
//                                 return
//                             }
//                             groups.forEach((g) => {
//                                 groupsWithData.push(g)
//                             })
//                             nickOfUser = req.query.email.split('@')[0]
//                             const allPosts = []
//                             await PostModel.updateMany({ sender: req.query.touser.split('@')[0] },
//                                 {
//                                     sender: nickOfUser
//                                 }, (err) => {
//                                     if(err){
//                                         console.log("error PostModel")
//                                         return
//                                     } else {
//                                         console.log("success PostModel")
//                                     }
//                                 }
//                             )
//                             let query = PostModel.find({ sender: { $eq: req.query.email.split('@')[0] } })
//                             query.exec((err, allPosts) => {
//                                 console.log('req.query', req.query)
//                                 res.render('index', { auth:true, guest: false, allPosts, auth:true, sender: nickOfUser, allFriends: user.friends, likes: user.likes, allGroups: user.groups, imageurl: user.imageurl, name: req.query.name, age: req.query.age, password: req.query.password, groupswithdata: groupsWithData })
//                             })
//                         })
//                     }
//                 }
//             )
//         }
//     })
// })

// app.get('/users/groups/edit',(req, res)=>{
//     res.render('groupedit', { auth:true, imageurl: req.query.imageurl, groupname: req.query.groupname, groupdescription: req.query.groupdescription, groupaccess: req.query.groupaccess, touser: req.query.touser })
// })

// app.get('/users/groups/editsuccess', async (req, res)=>{
//     await GroupsModel.updateOne({ name: req.query.previousgroupname },
//         {
//             imageurl: req.query.imageurl,
//             name: req.query.groupname,
//             description: req.query.groupdescription,
//             access: req.query.groupaccess
//         }, (err) => {
//             if(err){
//                 console.log("error group")
//                 return
//             } else {
//                 console.log("success group")
//                 res.redirect(`/users/groups?imageurl=${req.query.imageurl}&groupname=${req.query.groupname}&groupdescription=${req.query.groupdescription}&groupaccess=${req.query.groupaccess}&touser=${req.query.touser}`)
//             }
//         }
//     )
// })

// app.get('/postadd', async (req, res)=>{

//     await new PostModel({ sender: req.query.sender, content: req.query.content }).save(function (err) {
//         if(err){
//             console.log('ошибка добавления поста')
//             return
//         } else {
//             console.log('добавление поста')
//             res.redirect(`/?auth=true&guest=false&sender=${req.query.sender}`)
//         }
//     })
// })

// app.get('/users/groups', async (req, res)=>{
//     let query = GroupsModel.findOne({ name: req.query.groupname }).select(['partisipants']);
//     query.exec((err, group) => {
//         if (err){
//             return
//         }
//         res.render('group', {auth: true, name: req.query.groupname, access: req.query.groupaccess, description: req.query.groupdescription, partisipants: group.partisipants, imageurl: req.query.imageurl, touser: req.query.touser })
//     })
// })

// app.get('/games/register', (req, res)=>{
    // res.render('gamesregistry', { userlogin : true, touser: req.query.touser })
// })

app.get('/games/search', (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // res.json(`/?&userlogin=true&touser=${touser}`, { userlogin : true, touser: req.query.touser })
    // res.redirect(`/?&userlogin=true&touser=${touser}`, { userlogin : true, touser: req.query.touser })
})

app.get('/games/list', (req, res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = GameDeveloperModel.findOne({ email: req.query.touser })
    query.exec(async (err, developer) => {
        if (err){
            return
        }
        console.log("developer: ", developer)
        //console.log("installedapps: ", developer.installedapps)
        // res.render('gameslist', { touser: req.query.touser, myGames: developer.installedapps })
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
            return
        }
        console.log("developer: ", developer)
        console.log("games: ", developer.games)
        // res.render('gamespublish', { touser: req.query.touser, games: developer.games })
        res.json({ "touser": req.query.touser, "games": developer.games })
    })
})

app.get('/games/gamecreatesuccess', async (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    
    console.log('gamegenre: ', req.query.gamegenre)
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
            auth = true
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
                            return res.json({ "status": "OK" })
                            // res.redirect(`/?auth=true&touser=${req.query.touser}&searchText=none`)
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
                return
            }
            console.log(game)
            // res.render('game', { "gameImage": game.imageurl, "gameName": game.name, "gameDesc": game.description, "gameFree": game.free, "gameCost": game.cost, "gameCountLikes": game.likes, "gameBy": game.sender, "gameDateOfCreated": game.created, "gameCountDownloads": game.downloads, "touser": req.query.touser  })
            res.json({ "gameImage": game.imageurl, "gameid": game._id, "gameName": game.name, "gameDesc": game.description, "gameFree": game.free, "gameCost": game.cost, "gameCountLikes": game.likes, "gameBy": game.sender, "gameDateOfCreated": game.created, "gameCountDownloads": game.downloads, "touser": req.query.touser, "gameGenre": game.genre,  "downloaded": game.downloaded })
        });  
    })
})


app.get('/users/register',(req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    console.log(Array(req.query.useremail)[0] === undefined)
    if(Array(req.query.useremail)[0] === undefined){
        res.render('usersregistry', { userlogin : false })
    }
})

// app.get('/users/logout',(req, res)=>{
//     auth = false
//     res.redirect('/')
// })

// app.get('/users/friends/delete', async (req, res) => {
//     console.log(mongoose.connection.collection("myusersofposts"))
//     mongoose.connection.collection("myusersofposts").updateOne(
//         { email: req.query.touser },
//         { $pull: { 'friends': { email: req.query.useremail } } }
//     )
//     res.redirect(`/?auth=true&guest=true&sender=${req.query.touser.split('@')[0]}`)
// })

// app.get('/games/downloads', (req, res)=>{
//     res.download(path.join(__dirname, `uploads/${req.query.gamename}.txt`))
// })

app.get('/games/likes', (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = GameModel.findOne({'_id': req.query.gameid }, function(err, game){
        if (err || Array(req.query.gameid)[0] === undefined){
            console.log("Не Добавляю лайки")
            return res.json({ "status": "Error" })
        } else {
            console.log("Добавляю лайки")
            console.log("req.query: ", req.query)
            if(game != null && game != undefined){
                GameModel.updateOne({ name: req.query.gamename }, 
                { 
                    "$inc": { "likes": Number(req.query.likes) }
                }, (err) => {
                    if (err) {
                        console.log("error to evaluate likes", err)
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
            return
        } else {
            console.log('req.query: ', req.query)
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
                    // try {
                        // res.setHeader('Content-disposition', 'attachment; filename=textFile.txt');
                        // res.setHeader('Content-Type', 'text/plain');
                        console.log("path to file", path.join(__dirname, `uploads/${req.query.gamename}.txt`))
                        
                        // res.redirect("http://localhost:8081/")
                        
                        await res.download(path.join(__dirname, `uploads/${req.query.gamename}.txt`), `${req.query.gamename}.txt`, function (err) {
                            if (err) {
                                console.log("error to download file", err)
                            } else {
                                
                                console.log("file success download")
                                // res.status(200).json({ "status": "file success download" })
                            }
                        })

                        // return res.set({
                        //     'Content-Disposition': `attachment; filename=${path.join(__dirname, "uploads/" + req.query.gamename)}.txt`,
                        //     'Content-Type': 'text/plain',
                        //     });
                        
                    // } catch(e){
                    //     console.log("error to download file", e)
                    //     res.json({ "status": "error to download file" })
                    // }
                    
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
                            // res.json({ "status": "OK" })
                            // res.redirect(`/?auth=true&touser=${req.query.touser}&searchText=none`)
                        }
                    )
                        
                })
                
                
                }
            }
        
        
    })
})

// app.get('/users/login',(req, res)=>{
//     res.render('userslogin')
// })

// app.get('/users/list',(req, res)=>{
//     let queryOfFriendsBefore =  UsersModel.findOne({'email': req.query.touser}, function(err, beforeUser){
//         const friendsOfUser = []
//         beforeUser.friends.map((friendKey, friendValue) => {
//             console.log("friendKey", friendKey)
//             console.log("friendValue", friendValue)
//             console.log(new Map(friendKey).get('email'))
            
//             friendsOfUser.push(new Map(friendKey).get('email'))
//         })
//         console.log('friendsOfUser', friendsOfUser)
//         console.log('beforeUser', beforeUser)
//         let query = UsersModel.find({ email: { $nin: friendsOfUser } });
//         // let query = UsersModel.find({  }).select(['email', 'age', 'name']);
//         query.exec((err, allUsers) => {
//             if (err){
//                 return
//             }
//             allUsers = allUsers.filter((user) => {
//                 if(user.email === req.query.touser){
//                     return false
//                 }
//                 return true
//             })
//             res.render('userslist', { friendsOfUser, allUsers, auth: true, touser: req.query.touser })
//         })
//     })
// })

// app.get('/users/groups/list',(req, res)=>{
//     let queryOfGroups = GroupsModel.find({  }).select(['name', 'description', 'access', 'imageurl', 'partisipants']);
//     let queryOfUser = UsersModel.find({ email: req.query.touser }).select(['groups']);
//     queryOfGroups.exec((err, allGroups) => {
//         queryOfUser.exec((err, allGroupsOfUser) => {
//             if (err){
//                 return
//             }
//             allGroups = allGroups.filter((group) => {
//                 if(group.name in allGroupsOfUser){
//                     return false
//                 }
//                 return true
//             })
//             console.log(allGroups)
//             const groupsOfUser = []
//             allGroupsOfUser.map((groupKey, groupValue) => {
//                     console.log("groupKey", groupKey.groups)
//                     console.log("groupValue", groupValue)
//                     groupKey.groups.map((groupKeyInner, groupValueInner) => {
//                         console.log(new Map(groupKeyInner).get('name'))
                        
//                         groupsOfUser.push(new Map(groupKeyInner).get('name'))
//                     })
//                 })
//                 console.log('groupsOfUser', groupsOfUser)

//                 let queryOfNotHasGroups = GroupsModel.find({ name: { $nin: groupsOfUser } });
//                 queryOfNotHasGroups.exec((err, notHasGroups) => {
//                     if (err){
//                         return
//                     }
//                     let queryOfNotHasGroups = GroupsModel.find({ name: { $in: groupsOfUser } });
//                     queryOfNotHasGroups.exec((err, hasGroups) => {
//                         if (err){
//                             return
//                         }
                        
//                         console.log('allGroups', allGroups)

//                             const allGroupsWithPartisipants = []
//                             allGroups.map((groupKey, groupValue) => {
//                                 groupKey.partisipants.map((groupPartisipantKey, groupPartisipantValue) => {
//                                     console.log('new Map(groupPartisipantKey).get(email)', new Map(groupPartisipantKey).get('email'))
//                                     console.log('req.query.touser', req.query.touser)
//                                     if(new Map(groupPartisipantKey).get('email').includes(req.query.touser)){
//                                         allGroupsWithPartisipants.push(groupKey.name)
//                                     }
                                    
//                                 })
//                             })
                            
//                             let queryOfAllGroupsWithoutPartisipants = GroupsModel.find({ name: { $nin: allGroupsWithPartisipants } });
//                             queryOfAllGroupsWithoutPartisipants.exec((err, allGroupsWithoutPartisipants) => {
//                                 if (err){
//                                     return
//                                 }
//                                 console.log('allGroupsWithPartisipants', allGroupsWithPartisipants)
//                                 console.log('allGroupsWithoutPartisipants', allGroupsWithoutPartisipants)
//                                 GroupsModel.find({ name: {$in: allGroupsWithPartisipants} }, (err, allGroupsWithPartisipants) => {
//                                     if(err){
//                                         return
//                                     }
//                                     res.render('groupslist', { allGroups, allGroupsWithPartisipants, allGroupsWithoutPartisipants, hasGroups: hasGroups, notHasGroups: notHasGroups, auth: true, touser: req.query.touser })
//                                 })
                                
//                             })
//                     })
//                 })
//         })
//     })
// })

app.get('/users/check', (req,res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    if(req.query.developerpassword !== ''){
        let query =  GameDeveloperModel.findOne({'email': req.query.developeremail}, function(err, developer){
            if (err){
                return
            } else {
                const passwordCheck = bcrypt.compareSync(req.query.developerpassword, developer.password) && req.query.developerpassword !== ''
                if(developer != null && developer != undefined && passwordCheck){
                    auth = true
                    res.json({ "status": "OK", "developeremail": developer.email })
                    // res.redirect(`/?auth=true&touser=${developer.email}&searchText=none`)
                } else {
                    res.json({ "status": "Error" })
                    // res.send(`developer not found`)
                }
                console.log(developer)
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
            console.log('in',req.query.useremail in allDevelopers)
            console.log('rollback')
            // return res.send('rollback')
            return res.json({ "status": "Error" })
        } else {
            console.log('создание',req.query.developeremail in allDevelopers)
            auth = true
            
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
                    // res.redirect(`/?auth=true&guest=true&touser=${req.query.developeremail}`)
                    res.json({ "status": "OK", "developeremail": req.query.developeremail })
                }
            })
        }
    });
})

// app.get('/users/friends/add', async (req, res)=>{
//     if(Array(req.query.useremail)[0] === undefined){
//         console.log("ошибка добавления друга")
//         return res.render('index', { allPosts: allPosts, auth:false })
//     } else {
//         console.log("добавляем друга")
//         await UsersModel.updateOne({ email: req.query.touser },
//                 { $push: 
//                     { 
//                         friends: [
//                             {
//                                 email: req.query.useremail,
//                                 age: Number(req.query.userage)
//                             }
//                         ]
                        
//                     }
//             })
//         res.redirect(`/?auth=true&guest=false&sender=${req.query.touser.split('@')[0]}`)
//     }
// })


// app.get('/users/groups/partisipants/add', async (req, res)=>{
//     if(Array(req.query.touser)[0] === undefined){
//         console.log("ошибка добавления группы")
//         return res.render('index', { allPosts: allPosts, auth:false })
//     } else {
//         console.log("добавляем группу")
//         await GroupsModel.updateOne({ name: req.query.groupname },
//             { $push: 
//                 { 
//                     partisipants: [
//                         {
//                             email: req.query.touser
//                         }
//                     ]
                    
//                 }
//             })
//         res.redirect(`/users/groups?groupname=${req.query.groupname}&groupaccess=${req.query.groupaccess}&groupdescription=${req.query.groupdescription}&imageurl=${req.query.imageurl}&touser=${req.query.touser}`)
//     }
// })

// app.get('/users/groups/partisipants/delete', async (req, res)=>{
//     if(Array(req.query.groupname)[0] === undefined){
//         console.log("ошибка удалния группы от пользоватлея")
//         return res.render('index', { allPosts: allPosts, auth:false })
//     } else {
//         console.log("удаляем группу")
//         mongoose.connection.collection("mygroups").updateOne(       
//             {  },
//             { $pull: { 'partisipants': { email: req.query.touser } } }
//         );

//         res.redirect(`/users/groups?groupname=${req.query.groupname}&groupaccess=${req.query.groupaccess}&groupdescription=${req.query.groupdescription}&imageurl=${req.query.imageurl}&touser=${req.query.touser}`)
//     }
// })


// app.post('/games/uploads', upload.single('myFile'), (req, res)=>{
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
    // res.send(file)
    // res.redirect(`/games/gamecreatesuccess?touser=${req.query.touser}&gamename=${req.query.gamename}&gamedescription=${req.query.gamedescription}&gamecost=${req.query.gamecost}&gameimageurl=${req.query.gameimageurl}&gamegenre=${req.query.gamegenre}`)
    console.log("success to upload file ")
    // return res.json({ 'status': 'OK' })
    
    
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

            // const game = new GameModel({ name: req.query.gamename, description:req.query.gamedescription, cost: req.query.gamecost, imageurl: req.query.gameimageurl, sender: req.query.touser, free: req.query.gamefree, genre: req.query.gamegenre });
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
                            // return res.redirect("https://vuesupergames.herokuapp.com/")
                            return res.redirect("https://vuesupergames.herokuapp.com/")
                        } 
                    })
                }
            })
            
        }
    })
    
    //return res.redirect(`https://vuesupergames.herokuapp.com/?auth=true&touser=${req.query.touser}&searchText=none&gamename=${req.query.gamename}&gamedescription=${req.query.gamedescription}&gamegenre=${req.query.gamegenre}&gamesender=${req.query.gamesender}&gamecost=${req.query.gamecost}&gameimageurl=${req.query.gameimageurl}&gamefree=${req.query.gamefree}&creategame=true`)
    // res.redirect(`http://localhost:8080/?auth=true&touser=${req.query.touser}&searchText=none&`)
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
            // cb(null, req.query.playerid)

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

    

    // const urlForPlayers = `mongodb+srv://glebClusterUser:glebClusterUserPassword@cluster0.fvfru.mongodb.net/players?retryWrites=true&w=majority`;



    // let optionsForPlayers = {
    //     root: path.join(__dirname, 'views'),
    // }   

    // const connectionParamsForPlayers = {
    //     useNewUrlParser: true,
    //     useCreateIndex: true,
    //     useUnifiedTopology: true 
    // }

    // mongoose.connect(urlForPlayers, connectionParamsForPlayers)
    // .then( () => {
    //     console.log('Connected to players')
    // })
    // .catch( (err) => {
    //     console.error(`Error connecting to players. \n${err}`);
    // })

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