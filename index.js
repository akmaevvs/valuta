const app = require("express")();

// Модули
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios"); // npm i axios
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const crypto = require("crypto");

// var corsOptions = {
//   origin: "http://n91721mw.bget.ru/",
// };

app.use(cors({
  origin: '*'
}));
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//   next();
// });
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Константы
const host = "garantex.io"; // для тестового сервера используйте stage.garantex.biz
// const host = "stage.garantex.biz"; // для тестового сервера используйте stage.garantex.biz

// Методы
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});
app.post("/currencies", (req, res) => {
  // console.log(req.body)
  axios
    .get("https://" + host + "/api/v2/currencies", {
      headers: {
        Authorization: `Bearer ${req.body.jwt}`,
      },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});
app.get("/getToken", (req, res) => {
  axios
    .post("https://dauth." + host + "/api/v1/sessions/generate_jwt", {
      kid: uid,
      jwt_token: jwt.sign(
        {
          exp: Math.round(Date.now() / 1000) + 30 * 60, // JWT Request TTL: 30 minutes
          jti: crypto.randomBytes(12).toString("hex"),
        },
        new Buffer.from(privateKey, "base64").toString("ascii"),
        { algorithm: "RS256" }
      ),
    })
    .then((response) => {
      res.send(response.data.token);
    })
    .catch((e) => {
      res.send(e);
    });
});
app.post("/markets", (req, res) => {
  // console.log(req.body)
  axios
    .get("https://" + host + "/api/v2/markets", {
      headers: {
        Authorization: `Bearer ${req.body.jwt}`,
      },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});
app.post("/depth", (req, res) => {
  const { marketId } = req.body;
  // console.log(req.body)
  axios
    .get("https://" + host + "/api/v2/depth?market=" + marketId)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(8081, () => {
  console.log(`Example app listening on port ${8081}`);
});
