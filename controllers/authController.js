const db = require("../database");
const crypto = require("crypto");

module.exports = {
  onRegister: (req, res) => {
    const hashedPassword = crypto
      .createHmac("sha256", "kunciPassword")
      .update(req.body.password)
      .digest("hex");
    const data = {
      full_name: req.body.fullName,
      email: req.body.email,
      password: hashedPassword
    };
    db.query(
      `select email from users where email='${data.email}'`,
      (err, result) => {
        try {
          if (err) throw { msg: "Server Error" };
          if (result.length > 0)
            throw { msg: "This email not available, please try another email!" };
          db.query(`insert into users set ?`, data, (err) => {
            try {
              if (err) throw { msg: "Server Error" };
              db.query(
                `select id, full_name, email from users where email='${data.email}'`,
                (err, selectResult) => {
                  try {
                    if (err) throw { msg: "Server Error" };
                    res.send(selectResult[0]);
                  } catch (err) {
                    res.send(err);
                  }
                }
              );
            } catch (err) {
              res.send(err);
            }
          });
        } catch (err) {
          res.send(err);
        }
      }
    );
  },
  onLogin: (req, res) => {
    let email = req.query.email;
    const hashedPassword = crypto
      .createHmac("sha256", "kunciPassword")
      .update(req.query.password)
      .digest("hex");

    db.query(
      `select id, full_name, email from users where email='${email}' and password='${hashedPassword}'`,
      (err, selectResult) => {
        try {
          if (err) throw { msg: "Server Error" };
          if (selectResult.length < 1)
            throw {
              msg: "Email or Password incorrect, please try again!",
            };
          res.send(selectResult[0]);
        } catch (err) {
          res.send(err);
        }
      }
    );
  },
};
