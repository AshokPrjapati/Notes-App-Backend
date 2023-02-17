const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (decoded) {
                // console.log(decoded);
                req.body.user = decoded.userId
                next();
            }
            else res.status(401).send({ error: e.message })
        })
    } else {
        res.send({ error: "Token is not present" });
    }
};

module.exports = authenticate;