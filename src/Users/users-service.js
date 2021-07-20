const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    validatePassword(password) {
        if(password.length < 6) {
            return 'Password must be longer than 6 characters.'
        }
        if(password.length > 72) {
            return 'Password must be shorter than 72 characters.'
        }
        if(password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces.'
        }
        // if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
        //     return 'Password must contain 1 upper case, lower case, number, and special character'
        // }
        return null
    },
    hasEmail(db, email) {
        return db('users').where({ email }).first().then(user => !!user)
    },
    hasUserName(db, user_name) {
        return db('users').where({ user_name }).first().then(user => !!user)
    },
    insertUser(db, newUser) {
        return db.insert(newUser).into('users').returning('*').then(([user]) => user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            full_name: xss(user.full_name),
            user_name: xss(user.user_name),
            email: xss(user.email),
            date_created: new Date(user.date_created)
        }
    },
    getAllUsers(db) {
        return db.select('*').from('users')
    }
}

module.exports = UsersService