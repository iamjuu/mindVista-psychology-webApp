import { Container, ContainerWrap, BgContainer } from "../../Style";
import { Main } from "./style";
import { Data } from "../../../../constant/datas";
import { Bgimg } from "../../../../assets";
import Regbtn from "../../../../components/core/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BgSection = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Token found:", token);
      navigate("/register");
    } else {
      console.log("No token found. Navigating to login.");
      navigate("/login");
    }
  };

  return (
    <Container>
      <BgContainer bg={Bgimg}>
        <ContainerWrap>
          <Main>
            <p>{Data.title}</p>

            <div className="flex gap-5">
              <button
                onClick={handleRegister}
                className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register
              </button>

              <Link to="/login">
                <button className="px-8 py-3 bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:bg-amber-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                  Login
                </button>
              </Link>
            </div>
          </Main>
        </ContainerWrap>
      </BgContainer>
    </Container>
  );
};

export default BgSection;