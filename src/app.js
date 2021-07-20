require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const winston = require('winston')
const sustainachoiceRouter = require ('./Sustainachoice/sustainachoice-router');
const emailRouter = require ('./Email/email-router')

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

// set up winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'info.log' })
    ]
  });

  if(NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

// app.get('/', (req, res) => {
//     res.send('Hello, world!')
// })

// app.use(express.json());
app.use(sustainachoiceRouter);
app.use(emailRouter);


app.use(function errorHandler(error, req, res, next){
    let response 
    if (NODE.ENV === "production"){
        response = { error: {message: 'server error'}}
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app