const express = require('express')
const router = express.Router();
const multer = require('multer');
const User = require('../models/users')
const fs = require('fs');

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

router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    let user = await User.findById(id);
    if (user == null) {
        res.redirect('/');
    }
    else {
        res.render('edit-users', { title: "Edit User", user: user });
    }
})

router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let newImg = null;
    if (req.file) {
        newImg = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        }
        catch (error) {
            if (error) {
                console.log(err);
            }
        }

    }
    else {
        newImg = req.body.old_image;
    }

    await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: newImg,

    });


    req.session.message = {
        type: "success",
        message: "User updated Successfully"
    }

    res.redirect('/');


})

router.get('/delete/:id',async (req,res)=>{
    let id = req.params.id;
    
    let result = await User.findByIdAndDelete(id);
    try{
        fs.unlinkSync('./uploads/'+result.image);
    }
    catch(err){
        console.log(err);
    }

    req.session.message = {
        type : "info",
        message : "User delete Successfully"
    }

    res.redirect('/');

});

module.exports = router