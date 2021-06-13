const db = require('../database')

module.exports = {
  addQuestions : (req, res) => {
    try {
      for(let i = 0; i < req.body.length; i++){
        db.query(`insert into questions (question, id_user) values('${req.body[i].question}', ${req.params.userId})`, err => {
          try {
            if (err) throw err.sqlMessage
            db.query(`select id from questions where question='${req.body[i].question}'`, (err, result) => {
              try {
                if(err) throw err.sqlMessage
                for(let j = 0; j < req.body[i].options.length; j++){
                  db.query(`insert into options (id_question, options.option) values('${result[0].id}', '${req.body[i].options[j]}')`, err => {
                    if(err) throw err
                  })
                }
              } catch (err) {
                res.send(err)
                console.log(err)
              }
            })
          } catch (err) {
            res.send(err)
          }
        })
      }
      res.send('Question saved!')
    } catch (err) {
      res.send(err)
    }
  },
  getQuestionnaire : (req, res) => {
    let newResult = []
    db.query('select * from questions', (err, questionResult) => {
      try {
        if(err) throw err.sqlMessage
        db.query('select * from options', (err, optionsResult) => {
          for(let i=0;i<questionResult.length;i++){
            newResult.push(questionResult[i])
            newResult[i].options = []
            for(let j=0; j<optionsResult.length;j++){
              if(optionsResult[j].id_question == newResult[i].id){
                newResult[i].options.push(optionsResult[j].option)
              }
            }
          }
          res.send(newResult)
        })
      } catch (err) {
        res.send(err)
      }
    })
  }
}