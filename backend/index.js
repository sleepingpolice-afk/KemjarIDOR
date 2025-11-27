require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
	res.json({ success: true, message: 'Backend is running' })
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
