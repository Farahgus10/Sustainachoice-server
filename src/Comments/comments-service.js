const CommentsService = {
    getAllComments(db) {
        return db.select('*').from('location_comments')
    },
    insertComment(db, newComment) {
        return db.insert(newComment).into('location_comments').returning('*').then(rows => { return rows[0] })
    }, 
    getById(db, id) {
        return db.from('location_comments').select('*').where('id', id).first()
    },
    deleteComment(db, id) {
        return db('location_comments').where({ id }).delete();
    },
    updateComment(db, id, updatedComment) {
        return db('location_comments').where({ id }).update(updatedComment)
    },
}

module.exports = CommentsService