import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetcher } from "../../utils/api";

export const Route = createFileRoute("/admin/addStore")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher("/stores", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Store added successfully!");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add store.");
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-100">
      <h2 className="text-lg font-bold">Add New Store</h2>
      <form onSubmit={handleSubmit} className="flex gap-4 mt-2">
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Store Name"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Store Email"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="text"
          name="address"
          placeholder="Store Address"
          onChange={handleChange}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Store
        </button>
      </form>
    </div>
  );
}
