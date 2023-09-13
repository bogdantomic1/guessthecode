const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    res.redirect("/login");
    }
    
    try {
        const valid = verify(token, "jwtPrivateKey");
        req.user = valid;
        next();
    }
    catch (err) {
        res.redirect("/login");
    } 
}

module.exports = validateToken;