import Nav from "../components/Nav";
import AuthModal from "../components/AuthModal";
import { useState } from "react";
import { useCookies } from "react-cookie";
//import Spinner from "../components/Spinner";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies("user");

  const authToken = cookies.AuthToken;

  const handleClick = () => {
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    //console.log('clicked')
    setShowModal(true);
    setIsSignUp(true);
  };

  return (
    <div className="overlay">
      <Nav
        authToken={authToken}
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <div className="d-grid gap-2 col-6 mx-auto">
          <h1 className="primary-title">GIVE A LITTLE. CHANGE A LOT.</h1>
          <button className="btn btn-primary btn-lg" onClick={handleClick}>
            {authToken ? "Signout" : "Create Account"}
          </button>

          {showModal && (
            <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
