const sustainachoiceService = {
  getResults(db, query = {}) {
    return db.select('*').from('results').where(query)
  }
}

module.exports = sustainachoiceService;