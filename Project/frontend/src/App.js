import HomePage from './Home';
import WelcomePage from './WelcomePage';
import Cart from './Cart';
import {React} from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Checkout from './Checkout';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/home' element={<HomePage />} />
          <Route exact path='/cart' element={<Cart />} />
          <Route exact path='/checkout' element={<Checkout />} />
          <Route exact path='' element={<WelcomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
