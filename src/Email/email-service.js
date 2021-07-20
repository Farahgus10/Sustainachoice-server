const emailService = {
    insertEmail(db, newEmail) {
      return db
        .insert(newEmail).into('user_emails')
        .returning('*')
        .then(rows => {
          console.log(rows)
          return rows[0]
        });
      }
  }
  
  module.exports = emailService;