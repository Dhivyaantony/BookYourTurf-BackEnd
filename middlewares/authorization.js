const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    try {
        console.log(req.headers)
        console.log('Inside userAuth middleware');
        
        // Get token from header
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token:', token);

        // Verify the token
        jwt.verify(token, 'book', (err, decodedToken) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                return res.status(401).send({ msg: "Invalid Token" });
            }
            
            // Add decoded token to the request
            req.user = decodedToken;
            console.log('Decoded Token:', decodedToken);
            req.userid=decodedToken.userId
            next();
        });
    } catch (error) {
        console.error('Error in userAuth middleware:', error);
        return res.status(401).send({ msg: "No Token Provided" });
    }
};


const adminAuth = (req, res, next) => {
    try {
        console.log(req.headers)
        console.log('Inside adminAuth middleware');
        
        // Get token from header
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token:', token);

        // Verify the token
        jwt.verify(token, 'book', (err, decodedToken) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                return res.status(401).send({ msg: "Invalid Token" });
            }
            
            // Add decoded token to the request
            if(decodedToken && decodedToken.role===1)
            req.user = decodedToken;
            console.log('Decoded Token:', decodedToken);
            req.userId=decodedToken.userId
            next();
        });
    } catch (error) {
        console.error('Error in adminAuth middleware:', error);
        return res.status(401).send({ msg: "No Token Provided" });
    }
};

module.exports = { userAuth,adminAuth };
