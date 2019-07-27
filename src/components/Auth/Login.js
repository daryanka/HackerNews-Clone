import React, { useState } from "react";
import useFormValidation from "./useFormValidation";
import validateLogin from "./validateLogin";
import firebase from "../../firebase/index";
import { Link } from "react-router-dom";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
};

function Login(props) {
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    isSubmiting
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);

  const [login, setLogin] = useState(true);
  //
  const [firebaseError, setFirebaseError] = useState(null);
  //
  let title = null;
  let buttonText = null;

  if (login) {
    title = "Login";
    buttonText = "Need to create an account?";
  } else {
    title = "Register";
    buttonText = "Already have an account?";
  }

  async function authenticateUser() {
    const { name, email, password } = values;

    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      props.history.push("/");
    } catch (err) {
      console.error("Authentication Error: ", err);
      setFirebaseError(err.message);
    }
  }

  return (
    <div>
      <h2 className="mv3">{title}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column ">
        {!login && (
          <input
            value={values.name}
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            placeholder="Your Name"
            className={errors.name && "error-input"}
          />
        )}
        <input
          className={errors.email && "error-input"}
          value={values.email}
          onBlur={handleBlur}
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Your Email"
        />
        {errors.email && <p className="error=text">{errors.email}</p>}
        <input
          className={errors.password && "error-input"}
          value={values.password}
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          type="password"
          placeholder="Choose a password"
          autoComplete="off"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button
            disabled={isSubmiting}
            style={{ background: isSubmiting ? "grey" : "orange" }}
            type="submit"
            className="button poitner mr2"
          >
            Submit
          </button>
          <button
            type="button"
            className="pointer button"
            onClick={() => setLogin(prevLogin => !prevLogin)}
          >
            {buttonText}
          </button>
        </div>
        <div className="forgot-password">
          <Link to="/forgot">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
