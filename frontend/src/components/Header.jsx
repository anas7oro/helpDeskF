import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import logo from './logo.png';

function Header({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const color_ballet = useSelector(
    (state) =>
      state.branding.activeBranding &&
      state.branding.activeBranding.color_ballet
  );

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
    <Link to="/dashboard">
    <img src={logo} alt="Logo" style={{ height: '150%', maxHeight: '100px' }} />
        </Link>
</div>
      <ul>
        {user ? (
          <>
            {children}
            <li>
              <Link
                to="/profile"
                style={{
                  color: color_ballet ? color_ballet[0] : "defaultColor",
                }}
              >
                profile
              </Link>
            </li>
            <li>
              <button
                className="btn"
                onClick={onLogout}
                style={{
                  backgroundColor: color_ballet
                    ? color_ballet[1]
                    : "defaultColor",
                }}
              >
                logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                style={{
                  color: color_ballet ? color_ballet[0] : "defaultColor",
                }}
              >
                login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                style={{
                  color: color_ballet ? color_ballet[0] : "defaultColor",
                }}
              >
                register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
