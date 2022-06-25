import {React,useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const WelcomePage = () => {
    
    const [signupActive,setSignupActive] = useState(true)

    const [signupEmail,setSignupEmail] = useState('')
    const [signupPassword,setSignupUserPassword] = useState('')
    const [signupRePassword,setSignupUserRePassword] = useState('')


    const [loginEmail,setLoginEmail] = useState('')
    const [loginPassword,setLoginPassword] = useState('')
    
    const [showAlert,setShowAlert] = useState(false)
    const [alertText,setAlertText] = useState('')

    let navigate = useNavigate();

    const handleLoginSubmit=async(e)=>{
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email_id : loginEmail,
                password : loginPassword
            })
        })
        if (response.status === 200){
            alert('Login Successful')
            let data = await response.json()
            localStorage.setItem('userid',data.user.email)
            localStorage.setItem('orderid',data.orderid)
            navigate('/home')
        }
        else if(response.status === 401){
            setShowAlert(true)
            setAlertText('Invalid Credentials')
            setLoginPassword('')
            setLoginEmail('')
        }
        else{
            alert('Some Error Occured At Backend, Contact Developer')
        }

    }
    const handleSignupSubmit=async(e)=>{
        e.preventDefault()
        if(signupRePassword === signupPassword){
           let response = await fetch('http://127.0.0.1:8000/api/signup',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    email_id : signupEmail,
                    password : signupPassword,
                })
            })
            if(response.status === 200){
                alert('Registration of user successfull')
                let data = await response.json()
                setSignupActive(false)
            }
            else if(response.status === 226){
                alert('Email already used')
            }
            else{
                alert('Some Error Occured At Backend, Contact Developer')
            }
        }
        
        else{
            setShowAlert(true)
            setAlertText("Passwords don't match. Enter password again")
            setSignupUserPassword('')
            setSignupUserRePassword('')
        }
        
    }
    useEffect(()=>{
        setTimeout(()=>{
            setShowAlert(false)
            setAlertText('')
        },3000)
    },[showAlert])

  return (
    <div className='welcome-page'>
          <div id='showcase'>
            <img src='IMAGES/logo.png' alt='Pizza Place' />
          </div>
        <div className="form-wrap container" id='content'>
            <div className="tabs">
                <h3 className="signup-tab"><p className={`${signupActive?'active':''}`} onClick={()=>setSignupActive(!signupActive)}>Sign Up</p></h3>
                <h3 className="login-tab"><p className={`${signupActive?'':'active'}`} onClick={()=>setSignupActive(!signupActive)}>Login</p></h3>
            </div>
            <div className="tabs-content">
                {showAlert && <h2 className='alert'>{alertText}</h2>}
                <div id="signup-tab-content" className={`${signupActive?'active':''}`}>
                    <form className="signup-form" onSubmit={handleSignupSubmit}>
                        <input 
                            type="email" 
                            className="input" 
                            id="signupEmail"  
                            placeholder="Email"
                            name='userEmail' 
                            value={signupEmail}
                            required
                            onChange={(e)=>setSignupEmail(e.target.value)}
                        />
                        <input 
                            type="password" 
                            className="input" 
                            id="signupPass"  
                            placeholder="Password" 
                            name='userPassword'
                            value={signupPassword}
                            required
                            onChange={(e)=>setSignupUserPassword(e.target.value)}
                        />
                        <input 
                            type="password" 
                            className="input" 
                            id="signupRePass"  
                            placeholder="Enter Password again" 
                            name='userRePassword'
                            value={signupRePassword}
                            required
                            onChange={(e)=>setSignupUserRePassword(e.target.value)}
                        />
                        <button type="submit" className="button">Signup</button>
                    </form>
                    <div className="help-text">
                        <p>By signing up, you agree to our Terms of service</p>
                    </div>
                </div>
                <div id="login-tab-content" className={`${signupActive?'':'active'}`}>
                    <form className="login-form" onSubmit={handleLoginSubmit}>
                        <input 
                            type="email" 
                            className="input" 
                            id="loginName"  
                            placeholder="Email Id" 
                            name='userName'
                            value={loginEmail}
                            required
                            onChange={(e)=>setLoginEmail(e.target.value)}
                        />
                        <input 
                            type="password" 
                            className="input" 
                            id="loginPass"  
                            placeholder="Password" 
                            name='userPassword'
                            value={loginPassword}
                            required
                            onChange={(e)=>setLoginPassword(e.target.value)}
                        />
                        <button type="submit" className="button">Login</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
  )
}

export default WelcomePage