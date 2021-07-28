const express = require('express');
const path = require('path')
const xss = require('xss')
const CommentsService = require('./comments-service')

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeComment = comment => ({
    id: comment.id,
    text: xss(comment.text),
    date_commented: comment.date_commented,
    location_id: comment.location_id,
    user_id: comment.user_id
})

commentsRouter
    .route('/comments')
    .get((req, res, next) => {
        const db = req.app.get('db')
        CommentsService.getAllComments(db)
            .then(comments => {
                res.json(comments.map(serializeComment))
            })
            .catch(next)
    })
    .post((req, res, next) => {
        const db = req.app.get('db')
        const { text, location_id, user_id, date_commented } = req.body
        const newComment = { text, location_id, user_id, date_commented }

        for(const [key, value] of Object.entries(newComment))
            if(value == null) 
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body` }
                })
        
        newComment.date_commented = date_commented;

        CommentsService.insertComment(db, newComment)
            .then(comment => {
                res.status(201).location(path.posix.join(req.originalUrl, `/${comment.id}`)).json(serializeComment(comment))
            })
            .catch(next)
    })
    
    commentsRouter
        .route('/comments/:comment_id')
        .all((req, res,  next) => {
            const db = req.app.get('db');
            CommentsService.getById(db, req.params.comment_id)
                .then(comment => {
                    if(!comment) {
                        return res.status(404).json({ error: { message: `Comment doesn't exist` }})
                    }
                    res.comment = comment
                    next()
                })
                .catch(next)
        })
        .get((req, res, next) => {
            res.json(serializeComment(res.comment))
        })
        .delete((req, res, next) => {
            const db = req.app.get('db');
            CommentsService.deleteComment(db, req.params.comment_id)
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch((req, res, next) => {
            const db = req.app.get('db');
            const updatedComment = { text, date_commented } = req.body

            const numberOfValues = Object.values(updatedComment)
            if(numberOfValues === 0)
                return res.status(400).json({ error: { message: `Request body must contain either 'text' or 'date_comments'` }})

            CommentsService.updateComment(db, req.params.comment_id, updatedComment)
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })



module.exports = commentsRouter