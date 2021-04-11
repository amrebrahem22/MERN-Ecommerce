const admin = require('../firebase');
const User = require('../models/user');

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

exports.adminCheck = async (req, res, next) => {
    const { email } = req.user;
  
    const adminUser = await User.findOne({ email }).exec();
  
    if (adminUser.role !== "admin") {
      res.status(403).json({
        err: "Admin resource. Access denied.",
      });
    } else {
      next();
    }
  };