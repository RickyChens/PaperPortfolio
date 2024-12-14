import React, {useContext, useState} from 'react'
import './Login.css'
import { Context } from '../../context/context'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const {setIsLogin} = useContext(Context)
  const {setLoggedIn} = useContext(Context)
  const [tempData, setTempData] = useState({
    user: '',
    password: '',
  })
  const {setData} = useContext(Context)

  const loginUser = async (e) => {
    e.preventDefault()
    const {user, password} = tempData
    console.log(user)
    try {
      const {data} = await axios.post('./login', {
        user, 
        password
      })
      if (data.error) {
        toast.error(data.error)
      } else {
        setLoggedIn(true)
        setData(data)
        setTempData({})
        navigate('/stocks')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="wrapper">
        <div class="login">
            <h1>Login</h1>
            <form onSubmit={loginUser}>
                <div class="input-box">
                    <input type="text" placeholder="Username" required value={tempData.user} onChange={(e) => setTempData({...tempData, user: e.target.value})}/>
                    <i class='bx bx-user'></i>
                </div>
                <div class="input-box">
                    <input type="password" placeholder="Password" required value={tempData.password} onChange={(e) => setTempData({...tempData, password: e.target.value})}/>
                    <i class='bx bx-lock-alt' ></i>
                </div>
                <div class="remember-forgot">
                    <label><input type="checkbox"/> <span>Remember Me</span></label>
                    <a href="#">Forgot Password</a>
                </div>
                <div className="login-btn"><button type="submit" class="login-btn">Login</button></div>
            </form>
            <div class="register">
                <p>Don't have an account? <a onClick={()=>setIsLogin(prev=>!prev)} href="#">Register</a></p>
            </div>
        </div>  
    </div>
  )
}

export default Login