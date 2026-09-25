import { useNavigate } from "react-router-dom";

function LogoutButton({ className = "" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Go to login
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className}
    >
      Logout
    </button>
  );
}

export default LogoutButton;