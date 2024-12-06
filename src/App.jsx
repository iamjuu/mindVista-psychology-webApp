// App.js
import './App.css';
import UserRouter from './Routes/UserRouter'; 
import AdminRouter from './Routes/AdminRouter';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <UserRouter /> 
      
      {/* <AdminRouter/> */}
      </Router>
  );
}

export default App;
