const { Router } = require('express')
const router = Router()
// registration
const jwt = require('jsonwebtoken')
const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const schema = new Schema({
    email:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    password:{type:String, required:true},
    isBanned:{type:Boolean,required:true},
    isSelected:{type:Boolean, required:true},
    registrationDate:{
        type:String
    },
    lastLoginDate:{
        type:String
    }
})
const User = mongoose.model('User', schema)
router.post('/check', async (req,res)=>{
    console.log(JSON.stringify(req.body, null, 2))
    return res.status(201).json({message:JSON.stringify(req.body)})
})
router.delete('/delete/:email', async (req,res)=>{
    res.setHeader('Content-Type', 'application/json')
    const deleteEmail = req.params.email;
    const check = await User.findOne({email:deleteEmail})
    if(check){
        User.deleteOne({email:deleteEmail},(err,result)=>{
            if (err){
                console.log(err.message)
                return res.json({message:err.message})
            }
            console.log('User with email ',deleteEmail,' was deleted ', result)
            return res.json({message:"Пользователь удалён"})
        })
    } else {
        return res.json({message:"Данные не найдены "})
    }

})
router.get('/can/:Id', async(req,res)=>{
    res.setHeader('Content-Type', 'application/json')
    const targetId = req.params.Id
    console.log(targetId)
    const user = await User.findById(targetId)
    if (user.isBanned){
        return res.json({message:true})
    } else {
        return res.json({message:false})
    }

})
router.put('/update/:email/:name', async (req,res)=>{
    try{
        console.log(req.params.name)
        if(req.params.name=='ban'){
            User.updateOne({email:req.params.email},{isBanned:true}, (err,result)=>{
                res.json({message:"Пользователь обновлён"})
            })
        }else if(req.params.name=='unban'){
            User.updateOne({email:req.params.email},{isBanned:false}, (err,result)=>{
                res.json({message:"Пользователь обновлён"})
            })
        }

    } catch (e) {
        console.log(e.message)
    }
})
const getCurrentDate = ()=>{
    const date = new Date(Date.now())
    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const currentDate = `${month}/${day}/${year} ${hour}:${minutes}:${seconds}`
    return currentDate
}
router.get('/getDbData',async (req,res)=> {
    res.setHeader('Content-Type', 'application/json')
    const collectionOfUsers = await User.find();
    console.log(JSON.stringify(collectionOfUsers))
    return res.json(collectionOfUsers)
})
router.post('/register', async (req,res)=>{
    try{
        res.setHeader('Content-Type', 'application/json')
        const {email,password,name} = req.body
        let user = await User.findOne({email:email})
        if(user){
            return res.status(400).json('Пользователь с таким email уже существует')
        }

        const userCreate = new User({
            email:email,
            password:password,
            name:name,
            isBanned:false,
            isSelected:false,
            registrationDate:getCurrentDate(),
            lastLoginDate:getCurrentDate()
        })
        await userCreate.save()
        const token = jwt.sign(
            {userId: userCreate.id},
            "2002",
            {expiresIn: '1h'}

        )
        return res.status(201).json({
            token:token,
            userId:userCreate.id,
            isBanned:userCreate.isBanned,
            userEmail:userCreate.email,
            message:'Пользователь создан'
        })
    } catch (e){
        console.log(e.message)
        return res.status(500).json({message:'Сервер не отвечает routes.js', error:e.message})
    }
})

router.post('/login',async (req,res)=>{
    try{
        res.setHeader('Content-Type', 'application/json')
        const {email,password} = req.body
        console.log("email: ", email, " password: ", password)
        let user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({message:'Пользователь не найден'})
        }
        if (user.password == password){
            await User.updateOne({email:user.email},{lastLoginDate:getCurrentDate()})
            const token = jwt.sign(
            {userId: user.id},
                "2002",
                {expiresIn: '1h'}

            )
            return res.json({
                token:token,
                userId:user.id,
                isBanned:user.isBanned,
                userEmail:user.email
            })
        } else{
            return res.status(400).json({message:'Неверные данные'})
        }
    } catch (e){
        console.log(e.message)
        return res.status(500).json({message:'Ошибка в логин блоке'})
    }

})
module.exports = router
