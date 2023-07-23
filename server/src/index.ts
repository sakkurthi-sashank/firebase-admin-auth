import express, { Application } from 'express'
import firebase from 'firebase-admin'
import cors from 'cors'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const serviceAccount = require('../serviceAccountKey.json')
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
})

app.get('/', (req, res) => {
  res.send({
    status: 'success',
    data: {
      message: 'server is running',
    },
  })
})

app.get('/public', (req, res) => {
  res.send({
    status: 'success',
    data: {
      message: 'This is public route',
    },
  })
})

app.use((req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    firebase
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.body.uid = decodedToken.uid
        next()
      })
      .catch((error) => {
        res.send({
          status: 'error',
          message: 'unauthorized',
        })
      })
  }
})

app.get('/protected', async (req, res) => {
  const user = await firebase.auth().getUser(req.body.uid)

  res.send({
    status: 'success',
    data: {
      message: {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      },
    },
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log('Server running on port ' + PORT))
