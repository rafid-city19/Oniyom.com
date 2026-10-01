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

  const [loading, setLoading] =
    useState(true);

  // ========================================
  // LOAD AUTH DATA ON APP START
  // ========================================

  useEffect(() => {
    try {
      const token =
        localStorage.getItem("token");

      const savedUser =
        localStorage.getItem("user");

      if (token && savedUser) {
        const parsedUser =
          JSON.parse(savedUser);

        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Auth initialization error:",
        error
      );

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

    // New format:
    // login(data)
    if (
      typeof authData === "object" &&
      authData !== null
    ) {
      token = authData.token;
      user = authData.user;
    }

    // Old format:
    // login(token, userData)
    else {
      token = authData;
      user = userData;
    }

    if (!token || !user) {
      console.error(
        "Invalid login data:",
        authData
      );

      return;
    }

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);
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