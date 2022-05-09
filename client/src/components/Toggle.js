import React from "react";

function Toggle({ SwitchTheme }) {
  return (
    <div className="container-fluid">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          onChange={SwitchTheme}
        ></input>
        {/* <label class="form-check-label" for="flexSwitchCheckDefault">
          Light / Dark mode
        </label> */}
      </div>
    </div>
  );
}

export default Toggle;
