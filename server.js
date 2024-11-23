const express = require('express')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const nxtWatch = express()
nxtWatch.use(cors({
    origin: "http://localhost:3000"
}))
nxtWatch.use(express.json())
const videosDbPath = path.join(__dirname, 'videos.db')
const videoDetailsDbPath = path.join(__dirname, 'video_details.db')

let videosDb = null
let videoDetailsDb = null

const initializeDBAndServer = async () => {
    try {
        videosDb = await open({
            filename: videosDbPath,
            driver: sqlite3.Database,
        })
        videoDetailsDb = await open({
            filename: videoDetailsDbPath,
            driver: sqlite3.Database,
        })
        nxtWatch.listen(5000, () => {
            console.log('server is running at http://localhost:5000/')
        })
    } catch (e) {
        console.log(`DB Error ${e.message}`)
        process.exit(1)
    }
}

initializeDBAndServer()

const authenticateToken = (request, response, next) => {
    let jwtToken
    const authHeader = request.headers['authorization']
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(' ')[1]
    }
    if (jwtToken === undefined) {
        response.status(401)
        response.send('Invalid JWT Token')
    } else {
        jwt.verify(jwtToken, "embrace masculinity", async (error, payload) => {
            if (error) {
                response.status(401)
                response.send('Invalid JWT Token')
            } else {
                next()
            }
        })
    }
}

nxtWatch.post('/register/', async (request, response) => {
    const { username, password } = request.body
    const checkQuery = `SELECT * FROM users WHERE username = "${username}"`
    const isExist = await videosDb.get(checkQuery)
    if (isExist === undefined) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const creationQuery = `
            INSERT INTO users (username, password)
            VALUES
                ('${username}', '${hashedPassword}');`
        await videosDb.run(creationQuery)
        response.send({error: 'Account created successfully'})
    } else {
        response.status(400)
        response.send({error: "User already exists"})
    }
})

nxtWatch.post('/login/', async (request, response) => {
    const { username, password } = request.body
    const checkQuery = `SELECT * FROM users WHERE username = '${username}'`
    const isExist = await videosDb.get(checkQuery)
    if (isExist === undefined) {
        response.status(400)
        response.send({error: "Invalid user"})
    } else {
        const isPasswordMatched = await bcrypt.compare(password, isExist.password)
        if (isPasswordMatched) {
            const payload = {
                username: username
            }
            const jwtToken = jwt.sign(payload, 'embrace masculinity')
            response.send({ jwtToken })
        } else {
            response.status(400)
            response.send({error: "username and password didn't match"})
        }
    }
})

nxtWatch.get('/videos/all/', authenticateToken,  async (request, response) => {
    const { search = "" } = request.query
    const query = `
        SELECT 
            * 
        FROM 
            home_videos 
        WHERE 
            title LIKE '%${search}%';`
    const videos = await videosDb.all(query)
    response.send(videos)
})

nxtWatch.get('/videos/trending/', authenticateToken, async (request, response) => {
    const query = `SELECT * FROM trending_videos;`
    const videos = await videosDb.all(query)
    response.send(videos)
})

nxtWatch.get('/videos/gaming/', authenticateToken, async (request, response) => {
    const query = `SELECT * FROM gaming_videos;`
    const videos = await videosDb.all(query)
    response.send(videos)
})

nxtWatch.get('/videos/:id/', authenticateToken, async (request, response) => {
    const { id } = request.params
    const query = `  
        SELECT 
            * 
        FROM 
            video_details 
        WHERE 
            id = "${id}";`
    const videos = await videoDetailsDb.all(query)
    response.send(videos)
})


