import React, { useEffect } from "react";
import firebase from "../../firebase/index";

function useAuth() {
  const [authUser, setauthUser] = React.useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        setauthUser(user);
      } else {
        setauthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return authUser;
}

export default useAuth;
