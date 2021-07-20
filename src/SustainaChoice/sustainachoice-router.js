const express = require('express');
const sustainachoiceRouter = express.Router();
const sustainachoiceService = require('./sustainachoice-service');

sustainachoiceRouter
  .route('/api/results')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    sustainachoiceService.getResults(knexInstance, req.query)
      .then(results => {
        if(!results) {
          return res.status(404).json({
            error: { message: 'No results' }
          })
        }
        res.json(results);
        next();
      })
      .catch(next);
  })

  module.exports = sustainachoiceRouter;