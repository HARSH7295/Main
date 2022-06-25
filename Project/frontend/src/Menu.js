import React, { useState,useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
const Menu = () => {
    
    const [user,setUser] = useState(localStorage.getItem('userid'))
    const [orderid,setOrderId] = useState(localStorage.getItem('orderid'))
    
    const [pizzaList,setPizzaList] = useState([])
    const [count,setCount] = useState(0)

    const navigate = useNavigate()
    const getPizzas=async()=>{
        let response = await fetch('http://127.0.0.1:8000/api/getPizzas',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            }
        })
        if(response.status === 200){
            let data = await response.json()
            setPizzaList(data.list)
            getCount()
        }
    }

    const addToCart=async(temp)=>{
        let response = await fetch('http://127.0.0.1:8000/api/addToCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                'user':user,
                'orderid':orderid,
                'item':temp
            })
        })
        if(response.status === 200){
            let data = await response.json()
            getCount()
        }
        else{
            alert('Some Error Occured When Adding To Cart, Contact Developer')
        }

    }
    
    const getCount=async()=>{
        let response = await fetch('http://127.0.0.1:8000/api/getCount',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'user' : user,
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


    useEffect(() => {
        if(user === null || orderid === null){
            alert('Not logged in...,Please Login First')
            navigate('/')
        }
        else{
            
        getPizzas()
        getCount()
        }
    }, [])
  
  
    return (
    <div className='menu' id='menu'>
        <div className='menu-top'>
            <h1>Menu</h1>
            <div className='filters'>
                <a href='#veg'>Veg Pizza</a>
                <a href='#panner'>Panner Pizza</a>
                <a href='#cheezy'>Cheezy Pizza</a>
            </div>
        </div>
        <div className='menu-center'>
            <div className='list'>
                <div className='type-pizza'>
                    
                    <h2 id="veg">Veg Pizza</h2>

                    <div className='pizza-list'>
                        {pizzaList.map((item)=>{
                            if(item.pizza_type === 'Veg'){
                                return (
                                    <div className='pizza-item' key={item.id}>
                                        <img src={item.img} alt='img not found' />
                                        <h3>{item.name}</h3>
                                        <p>{item.desc}</p>
                                        <h3>₹ {item.price}</h3>
                                        <button
                                            onClick={()=>addToCart(item.name)}>ADD TO CART 
                                        </button>
                                    </div>
                                )
                            }
                        })}
                        
                    </div>
                    
                </div>
                <div className='type-pizza'>
                    
                    <h2 id="panner">Panner Pizza</h2>

                    <div className='pizza-list'>
                        {pizzaList.map((item)=>{
                            if(item.pizza_type === 'Panner'){
                                return (
                                    <div className='pizza-item' key={item.id}>
                                        <img src={item.img} alt='img not found' />
                                        <h3>{item.name}</h3>
                                        <p>{item.desc}</p>
                                        <h3>₹ {item.price}</h3>
                                        <button
                                            onClick={()=>addToCart(item.name)}>ADD TO CART 
                                        </button>
                                    </div>
                                )
                            }
                        })}
                        
                    </div>
                    
                </div>
                <div className='type-pizza'>
                    
                    <h2 id="cheezy">Cheezy Pizza</h2>

                    <div className='pizza-list'>
                        {pizzaList.map((item)=>{
                            if(item.pizza_type === 'Cheezy'){
                                return (
                                    <div className='pizza-item' key={item.id}>
                                        <img src={item.img} alt='img not found' />
                                        <h3>{item.name}</h3>
                                        <p>{item.desc}</p>
                                        <h3>₹ {item.price}</h3>
                                        <button
                                            onClick={()=>addToCart(item.name)}>ADD TO CART 
                                        </button>
                                    </div>
                                )
                            }
                        })}
                        
                    </div>
                    
                </div>
                
            </div>
            <Link to='/cart' className='cart-button'>
                <div id="round">{count}</div>
            </Link>
        </div>
    </div>
  )
}

export default Menu