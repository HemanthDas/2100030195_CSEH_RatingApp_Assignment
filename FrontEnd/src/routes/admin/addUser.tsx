import { createFileRoute } from "@tanstack/react-router";
import { fetcher } from "../../utils/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/admin/addUser")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("User added successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh user list
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user.");
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-100">
      <h2 className="text-lg font-bold">Add New User</h2>
      <form onSubmit={handleSubmit} className="flex gap-4 mt-2">
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />
        <select className="input" name="role" onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Add User
        </button>
      </form>
    </div>
  );
}
