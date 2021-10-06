const express = require("express");
const userModel = require("../model/userModel");
// router
const userRouter = express.Router();
const { protectRoute,bodyChecker } = require("./utilFns");
// routes
let authCheckerCE = isAuthorized(["admin","ce"]);
let authChecker = isAuthorized(["admin"]);
userRouter.use(protectRoute);
userRouter
    .route('/')
    .get( authChecker,getUsers)
    .post(bodyChecker,authChecker,createUser)
// functions
userRouter
.route('/:id')
.get(getUser)
.patch(bodyChecker,authCheckerCE,updateUser)
.delete(bodyChecker,authCheckerCE,deleteUser)
async function getUsers(req, res) {
    try {
        let users = await userModel.find();
        res.status(200).json({
            "message": users
        })
    } catch (err) {
        res.status(502).json({
            message: err.message
        })
    }
}

function isAuthorized(roles){
    console.log("I  will run when the server is started");
    return async function(req,res){
        console.log("I will run when a call is made");
        let {userId} = req;
        try{
            let user = userModel.findById(userId);
            let userisAuthorized = roles.includes(user.role);
            if(userisAuthorized){
                req.user=user;
                next();
            }else{
                res.status(200).json({
                    message:"user not authorized"
                })
            }
        }
        catch(err){
            console.error(err);
            res.status(500).json({
                message:"server error"
            })
        }
    }
}

async function createUser(req,res){
    try{
        let user = await userModel.create(req.body);
        res.status(200).json({
            user:user
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"server err"
        })
    }
}
async function getUser(req,res){
    let{id}=req.params;
    try {
        let users = await userModel.findById(id);
        res.status(200).json({
            "message": users
        })
    } catch (err) {
        res.status(502).json({
            message: err.message
        })
    }
}
async function updateUser(req,res){
    let{id}=req.params;
    try {
        if(req.body.password||req.body.confirmPassword){
            return res.json({
                message:"use forget password instead"
            })
        }
        let user = await userModel.getUserById(id);
        console.log("68",user);
        if(user){
            for(let key in req.body){
                user[key]=req.body[key];
            }

            await user.save();
            await user.save({
                validateBeforeSave:false
            })
            res.status(200).json({
                "message": user
            })
        }
        else {
            res.send({
                message:"user not found"
            })
        }
    } catch (err) {
        res.status(502).json({
            message: err.message
        })
    }
}
async function deleteUser(req,res){
    let{id}=req.params;
    try {
        let user = await userModel.findByIdAndDelete(id);
            res.status(200).json({
                "message": user
            }) 
    }
     catch (err) {
        res.status(502).json({
            message: err.message
        })
    }
}
module.exports = userRouter;