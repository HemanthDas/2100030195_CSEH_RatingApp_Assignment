import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetcher } from "../../utils/api";

export const Route = createFileRoute("/admin/addStore")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
    createNewOwner: false,
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const { data: users } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["users"],
    queryFn: () => fetcher("/admin/users?role=store_owner"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setForm({ ...form, createNewOwner: !form.createNewOwner, ownerId: "" });
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
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Store Name", name: "name", type: "text" },
          { label: "Store Email", name: "email", type: "email" },
          { label: "Store Address", name: "address", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor={name}>
              {label}
            </label>
            <input
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={type}
              name={name}
              id={name}
              placeholder={label}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {!form.createNewOwner && (
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="ownerId">Store Owner</label>
            <select
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="ownerId"
              id="ownerId"
              onChange={handleChange}
              disabled={form.createNewOwner}
              required={!form.createNewOwner}
            >
              <option value="">Select Owner</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="createNewOwner"
            checked={form.createNewOwner}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="createNewOwner" className="font-medium">
            Create New Store Owner
          </label>
        </div>

        {/* New Owner Fields */}
        {form.createNewOwner && (
          <>
            {[
              { label: "Owner Name", name: "ownerName", type: "text" },
              { label: "Owner Email", name: "ownerEmail", type: "email" },
              {
                label: "Owner Password",
                name: "ownerPassword",
                type: "password",
              },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor={name}>
                  {label}
                </label>
                <input
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type={type}
                  name={name}
                  autoComplete="off"
                  id={name}
                  placeholder={label}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </>
        )}

        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Add Store
        </button>
      </form>
    </div>
  );
}
