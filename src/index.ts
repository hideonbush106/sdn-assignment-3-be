import express, { Request, Response, urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import * as bodyParser from 'body-parser'
import morgan from 'morgan'
import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
import dbConnect from '~/utils/db.connect'
import passport from 'passport'
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt'
import userRouter from './routes/user.routes'
import publicRouter from './routes/public.routes'
import httpStatus from 'http-status'
import '~/middleware/auth'
import orchidRouter from './routes/orchid.routes'
import categoryRouter from './routes/category.routes'
import commentRouter from './routes/comment.routes'
import memberRouter from './routes/member.routes'

const app = express()

//#region env
dotenv.config()
const httpPort = process.env.HTTP_PORT
const httpsPort = process.env.HTTPS_PORT
const env = process.env.NODE_ENV
const dbUrl = process.env.MONGO_DB_URL
//#endregion

//#region auth
app.use(passport.initialize())
//#endregion

//#region config
app.use(cors())
app.use(express.static(path.join(__dirname + '/public')))
app.use(
  urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
if (env === 'DEV') {
  app.use(morgan('dev'))
}
//#endregion

//#region openssl config
const privateKey = fs.readFileSync(path.join(__dirname + '/cert/myapp.key'), 'utf-8')
const certificate = fs.readFileSync(path.join(__dirname + '/cert/myapp.crt'), 'utf-8')
const credentials = { key: privateKey, cert: certificate }
//#endregion

//#region database
dbConnect(dbUrl)
//#endregion

//#region app endpoints
app.use('/public', publicRouter)
app.use('/accounts', passport.authenticate('jwt', { session: false }), userRouter)
app.use('/member', passport.authenticate('jwt', { session: false }), memberRouter)
app.use('/orchid', passport.authenticate('jwt', { session: false }), orchidRouter)
app.use('/categories', passport.authenticate('jwt', { session: false }), categoryRouter)
app.use('/comment', passport.authenticate('jwt', { session: false }), commentRouter)
//#endregion

app.get('*', (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: 'Not found'
  })
})

//#region create server
const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)
httpServer.listen(httpPort, () => {
  console.log(`[💡] App listening on http://localhost:${httpPort}`)
})
httpsServer.listen(httpsPort, () => {
  console.log(`[💡] App listening on https://localhost:${httpsPort}`)
})
//#endregion

export default app
