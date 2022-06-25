import React, { useState,useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate, Link} from 'react-router-dom';
const Navbar=()=>{
    const navsRef = useRef(null);
    const [usermail,setUserMail] = useState(localStorage.getItem('userid'))
    const [orderid,setOrderId] = useState(localStorage.getItem('orderid'))

    const [user,setUser] = useState()
    const [count,setCount] = useState(0)
    const [list,setList] = useState([])
    let navigate = useNavigate()

    useEffect(() => {
        if(usermail === null || orderid === null){
            navigate('/')
        }
        else{
            setUser(usermail.split('@')[0])
            getCount()
            getCart()
        }
        
    }, [])

    const handleLogout=()=>{
        localStorage.removeItem('userid')
        localStorage.removeItem('orderid')
        navigate('/')
    }
    const getCart=async()=>{
        let response = await fetch('http://127.0.0.1:8000/api/getCartDetails',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            'user' : usermail,
            'orderid':orderid
          })
        })
    
        if(!(response.ok)){
          alert('Error getting data')
        }
    
        let data = await response.json()
        setList(data.list)
        getCount()
      }
    
    const getCount=async()=>{
        let response = await fetch('http://127.0.0.1:8000/api/getCount',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'user' : usermail,
                'orderid':orderid
            })
        })
        if(response.status === 200 ){
            let data = await response.json()
            setCount(parseInt(data.count))
            
        }
        else{
            alert('Error in getting number of items in cart')
        }
    }

    

    return (
        <div className='navbar'>
            <Link to='/home' className='nav-col-1'>
                <img src="IMAGES/logo.png" />
            </Link>
            <div className='toggle-btn'>
                <img src="IMAGES/menu-btn-green.png" onClick={()=>{
                    
                    const navs = navsRef.current;
                    if(navs.className === "nav-col-2"){    
                        navs.className = "show-cont";
                    }
                    else{    
                        navs.className = "nav-col-2";
                    }
                }
                }/>
            </div>
            <div className='nav-col-2' id="navs" ref={navsRef}>
                    
                    <Link to='/home' className='nav-tab'>
                        Home
                    </Link>
                    <div onClick={handleLogout} className='nav-tab'>
                        Logout
                    </div>
                    <a href='#contact' className='nav-tab'>
                        Contact Us
                    </a>
                    <div className='user-tag'>
                        Hello, {user}
                    </div>
                    <Link to='/cart' className='cart-cont'>
                        <div className='round'>{count}</div>
                    </Link>
            </div>
        </div>

        );
}

export default Navbar