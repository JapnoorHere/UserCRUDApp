const express = require('express')
const router = express.Router();
const multer = require('multer');
const User = require('../models/users')

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    },
});

var upload = multer({
    storage: storage,
}).single('image');

//Insert user 

router.post('/add', upload, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    })

    await user.save();

    req.session.message = {
        type: 'success',
        message: "User added successfully"
    };

    res.redirect('/');
})


router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: 'Home Page',
            users: users
        });
    } catch (error) {
        res.json({ message: error.message });
    }
});



router.get('/add', (req, res) => {
    res.render('add-users', { title: "Add Users" });
})

module.exports = router
