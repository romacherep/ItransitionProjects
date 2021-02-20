import React, {useCallback} from "react";
import {useState} from "react";
import useHttp from "./httpHook";
export default function useUsersHook() {
    let users = new Array()
    const {request} = useHttp()
    const getDbData = useCallback( async() => {
        try {
            const data = await request('/api/auth/getDbData', 'POST')
            users = Array.from(JSON.parse(data.message))
            console.log(data)
            console.log(users)
            return Array.from(JSON.parse(data.message))
        } catch (e) {
            console.log(e.message)
        }
    },[])
    return {users, getDbData}
}
