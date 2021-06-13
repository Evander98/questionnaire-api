const db = require("../database");

module.exports = {
  getCategory : (req, res) => {
    db.query('select * from category', (err, result) => {
      try {
        if(err) throw err
        res.send(result)
      } catch (err) {
        res.send(err)
      }
    })
  },
  addCategory : (req, res) => {
    db.query(`insert into category (category_name) values('${req.body.categoryName}')`, (err) => {
      try {
        if(err) throw err
        res.redirect('/category/getCategory')
      } catch (err) {
        res.send(err)
      }
    })
  },
  deleteCategory : (req, res) => {
    db.query(`delete from category where id=${req.body.id}`, err => {
      try {
        if(err) throw err
        res.redirect('/category/getCategory')
        // res.send('Berhasil')
      } catch (err) {
        res.send(err)
      }
    })
  }
}