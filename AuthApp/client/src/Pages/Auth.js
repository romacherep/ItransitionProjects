import React, {useContext, useState} from "react";
import 'react-bootstrap'
import './Pages.css'
import useHttp from "../Hooks/httpHook";
import {Context} from "../context/Context";
export default function Auth(props){
    const auth = useContext(Context)
    const {loading, request} = useHttp()
    const [form, setForm] = useState({
        email: '', password: '',name:''
    })

    const formHandler = (event) =>{
        setForm({...form,[event.target.name]: event.target.value})
        console.log(form)
    }

    const registrationHandler = async () =>{
            try {
                const {email, password, name} = {...form}
                const data = await request('/api/auth/register', 'POST', {email,password,name},{})
                if(data.message=='Пользователь создан'){
                    console.log('Hi')
                    auth.login(data.token,data.userId,data.isBanned,data.userEmail)
                }
            } catch (e) {}
    }
    const loginHandler = async () =>{
        try {
            const {email, password} = {...form}
            const data = await request('/api/auth/login', 'POST', {email,password},{})
            auth.login(data.token,data.userId, data.isBanned, data.userEmail)
        } catch (e) {}
    }
    return(
        <div className="background blue">
            <div className="container row mt-5">
                <div className="col-5 card">
                    <form>
                        <h2 className="card-title">LogIn</h2>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="InputEmail" htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" name="email"
                                       onChange={formHandler}/>
                                <small id="emailHelper" className="form-text text-muted">You should enter your email in this
                                    row</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="InputPassword" htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password"
                                       name="password"
                                       onChange={formHandler}/>
                                <small id="passwordHelper" className="form-text text-muted">You should enter your password in this row</small>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary" disabled={loading} onClick={loginHandler}>Войти</button>
                        </div>
                    </form>
                </div>
                <div className="col-2"> </div>
                <div className="col-5 card">
                    <form>
                        <h2 className="card-title">Register</h2>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="InputEmail" htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" name="email"
                                       onChange={formHandler}/>
                                <small id="emailHelper" className="form-text text-muted">You should enter your email in this
                                    row</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="InputName" htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="text" placeholder="Enter your name" name="name"
                                       onChange={formHandler}/>
                                <small id="emailHelper" className="form-text text-muted">You should enter your email in this
                                    row</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="InputPassword" htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter password"
                                       name="password"
                                       onChange={formHandler}/>
                                <small id="passwordHelper" className="form-text text-muted">You should enter your password in this row</small>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="btn btn-primary" disabled={loading} onClick={registrationHandler}>Регистрация</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
