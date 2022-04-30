const app = require("express")();

// Модули
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios"); // npm i axios
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const crypto = require("crypto");

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Константы
const host = "garantex.io"; // для тестового сервера используйте stage.garantex.biz
// const host = "stage.garantex.biz"; // для тестового сервера используйте stage.garantex.biz
const privateKey =
  "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBeUZkem8xcDNRT1Jxa0RyVG82MVI3Sk5lSlVOakFqcFdvVzhDZWFtaDVWYU5wQjl3CmxyS0VzMDJST3UxcUI4aWovaFhoREd6STQ5aTdyR1B3ckRRVkRhTGtIYW15SEdRVllXdHJ4bGZqOFd3d3FJdUQKQm1xZDlXODhDL255cGt0T2wrV0Y3VUltcGQ1V3B0MEIwT29IdktTSG85TlhkaVlQaEVKQ0tFc1RZT0I2YnRVeAoxMm1VazllbmMvUnFxaGpROFJuY2xmSWlseUZlNHNWOEtCN2pBdVJxclpTbFJnUHZxNlA3RElUc2lVak8wdzhmCmFYVW5sVTZRQWFONHphSmdQaDVGSEJxVEJPM2NuTVRsRWJ6YnpNZmU4QU1pemRZdWFYdHJmT09PK2dya3VBdEwKU2FISmRsWDJxK0oycWUrSUZkamU1VXY3SUFEQmxOd0hjK0dVTHdJREFRQUJBb0lCQUEzOURUWDZ1eGpzMmdQNApGNDcyS3lJNXAva3lHMWVzZXlBS2dFRytkbTlzKzdiWit5S0tsSGx3a1JOc1FGc0t4MmlXWG9CZm1DZFFtc29PCnNGOVZ3NktRSFIxMUc5cWZvbDZMQVp0M3g1S3oyekhwaTl5RzFVQ3Q0Nk55Y0Y3c0l6QzM5Z0g2L0hmWWJuUjQKT2dnOFR3Mzg3dnVoWmhuNXpsdU54TkRMYlM3MlhlQzlmN1lJNGNPUlZjNk9BcCtTZG1taGl6bGR4Sjk3NTM3QQpPTGpFZ1l3RG1VL0FRNDhjeXIyclFQeTVYbWgzSjIwTWZwU1lEejl2ZkZLV2tsOWVyS1RMd3NSaU5zZXBocUZKCkNwQXdwYy9FWTE0NzNETTF4UGpoTXJtMmVSdmlDeFpPSUNMVnlMdGQzVWovUmg2YkxqbWF1ZlRhRW5ZWm5KclUKR09NT3RRRUNnWUVBODNNTk5tbVN3eEYrWFRRQ2RybFRESjhkd2hVTUZEYzdLYTFKSUo1eE1Mbnk0VllLL2d1Wgp6NW95VnJ4eFBWSFhhcXhSWDFTNGZ0SVhabTBsYWNFR1V6K1dTQ200UkNyTEJvUFF3WkRTQ2NDLzkzZDVWVmlhCkpKQWdvT1N3UTd2VXlrSkRpQXM3SkFJMmJiazBTTGdqZXdTL0ZXcDkxSjk0WjlEOExLWThhVjBDZ1lFQTBxdDYKK2xZVjd6OEs1RGJIMFNxcmVWbVllYXRjVW81cVN2Mk92Sm55Q3Q4SWd1T0lrcXozNVUwVW9FazdWMlRJT1BPQQpPNHRxR0RzNit1c24yZWZhQ1RnK0twYk4vYjE1d2N6alhTdEJUMWFtS1kvYXJHUWVDdEhaUHo0czNzMnpCekloCnp0T05Za0dnMTFWVm5RNWVJV0x6R1NycVluYm4rYjJSeGRETS92c0NnWUFPak9qVVFMa1oyWmpRMzBQcWJxY3QKRVBHSllSS292cWhWbEZyVGpVUzhvZENIY1VvVTV3S1phdURwV0RmNGIwVE54bURTcnRDY0c5aDBNYi9UczBxNgpmUWx4WkxUenRnOE9ZNkI5Z1RkY2g5MnhYNzJyd1REdFVJUHl1ZGhqSS8zUzNPVUdZNDEwV0lHQ1MxaDVwQy9TCnNYVHVSY0FoamlwM0lnR0FkYXNVclFLQmdIV0RYQVQ2TWlBVGJYTGhyOUpZVi9CSDd3cW5jTWRJVTdoaStkVHcKbHBoRDB3Nlg5MTNDQ0VHckhuOU9la0NFb2o5S2JOUktMek0zRHU1YWNBOVlDa0tzVWRrVjUrL0xXbmlsWG9waApEM3cvSEU4QXhIejNGOTczTVpUYWpOTDNzUTZwZ3p4SXU0djhpY2l6L0I2d25nZEhsODBKS0ZjbWRyM1RaZFlQClk5b3pBb0dCQUxiRmIrYjNTemtVN1dVeks0MzJMenlMTWk0dEhqc3lkbHpHSWhCc2c4ZGhDQnJVUzJJTUJpbHAKdkR2clc1RGlTZ3BWMlFhcFdhYUlHemh2bnVRQ2NiVEwwVjFOY1JmU3ZHZTh4cFhyTlQyamRvcERRYTVtUUdxVgp3N2FnMUZQR3hBQ0ppMHRVOXM4S0xDY2FyUExCR2J3eGd5cDV6U3FUbS94MkE3blNWWWorCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg=="; // приватный ключ, полученный на этапе создания API ключей
const uid = "56e25e74-8e44-4a81-a043-aa5f1007ab0c"; // UID, полученный на этапе создания API ключей

// Методы
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

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`);
});
