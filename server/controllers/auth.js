const User = require('../models/user');

exports.createOrUpdateUser = async (req, res) => {
    // get the data from the request that coming from the auth middleware 
    const { email, name, picture } = req.user;

    // try to update the user - and if not exist create it
    const user = await User.findOneAndUpdate({email}, {name: email.split('@')[0], picture}, {new: true});
    if (user) {
        console.log('USER UPDATED : ', user);
        res.json(user);
    } else {
        // mean we need to create it
        const newUser = await new User({email, name: email.split('@')[0], picture}).save(); // to create it and save it in the same time
        console.log('USER CREATED : ', newUser);
        res.json(newUser);
    }
}

exports.currentUser = async (req, res) => {
    User.findOne({email: req.user.email}).exec((err, user) => {
        if(err) throw new Error(err);
        res.json(user);
    })
}