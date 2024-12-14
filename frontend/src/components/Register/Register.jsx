import React, { useContext, useState } from 'react'
import './Register.css'
import { Context } from '../../context/context'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const {setIsLogin} = useContext(Context)
  const [data, setData] = useState({
    user: '',
    email: '',
    password: '',
  })


  const registerUser = async (e) => {
    e.preventDefault()
    const {user, email, password} = data
    try {
      const {data} = await axios.post('/register', {
        user, email, password
      })
      
      if (data.error) {
        toast.error(data.error)
      } else {
        setData({})
        toast.success('Login Successful!')
        navigate('/stocks')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
        <div class="wrapper">
            <div class="register-box">
                <h1>Register</h1>
                <form onSubmit={registerUser}>
                    <div class="input-box">
                        <input type="text" placeholder="Username" required value={data.user} onChange={(e) => setData({...data, user: e.target.value})}/>
                        <i class='bx bx-user'></i>
                    </div>
                    <div class="input-box">
                        <input type="text" placeholder="Email" required value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                        <i class='bx bx-lock-alt' ></i>
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="Password" required value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                        <i class='bx bx-lock-alt' ></i>
                    </div>
                    <button type="submit" class="login-btn">Register</button>
                </form>
                <div class="register">
                    <p>Have an account? <a onClick={()=>setIsLogin(prev=>!prev)} href="#">Login</a></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register