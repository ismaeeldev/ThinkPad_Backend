var jwt = require('jsonwebtoken');
const JWT_SECRET = "ismaeeltoken$";//json web token 

const fetchuser = (req, res, next) => {

    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).send({ error: "Please autenticate using valid token..." });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(400).send({ error: "Please authenticate using valid token..." });
    }
}

module.exports = fetchuser;

