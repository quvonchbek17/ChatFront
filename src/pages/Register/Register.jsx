import {  useState } from "react"
import { useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import './Register.css'

const REGISTER = gql`
    mutation newUser($name: String! $username: String! $password: String!) {
        newUser(name: $name, username: $username, password: $password){
            id
            name
            username

        }
    }
`


const Register = () => {

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");


    const [ newUser ] = useMutation(REGISTER, {
        update: (cache, data) => {

            if(data && data?.data?.newUser) {
                alert("Muvaffaqiyatli ro'yhatdan o'tdingiz 🙂")
                window.location.href = '/'
            }
        }
    })


    const handleSubmit = (e) => {
        e.preventDefault()
        e.target[0].value = ""
        e.target[1].value = ""
        e.target[2].value = ""

        newUser({
            variables: {
                name: name,
                username: userName,
                password: password
            }
        })

    }

    return (
        <>
            <div className=" login">
            <h1 className="register-heading text-info">Ro'yhatdan o'tish</h1>
            <Link to='/' className=" register-btn text-decoration-none " >Tizimga kirish</Link>
            <form className=" forma bg-transparent" onSubmit={e =>  handleSubmit(e)}>
                <input className=" form-control mb-2" onChange={e => setName(e.target.value) } type="text" placeholder="Ismingizni kiriting ..." />
                <input className=" form-control mb-2" onChange={e => setUserName(e.target.value) } type="text" placeholder="Username kiriting ..." />
                <input className=" form-control mb-2" onChange={e => setPassword(e.target.value) } type="text" placeholder="Parol kiriting ..." />
                <button className=" btn btn-outline-info">Kirish</button>
            </form>
            </div>
        </>
    )
}

export default Register