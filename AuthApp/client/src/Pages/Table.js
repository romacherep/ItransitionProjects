import React, {useContext, useEffect, useState} from "react";
import 'react-bootstrap';
import './Pages.css'
import useHttp from "../Hooks/httpHook";
import {Context} from "../context/Context";
const columns = ["Id","Name","Email","isBanned","Registration Date","Last Login Date"]

export default function Table(){
    const {request} = useHttp()
    const [inBan, setBan] = useState(false)
    const auth = useContext(Context)
    let i = 0
    const arr = ['1','2','3']
    let [users, setUsers] = useState([])
    let userList = new Array()
    const [mail, setEmail] = useState(null)
    const UserInBan = () =>{
        console.log(auth.userId)
        const getStatus = async ()=>{
            const data = await request('/api/auth/can/'+auth.userId, 'GET')
            localStorage.setItem('inBan',JSON.stringify({inBan:data.message}))
            const {inBan} = JSON.parse(localStorage.getItem('inBan'))
            setBan(inBan)
        }
        getStatus()
        return inBan
    }
    const Data =useEffect( ()=>{
        Ban()
        if(!inBan){
            try {
                const getData = async () => {
                    const data = await request('/api/auth/getDbData', 'GET')
                    console.log(users)
                    setUsers(data)
                    console.log(users)
                    userList = data
                    return data
                }
                const data = getData()
                setUsers(userList)
                console.log(users)
                return data
            }
            catch (e) {
                    console.log(e.message)
                }
        } else {
            auth.logout()
        }
    },[])
    const isBanned = (status)=>{
        if (status)
        {
            return 'true'
        } else {
            return 'false'
        }
    }
    const Ban = ()=>{
        UserInBan()
    }

    const ChangeBox = (User) =>{
        Ban()
        if(!inBan)
            {setUsers(users.map(user=>{
                if(user==User){
                    user.isSelected=!(user.isSelected)
                }
                return user
            }))} else{
                auth.logout()
            }

    }
    const lockUser = async (email, type) =>{
        let Url
        if (type){
            Url = '/api/auth/update/'+email +'/ban'
        } else {
            Url = '/api/auth/update/'+email +'/unban'
        }
        const data = await request(Url, 'PUT')
    }
    const UnBanUsers = () =>{
        Ban()
        if (!inBan){
            setUsers(users.map(user=>{
                if(user){
                    if(user.isSelected){
                        user.isBanned = false;
                        lockUser(user.email,false).then(r=>console.log('Пользователь разблокирован'))
                    }
                    return user
                }
            }))
        } else {
            auth.logout()
        }
    }
    const BanUsers = ()=>{
        Ban()
        if (!inBan){
            setUsers(users.map(user=>{
                if(user){
                    if(user.isSelected){
                        if(user._id==auth.userId){
                            console.log('ban yourself')
                            auth.logout()
                        }
                        user.isBanned = true;
                        lockUser(user.email,true).then(r=>console.log('Пользователь заблокирован'))
                    }
                    return user
                }
            }))
        } else {
            auth.logout()
        }
    }
    const delUser =async (email) =>{
        const Url = '/api/auth/delete/'+email
        const data = await request(Url, 'DELETE')
        return data
    }
    const DeleteUsers= ()=> {
        Ban()

        if (!inBan){
            setUsers(users.map(user => {
                if (user){
                    if (user.isSelected) {
                        delUser(user.email).then(r => console.log('Пользователь удалён'))
                        if(user._id == auth.userId){
                            auth.logout()
                        }
                    } else {
                        return user
                    }
                }
            }))
        } else {
            auth.logout()
        }
    }
    const [checked, setCheck] = useState(false)
    const SellectAll=()=>{
        Ban()
        if (!inBan){
            setCheck(!checked)
            setUsers(users.map(user=>{
                if(user && !checked){
                    user.isSelected = true
                } else if(user && checked){
                    user.isSelected = false
                }
                return user
            }))
        } else{
            auth.logout()
        }
    }
return(
    <div>
        {console.log(users)}
        <div className="row">
            <div className="col-1" />
            <div className="col-1"><button className="btn btn-danger" onClick={()=>DeleteUsers()}>Удалить</button></div>
            <div className="col-2"/>
            <div className="col-1"><button className="btn btn-warning" onClick={()=>UnBanUsers()}>Разблокировать</button></div>
            <div className="col-2"/>
            <div className="col-1"><button className="btn btn-dark" onClick={()=>BanUsers()}>Заблокировать</button></div>
            <div className="col-2"/>
            <div className="col-1"><button className="btn btn-dark" onClick={()=>auth.login()}>SignOut</button></div>
        </div>
        <div className="table-responsive">
        <table className="table table-bordered table-hover">
            <thead>
            <tr>
                <th><input type="checkbox" checked={checked} onChange={()=>SellectAll()}/></th>
                {
                    columns.map(column=><th>{column}</th>)
                }
            </tr>
            </thead>
            <tbody>
            {users.map(user=> {
                if(user){
                    return(
                        <tr>
                            <td>
                                <input type="checkbox" checked={user.isSelected} onChange={() => ChangeBox(user)}/></td>
                            <td>
                                {user._id}
                            </td>
                            <td>
                                {user.name}

                            </td>
                            <td>
                                {user.email}
                            </td>
                            <td>
                                {isBanned(user.isBanned)}
                            </td>
                            <td>
                                {user.registrationDate}
                            </td>
                            <td>
                                {user.lastLoginDate}
                            </td>
                        </tr>
                    )
                }
            })}
            </tbody>
        </table>
        </div>
    </div>
)
}
