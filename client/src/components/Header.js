import React from "react";

function Header({ SwitchTheme }) {
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
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                onChange={SwitchTheme}
              ></input>
              <label class="form-check-label" for="flexSwitchCheckDefault">
                Light / Dark mode
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
