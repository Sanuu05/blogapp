const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')
const Postdata = require('../models/post')
const app = require('../../firebase')
const { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } = require('firebase/auth')
const { async } = require('@firebase/util')
const { find } = require('../models/user')



const authen = getAuth(app)

//User Registration 


exports.Register = async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body
        if (!name) {
            return res.status(400).json('Fill the name field')
        }
        if (!email) {
            return res.status(400).json('Fill the email field')
        }
        if (!password) {
            return res.status(400).json('Fill the password field')
        }
        if (!cpassword) {
            return res.status(400).json('Fill the confirm password field')
        }
        const exuser = await User.findOne({ email })
        if (exuser) {
            return res.status(400).json('User with this email id already exists')
        }
        if (password === cpassword) {
            const UserCredentialImpl = await createUserWithEmailAndPassword(authen, email, password)
            // res.json(UserCredentialImpl.user)
            if (UserCredentialImpl) {
                // console.log("verr11", user.UserCredentialImpl)
                const ver = await sendEmailVerification(UserCredentialImpl.user)
                console.log("verr", ver)
                const newuser = new User({
                    name,
                    email
                })
                const saveduser = await newuser.save()
                res.status(201).json(saveduser)

            }
        } else {
            return res.status(400).json('Password and Confirm Password are not same')
        }



    } catch (error) {
        console.log("err", error?.message)
        return res.status(400).json(error?.message)
    }
}


//User Login

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log('ss', req.body)

        if (!email) {
            return res.status(400).json('Fill the email field')
        }
        if (!password) {
            return res.status(400).json('Fill the password field')
        }
        const exuser = await User.findOne({ email })
        console.log(exuser)

        if (exuser) {
            const verify = await signInWithEmailAndPassword(authen, email, password)
            // res.json()
            if (verify?.user.emailVerified) {
                console.log('ex', exuser._id)
                const token = jwt.sign({ id: exuser._id }, process.env.SEC_KEY)
                console.log('token', token)
                res.status(200).json(token)



            } else {
                return res.status(400).json('Email is not verified')
            }
        } else {
            return res.status(400).json('Check all the fields')
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json(error?.message)
    }
}

//reset password

exports.Reset = async (req, res) => {
    try {
        console.log(authen)
        const reset = await sendPasswordResetEmail(authen, req.body.email)
        res.json("Reset Link Send")
    } catch (error) {

    }
}


// User Load 

exports.Loaduser = async (req, res, next) => {
    console.log(req.user)
    const finduser = await User.findById(req.user).populate('following', 'name email profilePic following followers').populate('followers', 'name email following profilePic followers')
    res.status(200).json(finduser)

}

// Get User 

exports.Getuser = async (req, res) => {
    try {
        const find = await User.findOne({ email: req.params.id }).populate('following', 'name email profilePic following followers').populate('followers', 'name email following profilePic followers')
        res.status(200).json(find)
    } catch (error) {

    }
}

// Follow user 

exports.Follow = async (req, res) => {
    try {

        const follow = await User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user }
        }, {
            new: true
        })
        if (follow) {
            const following = await User.findByIdAndUpdate(req.user, {
                $push: { following: req.body.followId }
            }, {
                new: true
            })
            res.json(following)
        } else {
            res.status(400).json({
                msg: "auth follow failed"
            })
        }



    } catch (error) {

    }
}
// Unfollow user 

exports.Unfollow = async (req, res) => {
    try {

        const follow = await User.findByIdAndUpdate(req.body.followId, {
            $pull: { followers: req.user }
        }, {
            new: true
        })
        if (follow) {
            const following = await User.findByIdAndUpdate(req.user, {
                $pull: { following: req.body.followId }
            }, {
                new: true
            })
            res.json(following)
        } else {
            res.status(400).json({
                msg: "auth follow failed"
            })
        }



    } catch (error) {

    }
}

// Post 

exports.Postdata = async (req, res) => {
    try {
        const { body, photo } = req.body;
        // if(!title){
        //     return res.status(400).json('enter title')
        // }
        const date = new Date().toDateString()
        if (!body) {
            return res.status(400).json('enter body')
        }
        const data = await User.findById(req.user)
        if (!data) {
            return res.status(400).json('auth fail')
        }
        data.password = undefined;
        data.cpassword = undefined
        const itemData = new Postdata({
            // title,
            body,
            photo,
            postedBy: data,
            date
        })
        const itemSave = await itemData.save()
        res.json(itemSave)
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}

// get all posts 

exports.Getpost = async (req, res) => {
    try {
        const all = await Postdata.find().sort({ "_id": -1 }).populate('postedBy', ' name profilePic').populate("comments.postedBy", "name profilePic")
        res.status(200).json(all)
    } catch (error) {

    }
}

// get my posts 

exports.Getmypost = async (req, res) => {
    try {
        const all = await Postdata.find({ "postedBy": req.user }).sort({ "_id": -1 }).populate('postedBy', ' name profilePic').populate("comments.postedBy", "name profilePic")
        res.status(200).json(all)
    } catch (error) {

    }
}

exports.GetPostByUser = async (req, res) => {
    try {
        // console.log("cc",req.params.id)
        const user = await User.findOne({ email: req.params.id })
        // console.log("cc",user)
        if (user) {
            const all = await Postdata.find({ "postedBy": user._id }).sort({ "_id": -1 }).populate('postedBy', ' name profilePic').populate("comments.postedBy", "name profilePic")
            // console.log("cc",all)
            res.status(200).json(all)
        }


    } catch (error) {

    }
}

// GET ALL USER

exports.allUsers = async (req, res) => {
    try {
        const alluser = await User.find()
        res.status(200).json(alluser)
    } catch (error) {

    }

}

//update profile pic 

exports.Updatepic = async (req, res) => {
    const update = await User.findByIdAndUpdate(req.user, { "profilePic": req.body.pic })
    res.status(200).json(update)
}

// likes 

exports.Likes = async (req, res) => {
    try {
        const likedata = await Postdata.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user }
        }, {
            new: true
        })
        res.json(likedata)

    } catch (error) {
        console.log(error)
    }
}
exports.Unlikes = async (req, res) => {
    try {
        const likedata = await Postdata.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user }
        }, {
            new: true
        })
        res.json(likedata)

    } catch (error) {
        console.log(error)
    }
}

exports.Getfollowers = async (req, res) => {
    try {
        const followers = await User.findOne({ email: req.body.email }).populate('followers', 'name email')
        res.status(200).json(followers)
    } catch (error) {

    }
}
exports.Getfollowing = async (req, res) => {
    try {
        const followers = await User.findOne({ email: req.body.email }).populate('following', 'name email')
        res.status(200).json(followers)
    } catch (error) {

    }
}

exports.Comment = async (req, res) => {
    try {
        const user = await User.findById(req.user)
        console.log(user)
        const date = new Date().toDateString()
        const comment = {
            text: req.body.text,
            postedBy: user._id,
            date
        }
        const likedata = await Postdata.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        }, {
            new: true
        }).populate("comments.postedBy", "_id name")
        res.json(likedata)
    } catch (error) {

    }
}

exports.Myfollowpost = async (req, res) => {
    try {
        const user = await User.findById(req.user)
        const dataitem = await Postdata.find({ postedBy: { $in: user.following } }).sort({"_id":-1}).populate('postedBy', ' name profilePic').populate("comments.postedBy", "name profilePic")
        res.status(200).json(dataitem)
    } catch (error) {

    }
}