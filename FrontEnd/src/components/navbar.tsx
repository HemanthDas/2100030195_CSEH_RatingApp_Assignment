import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl">
        <Link to="/admin/dashboard">Admin Panel</Link>
      </h1>
      {user && (
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 px-4 py-2 rounded cursor-pointer"
            onClick={() => navigate({ to: "/admin/addUser" })}
          >
            Add User
          </button>
          <button
            className="bg-blue-500 px-4 py-2 rounded cursor-pointer"
            onClick={() => navigate({ to: "/admin/addStore" })}
          >
            Add Store
          </button>
          <button
            className="bg-blue-500 px-4 py-2 rounded cursor-pointer"
            onClick={() => navigate({ to: "/auth/changepassword" })}
          >
            Change Password
          </button>
          <button
            className="bg-red-500 px-4 py-2 rounded cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
