const admin = require('../firebase');

exports.authCheck = async (req, res, next) => {
    try {
        // verify the auth token in firebase
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        console.log('FIREBASE AUTH CHECK USER: ', firebaseUser);
        // store it in the request to get it in the route
        req.user = firebaseUser;
        next(); // go to the next middleware 
    } catch(error) {
        console.log('AUTH CHECK ERROR: ', error);
        res.status(401).json({
            error: 'Invalid Token or Expired.'
        })
    }
}