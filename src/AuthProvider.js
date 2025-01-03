import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "./config/firebase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("userObj") || "");
  const navigate = useNavigate();
  const loginAction = async (email, password) => {
    try {
      const response = await handleLogin(email, password);
      if (response) {
        setUser(response);
        localStorage.setItem("userObj", JSON.stringify(response));
        console.log(response);
        navigate("/dashboard");
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    /*setUser(null);
    setToken("");
    localStorage.removeItem("site");*/
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  if(localStorage.getItem("userObj") != null) {
    return useContext(AuthContext);
  }
  else {
    const context = useContext(AuthContext);
    console.log("user is not signed in");
    return { user: null, loginAction: context.loginAction, logOut: context.logOut };
  }
};
