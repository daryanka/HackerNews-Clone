import React from "react";
import { FirebaseContext } from "../../firebase";

function ForgotPassword() {
  const [resetPasswordEmail, setResetPasswordEmail] = React.useState("");
  const [isPasswordReset, setPasswordReset] = React.useState(false);
  const { firebase } = React.useContext(FirebaseContext);
  const [passwordResetError, setPasswordResetError] = React.useState(null);

  async function handleResetPassword() {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setPasswordReset(true);
      setPasswordResetError(null);
    } catch (err) {
      console.log(err);
      setPasswordReset(false);
      setPasswordResetError(err.message);
    }
  }

  return (
    <div>
      <input
        type="email"
        className="input"
        placeholder="Provide your account email"
        onChange={event => setResetPasswordEmail(event.target.value)}
      />
      <div>
        <button className="button" onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
      {isPasswordReset && <p>Check email to reset password</p>}
      {passwordResetError && <p className="error-text">{passwordResetError}</p>}
    </div>
  );
}

export default ForgotPassword;
