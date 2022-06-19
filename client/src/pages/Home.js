import Nav from "../components/Nav";
import AuthModal from "../components/AuthModal";
import { useState } from "react";
import { useCookies } from "react-cookie";
//import Spinner from "../components/Spinner";
import Help from "../components/Help";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

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
          <div className="info-icon" onClick={togglePopup}>
            <i className="bi bi-question-circle"></i>
            <p>Need help?</p>
          </div>

          {showModal && (
            <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
          )}
          {isOpen && (
            <Help
              content={
                <>
                  <h2 className="m-4">
                    Helping information for CREATE ACCOUNT{" "}
                  </h2>
                  <p>
                    Please fill up the form completely including your email,
                    create and remember your password. The password has to
                    contain at least one uppercase letter, one number, one
                    lowercase letter and has to be eight character long minimum.
                  </p>
                </>
              }
              handleClose={togglePopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
