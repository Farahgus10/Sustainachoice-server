const express = require('express');
const emailRouter = express.Router();
const emailService = require('./email-service');
const jsonBodyParser = express.json();

emailRouter
  .route('/api/emails')
  .post(jsonBodyParser, (req, res, next) => {
    const { email } = req.body;
    const newUserEmail = { email };

  for (const [key, value] of Object.entries(newUserEmail))
    if (value === null || value === undefined)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });
  
  emailService.insertEmail(
    req.app.get('db'),
    newUserEmail
  )
    .then(email => {
      res 
        .status(201)
        .location(req.originalUrl + `/${email.id}`)
        .json(email);
    })
    .catch(next);
  });

  module.exports = emailRouter;