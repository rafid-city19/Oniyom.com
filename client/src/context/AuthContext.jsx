import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// ========================================
// CREATE CONTEXT
// ========================================

const AuthContext = createContext(null);

// ========================================
// AUTH PROVIDER
// ========================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ========================================
  // LOAD AUTH DATA ON APP START
  // ========================================

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // Check whether valid auth data exists
      if (
        token &&
        savedUser &&
        savedUser !== "undefined" &&
        savedUser !== "null"
      ) {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else {
        // Remove invalid/old authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      }
    } catch (error) {
      console.error(
        "Auth initialization error:",
        error
      );

      // Clear corrupted authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // LOGIN
  // ========================================

  const login = (authData, userData) => {
    let token;
    let user;

    // ========================================
    // NEW FORMAT
    // login(data)
    // ========================================

    if (
      typeof authData === "object" &&
      authData !== null
    ) {
      token = authData.token;
      user = authData.user;
    }

    // ========================================
    // OLD FORMAT
    // login(token, userData)
    // ========================================

    else {
      token = authData;
      user = userData;
    }

    // ========================================
    // VALIDATE LOGIN DATA
    // ========================================

    if (!token || !user) {
      console.error(
        "Invalid login data:",
        authData
      );

      return false;
    }

    // ========================================
    // SAVE AUTH DATA
    // ========================================

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // ========================================
    // UPDATE AUTH STATE
    // ========================================

    setUser(user);

    return true;
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ========================================
  // AUTH CONTEXT VALUE
  // ========================================

  const value = {
    user,
    loading,
    login,
    logout,
  };

  // ========================================
  // PROVIDER
  // ========================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ========================================
// USE AUTH HOOK
// ========================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}