import React,{useState,useEffect} from 'react'
import Navbar from './Navbar'
import temp from './IMAGES/temp.jpg'
import {Link,useNavigate} from 'react-router-dom'
import StripeCheckout from "react-stripe-checkout";


const Checkout = () => {
  let navigate = useNavigate()

  const [user,setUser] = useState(localStorage.getItem('userid'))
  const [orderid,setOrderId] = useState(localStorage.getItem('orderid'))


  const [list,setList] = useState([])
  const [pizzas,setPizzas] = useState([])
  const [count,setCount] = useState(0)
  const [total,setTotal] = useState(0)

  const [billingName,setBillingName] = useState('')
  const [billingEmail,setBillingEmail] = useState('')
  const [billingAddress,setBillingAddress] = useState('')
  const [billingCity,setBillingCity] = useState('')
  const [billingState,setBillingState] = useState('')
  const [billingZipcode,setBillingZipcode] = useState('')
  
  const [product,setProduct] = useState({
    name:'Pizza Payment',
    price : total,
    description : 'Pizza Payment'
  })

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

  const handleSubmit=async()=>{

    /*let response = await fetch('/api/processOrder',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        userName:user,
        email : billingEmail,
        address : billingAddress,
        city : billingCity,
        state : billingState,
        zipcode : billingZipcode
      })
    })
    if(!(response.ok)){
      alert('Error in Transaction')
    }
    else{
     alert('Transaction successful')
     alert('Thanks for purchasing......')
     alert('loging out')
     localStorage.removeItem('userName')
     navigate('/')

    }*/
    alert('Transaction Successful !!!')
    navigate('/home')
  }
  const handleToken=async(token, addresses)=>{
    const response = await fetch("https://ry7v05l6on.sse.codesandbox.io/checkout",{
      method :'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        token, product
      })
    })
    if(response.status === 200){
      alert('Transaction Successful !!!')
      navigate('/home')
    }
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
  return (
    <div className='checkout-page'>
      <Navbar count={count}/>
      <div className="checkout-main">
        <div className="col-lg-6">
          <div className="box-element" id="form-wrapper">
            <form id="form">
              <div id="user-info">
                <div className="form-field">
                    <input 
                        required 
                        className="form-control" 
                        type="text" 
                        name="name" 
                        placeholder="Name.." 
                        value={billingName}
                        onChange={(e)=>setBillingName(e.target.value)}/>
                </div>
                <div className="form-field">
                    <input 
                        required 
                        className="form-control" 
                        type="email" 
                        name="email" 
                        placeholder="Email.."
                        value={billingEmail}
                        onChange={(e)=>setBillingEmail(e.target.value)}/>
                </div>
              </div>
          
              <div id="shipping-info">
                <hr />
                <p>Shipping Information:</p>
                <hr />
                <div className="form-field">
                    <input 
                        className="form-control" 
                        type="text" 
                        name="address" 
                        placeholder="Address.."
                        value={billingAddress}
                        onChange={(e)=>setBillingAddress(e.target.value)} />
                </div>
                <div className="form-field">
                    <input 
                        className="form-control" 
                        type="text" 
                        name="city" 
                        placeholder="City.." 
                        value={billingCity}
                        onChange={(e)=>setBillingCity(e.target.value)}/>
                </div>
                <div className="form-field">
                    <input 
                        className="form-control" 
                        type="text" 
                        name="state"
                        placeholder="State.." 
                        value={billingState}
                        onChange={(e)=>setBillingState(e.target.value)}/>
                </div>
                <div className="form-field">
                    <input 
                        className="form-control" 
                        type="text" name="zipcode" 
                        placeholder="Zip code.."
                        value={billingZipcode}
                        onChange={(e)=>setBillingZipcode(e.target.value)} />
                </div>
              </div>
              <hr />
              
              <button
                  id="form-button" 
                  className="btn btn-success btn-block" 
                  type="button"
                  onClick={handleSubmit}> 
                  Submit</button>
            </form>
          </div>
          <br />
          <div className="box-element" id="payment-info">
            <small>Stripe Payment</small>
            <StripeCheckout
              stripeKey="pk_test_51LE50GSA79ZSdU4GapyPVvtNNs1lSCdwnrTu5AGlCidq8VpMSM5jNqWIs3YSqZjw4a1zR0Tt17TKGgXGzjhOFEmk00H4fzwQ0W"
              token={handleToken}
              amount={product.price}
              name="Pizza Payment"
              className='stripe-btn'
              billingAddress
              shippingAddress
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="box-element">
            <Link  className="btn btn-outline-dark" to='/cart'>&#x2190; Back to Cart</Link>
            <hr />
            <h3>Order Summary</h3>
            <hr />
            {list.map((item)=>{
              let data;
              for(let i=0;i<pizzas.length;i++){
                if(pizzas[i].id === item.pizza)
                {
                  data = pizzas[i]
                }
              }
              return (
                <div className="checkout-cart-row" key={item.id}>
                  <div className='checkout-cart-img'><img src={data.img} alt='cant load'/></div>
                  <div className='checkout-cart-text'><p>{data.name}</p></div>
                  <div className='checkout-cart-price'><p>₹ {data.price}</p></div>
                  <div className='checkout-cart-quant'><p>{item.quantity}</p></div>
              </div>
              );
            })}
            <h5 className='checkout-cart-btm' >Items: <p>{count}</p></h5>
            <h5 className='checkout-cart-btm'>Total:<p> ₹ {total}</p></h5>
          </div>
        </div>
    </div>
    </div>
  )
}

export default Checkout