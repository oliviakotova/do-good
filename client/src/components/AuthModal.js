import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Help from "./Help";
import Spinner from "../components/Spinner";
import Utils from "../Utilities";

let API_URL = Utils.API_URL;

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);

  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [setCookie] = useCookies("user");
  //const [togle, setTogle] = useState("false");
  const [showLoading, setShowLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  let navigate = useNavigate();

  console.log(email, password, confirmPassword);

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords need to match.");
        return;
      }

      //make a post request to our database with axios
      console.log("posting", email, password);

      // start showing loading spinner
      setShowLoading(true);
      const response = await axios.post(
        `${API_URL}/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );
      // stop showing the loading spinner
      setShowLoading(false);

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);

      //if email and password right
      const success = response.status === 201;

      //then when singin will load with navigate (react-router-dom) onboarding page
      if (success && isSignUp) navigate("/onboarding");

      if (success && !isSignUp) navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };
  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        X
      </div>

      <h2 className="m-4">{isSignUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>

      <form
        onSubmit={handleSubmit}
        className="w-100 d-flex flex-column justify-content-center align-items-center"
      >
        <div className="form-group">
          <label htmlFor="email" className="loginform">
            <i className="bi bi-envelope-fill"></i>
          </label>
          <input
            type="email"
            autoComplete="email"
            id="email"
            className="form-control w-75 m-4"
            name="email"
            placeholder="your email"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="loginform">
            <i className="bi bi-lock-fill"></i>
          </label>
          <input
            type="password"
            id="password"
            autoComplete="password"
            className="form-control w-75 m-4"
            name="password"
            placeholder="password"
            required={true}
            pattern=".{8,}"
            title="Eight or more characters"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isSignUp && (
          <div className="form-group">
            <label htmlFor="password-check" className="loginform">
              <i className="bi bi-lock-fill"></i>
            </label>
            <input
              type="password"
              id="password-check"
              autoComplete="password-check"
              className="form-control w-75 m-4"
              name="password-check"
              placeholder="confirm password"
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}
        <input className="btn btn-primary m-4" type="submit" />
        <p>{error}</p>
        <div className="info-icon2" onClick={togglePopup}>
          <i className="bi bi-question-circle"></i>
          <p>Need help?</p>
        </div>
        {isOpen && (
          <Help
            content={
              <>
                <h2 className="m-4">Helping information for LOG IN </h2>
                <p>
                  Please fill up the form completely including your email,
                  create and remember your password. The password has to contain
                  at least one uppercase letter, one number, one lowercase
                  letter and has to be eight character long minimum. Please
                  contact us if you have any issue.
                </p>
              </>
            }
            handleClose={togglePopup}
          />
        )}
        {showLoading ? <Spinner /> : <></>}
      </form>
    </div>
  );
};

export default AuthModal;
