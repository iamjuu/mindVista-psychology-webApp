// App.js
import './App.css';
import UserRouter from './Routes/UserRouter'; 
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router

function App() {
  return (
    <Router>
      <UserRouter /> 
    </Router>
  );
}

export default App;
