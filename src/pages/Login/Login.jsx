import {  useState } from "react"
import { useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import './Login.css'

const AUTH = gql`
    mutation login($username: String! $password: String!) {
        login(username: $username, password: $password)
    }
`


const Login = () => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");


    const [ login ] = useMutation(AUTH, {
        update: (cache, data) => {
            if(data && data.data.login !== 'notuser') {
                localStorage.setItem('token', data.data.login)
                window.location.href = '/chat'
            } else {
                alert("Username yoki parol xato !!!")
            }
        }
    })


    const handleSubmit = (e) => {
        e.preventDefault()
        e.target[0].value = ''
        e.target[1].value = ''
        e.target[2].value = ''
        login({
            variables: {
                username: userName,
                password: password
            }
        })

    }

    return (
        <>
            <div className=" login">
                <h1 className="login-heading text-info">Tizimga kirish</h1>
            <Link to='/register' className=" register-btn text-decoration-none " >Ro'yhatdan o'tish</Link>
            <form className=" forma bg-transparent" onSubmit={e =>  handleSubmit(e)}>
                <input className=" form-control mb-2" onChange={e => setUserName(e.target.value) } type="text" placeholder="Username kiriting ..." />
                <input className=" form-control mb-2" onChange={e => setPassword(e.target.value) } type="text" placeholder="Parol kiriting ..." />
                <button className=" btn btn-outline-info">Kirish</button>
            </form>
            </div>
        </>
    )
}

export default Login
