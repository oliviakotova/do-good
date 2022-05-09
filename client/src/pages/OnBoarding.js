import Nav from "../components/Nav";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
//import Spinner from "../components/Spinner";

const OnBoarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies("user");

  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_identity: false,
    identity: "volunteer",
    interest: "need_volunteer",
    url: "",
    about: "",
    matches: [],
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("http://localhost:8000/user", {
        formData,
      });
      const success = response.status === 200;
      console.log(response);
      if (success) navigate("/dashboard");
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //console.log(formData);

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />

      <div
        className="card w-100
       d-flex flex-column justify-content-center align-items-center"
      >
        <form onSubmit={handleSubmit} className="onform">
          <h2 className="m-2 mb-4">CREATE ACCOUNT</h2>

          <div className="mb-3 mt-3">
            <label htmlFor="first_name" className="iconform">
              <i className="bi bi-person-fill"></i>
            </label>

            <input
              id="first_name"
              type="text"
              name="first_name"
              className="form-control w-100 "
              placeholder="First name"
              required={true}
              pattern=".{2,32}"
              title="Two or more characters, maximum 32 characters "
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <label>Birthday</label>
          <div className="input-group gap-2 mb-4">
            <input
              id="dob_day"
              type="number"
              name="dob_day"
              className="form-control w-25 m-2"
              placeholder="DD"
              required={true}
              value={formData.dob_day}
              onChange={handleChange}
            />

            <input
              id="dob_month"
              type="number"
              name="dob_month"
              className="form-control w-25 m-2"
              placeholder="MM"
              required={true}
              value={formData.dob_month}
              onChange={handleChange}
            />

            <input
              id="dob_year"
              type="number"
              name="dob_year"
              className="form-control w-25 m-2"
              placeholder="YYYY"
              required={true}
              value={formData.dob_year}
              onChange={handleChange}
            />
          </div>

          <div className="d-grid gap-2 mb-4">
            <label>You woud like to help or you need help:</label>

            <div className="form-check">
              <input
                id="volunteer-identity"
                type="radio"
                className="form-check-input"
                name="identity"
                value="volunteer"
                onChange={handleChange}
                checked={formData.identity === "volunteer"}
              />
              I would like to be Volunteer
              <label
                className="form-check-label"
                htmlFor="volunteer-identity"
              ></label>
            </div>

            <div className="form-check">
              <input
                id="need-volunteer-identity"
                type="radio"
                className="form-check-input"
                name="identity"
                value="need_volunteer"
                onChange={handleChange}
                checked={formData.identity === "need_volunteer"}
              />
              Need Volunteer
              <label
                className="form-check-label"
                htmlFor="need-volunteer-identity"
              ></label>
            </div>
          </div>

          {/* <div className="form-check mb-5">
            <label htmlFor="show_identity" className="form-check-label">
              <input
                id="show_identity"
                type="checkbox"
                name="show_identity"
                className="form-check-input"
                onChange={handleChange}
                checked={formData.show_identity}
              />
              Show identity on my profile
            </label>
          </div> */}

          <div className="d-grid gap-2 mb-4">
            <label>Chose Interests:</label>

            <div className="form-check">
              <input
                id="volunteer-interest"
                type="radio"
                name="interest"
                className="form-check-input"
                value="volunteer"
                onChange={handleChange}
                checked={formData.interest === "volunteer"}
              />
              Volunteer
              <label
                className="form-check-label"
                htmlFor="volunteer-interest"
              ></label>
            </div>

            <div className="form-check ">
              <input
                id="need-volunteer-interest"
                type="radio"
                className="form-check-input"
                name="interest"
                value="need_volunteer"
                onChange={handleChange}
                checked={formData.interest === "need_volunteer"}
              />
              Need Volunteer
              <label
                className="form-check-label"
                htmlFor="need-volunteer-interest"
              ></label>
            </div>
          </div>

          <div className="d-grid mb-4 ">
            <label htmlFor="about">
              How I can help/What tipe of help I need
            </label>
            <div className="form-floating">
              <textarea
                className="form-control"
                id="about"
                type="text"
                name="about"
                required={true}
                placeholder="I would like to support people..."
                value={formData.about}
                onChange={handleChange}
              ></textarea>
              <label htmlFor="about">I would like...</label>
            </div>
          </div>

          <div className="d-grid mb-5 ">
            <label htmlFor="url">Profile Photo</label>
            <input
              type="url"
              name="url"
              className="form-control w-100"
              id="url"
              onChange={handleChange}
              required={true}
              placeholder="https://..."
            />
          </div>
          <div className="container">
            {formData.url && (
              <img
                className="img-responsive"
                src={formData.url}
                alt="profile pic preview"
                width="80%"
              />
            )}
          </div>

          <input className="btn btn-primary m-2" type="submit" />
        </form>
      </div>
    </>
  );
};

export default OnBoarding;
