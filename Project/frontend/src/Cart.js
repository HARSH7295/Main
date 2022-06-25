import React,{useState,useEffect} from 'react'
import Navbar from './Navbar'
import {Link,useNavigate} from 'react-router-dom'
import arrowUp from './IMAGES/arrow-up.png'
import arrowDown from './IMAGES/arrow-down.png'
import temp from './IMAGES/temp.jpg'
const Cart = () => {

  let navigate = useNavigate()

  const [user,setUser] = useState(localStorage.getItem('userid'))
  const [orderid,setOrderId] = useState(localStorage.getItem('orderid'))

  const [list,setList] = useState([])
  const [pizzas,setPizzas] = useState([])
  const [count,setCount] = useState(0)
  const [total,setTotal] = useState(0)

  const getCart=async()=>{
    let response = await fetch('http://127.0.0.1:8000/api/getCartDetails',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        'user' : user,
        'orderid':orderid
      })
    })

    if(!(response.ok)){
      alert('Error getting data')
    }

    let data = await response.json()
    setList(data.list)
    setPizzas(data.pizzas)
    setCount(data.num_of_items)
    setTotal(data.total_amount)
  }

  useEffect(()=>{
    
    if(user === null || orderid === null){
      
      alert('Not logged in.., Please Login First')
      navigate('/')
    }
    else{
      getCart()
    }
    
  },[])

  const handleIncreaseCount=async(itemname)=>{
    let response = await fetch('http://127.0.0.1:8000/api/addToCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                'user':user,
                'orderid':orderid,
                'item':itemname
            })
        })
        if(response.status === 200){
            let data = await response.json()
        }
        else{
            alert('Some Error Occured When Adding To Cart, Contact Developer')
        }

        getCart()
  }
  const handleDecreaseCount=async(itemname)=>{
    let response = await fetch('http://127.0.0.1:8000/api/removeFromCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                'user':user,
                'orderid':orderid,
                'item':itemname
            })
        })
        if(response.status === 200){
            let data = await response.json()
        }
        else{
            alert('Some Error Occured When Removing From Cart, Contact Developer')
        }

        getCart()
  }
  return (
    <div className='cart-page'>
      <Navbar count={count}/>
      <div className="cartrow">
          <div className="elembox">
            <Link to='/home' className="continue-shop">&#x2190; Back to Menu</Link>
            <br />
            <br />
            <table className="table">
              <thead>
              <tr>
                  <th><h5>Items: <strong>{count}</strong></h5></th>
                  <th><h5>Total:<strong> ₹ {total}</strong></h5></th>
                  <th>
                      <Link to='/checkout' className="btn btn-success">Checkout</Link>
                  </th>
              </tr>
              </thead>
            </table>
          </div>
          <br />
          <div className="cart-items">
          <div className="cart-row">
              <div className='flex-cont'><strong>Image</strong></div>
              <div className='flex-cont'><strong>Item</strong></div>
              <div className='flex-cont'><strong>Price</strong></div>
              <div className='flex-cont'><strong>Quantity</strong></div>
              <div className='flex-cont'><strong>Total</strong></div>
            </div>
            {list.map((item)=>{
              let data;
              for(let i=0;i<pizzas.length;i++){
                if(pizzas[i].id === item.pizza)
                {
                  data = pizzas[i]
                }
              }
              return ( 
                <div className="cart-items-list" key={item.id}>
                  <div className='cart-item-img'><img src={data.img} alt='cant load' /></div>
                    <div className='cart-item-text'><p>{data.name}</p></div>
                    <div className='cart-item-price'><p>₹ {data.price}</p></div>
                    <div className='cart-item-quantity'>
                      <p>{item.quantity}</p>
                      <div className="cart-item-quantity-btn">
                        <img className="chg-quantity update-cart" onClick={()=>handleIncreaseCount(data.name)} src={arrowUp} alt='+'/>
                        <img className="chg-quantity update-cart" onClick={()=>handleDecreaseCount(data.name)} src={arrowDown} alt='-'/>
                      </div>
                    </div>
                  <div className='cart-item-total'><p>${(item.quantity)*(data.price)}</p></div>
                </div>
              );
            })}
            
          </div>
            
        </div>
    </div>
  )
}

export default Cart