
import UserRouter from "./Routers/UserRouter";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import { MainBackgroundImage } from "./assets";

const App = () => {
  return (
    <div
    style={{
      backgroundImage: `url(${MainBackgroundImage})`,
      backgroundPosition: "top center",
      backgroundSize: "100% auto",
      backgroundRepeat: "repeat-y",
    }}
    >
      <UserRouter/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;

