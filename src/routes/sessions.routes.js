import { Router } from "express";
import __dirname from "../utils.js";
import usersDao from "../daos/dbManager/users.dao.js";
import { createHash, isValidPassword } from '../utils.js'


const router = Router();

//Registro un usuario
router.post('/register', async(req,res) =>{
    console.log(req.body);
    const { first_name, last_name, email, age, password } = req.body;
    console.log("Registro de usuario");
    console.log(req.body);
    
     //Validamos si el user existe en la DB
    const exist = await usersDao.getUserbyEmail(email);
     if (exist) {
         return res.status(400).send({ status: 'error', message: "Usuario ya existe!" })
    }
    
    const user = {
        first_name,
        last_name,
        email,
        age,
        // password //se encriptara despues...
        password: createHash(password)
    }
 
    try{
        const userAdded = await usersDao.createUser(user);
        res.json({
            message:"User created",
            userAdded,
        }); 
       
    }
    catch(error) {
        res.status(400).send({error:error.message})
    }


})

//Login del usuario
router.post('/login' , async (req, res) => {
    console.log(req.body);
    const {username, password, email} = req.body;
    /* if (username !=='pepe' || password !=='pepepass'){
        return res.send("Login failed");
    } */
    if (email ==='adminCoder@coder.com' || password ==='adminCod3r123'){
        req.session.user = {
            name: `Administrador`,
            email: email,
            age: 0,
            role:"Admin"
        }
        
    }else{
        const user = await usersDao.getUserbyEmail(email);
        if (!user) return res.status(401).send({ status: 'error', error: "Incorrect credentials" })
        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "Incorrect credentials" })
        }

        
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role:"usuario"
        } 
    }
    console.log("Datos de la session");
    console.log(req.session.user);
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
    /* console.log(user);
    req.session.user = username
    req.session.admin = true
    //res.send("login success!")
    console.log(req.session);
    res.redirect('/home'); */
})

export default router;  

