import { HiTrash, HiPencil } from "react-icons/hi";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import {
  deleteUser,
  createUser,
  updateUser,
  searchUsersByRole,
} from "../apis/usersApi";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import AddUserForm from "../components/AddUserForm";
import EditUserForm from "../components/EditUserForm";

const roleStyles = {
  ADMIN: "bg-red-100 text-red-700",
  MANAGER: "bg-purple-100 text-purple-700",
  RECEPTIONIST: "bg-blue-100 text-blue-700",
  ACCOUNTANT: "bg-indigo-100 text-indigo-700",
};

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-md px-4 py-2 text-sm font-medium ${
      active
        ? "bg-blue-500 text-white"
        : "bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await searchUsersByRole(
          activeFilter,
          currentPage - 1,
          pageSize,
        );
        const sortedUsers = [...(data.content || [])].sort(
          (a, b) => (a.id || 0) - (b.id || 0),
        );
        setUsers(sortedUsers);
        setTotalPages(data.totalPages);
      } catch (err) {
        toast.error("Failed to fetch users!");
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, activeFilter]);

  const handleAddUser = async (newUser) => {
    try {
      setIsSubmitting(true);
      const createdUser = await createUser(newUser);
      setUsers((prevUsers) =>
        [...prevUsers, createdUser].sort((a, b) => (a.id || 0) - (b.id || 0)),
      );
      setIsModalOpen(false);
      toast.success("User added successfully!");
    } catch (err) {
      console.error("Error in handleAddUser:", err);
      toast.error(err.message || "Failed to add user!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      setIsSubmitting(true);
      const editedUser = await updateUser(editingUser.id, updatedUser);
      setUsers((prevUsers) =>
        prevUsers
          .map((user) => (user.id === editingUser.id ? editedUser : user))
          .sort((a, b) => (a.id || 0) - (b.id || 0)),
      );
      setIsEditModalOpen(false);
      setEditingUser(null);
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Error in handleEditUser:", err);
      toast.error(err.message || "Failed to update user!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const handleDeleteUser = async (id) => {
    setConfirmDeleteId(id);
  };
  const confirmDeleteUser = async () => {
    try {
      const id = confirmDeleteId;
      if (!id) return;
      await deleteUser(id);
      setUsers((prevUsers) =>
        prevUsers
          .filter((user) => user.id !== id)
          .sort((a, b) => (a.id || 0) - (b.id || 0)),
      );
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete user!");
      console.log(err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    if (activeFilter === "All") return true;
    return user.roles.includes(activeFilter);
  });

  const formatRoles = (roles) => {
    return roles.map((role) => (
      <span
        key={role}
        className={`mr-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          roleStyles[role] || "bg-gray-100 text-gray-700"
        }`}
      >
        {role}
      </span>
    ));
  };

  const PER_PAGE = 10;
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
          <p className="text-base text-gray-500">
            Manage system users and their roles.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 sm:mt-0">
          <div className="flex items-center gap-2 rounded-md bg-gray-100 p-1">
            <FilterButton
              active={activeFilter === "All"}
              onClick={() => handleFilterChange("All")}
            >
              All
            </FilterButton>
            <FilterButton
              active={activeFilter === "ADMIN"}
              onClick={() => handleFilterChange("ADMIN")}
            >
              Admin
            </FilterButton>
            <FilterButton
              active={activeFilter === "MANAGER"}
              onClick={() => handleFilterChange("MANAGER")}
            >
              Manager
            </FilterButton>
            <FilterButton
              active={activeFilter === "RECEPTIONIST"}
              onClick={() => handleFilterChange("RECEPTIONIST")}
            >
              Receptionist
            </FilterButton>
            <FilterButton
              active={activeFilter === "ACCOUNTANT"}
              onClick={() => handleFilterChange("ACCOUNTANT")}
            >
              Accountant
            </FilterButton>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  User ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Full Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Roles
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4">
                    <div className="flex h-40 items-center justify-center">
                      <Spinner />
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-lg font-semibold text-gray-400">
                        No users found with the selected filters.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">#{user.id}</div>
                    </td>
                    <td className="px-6 py-4 text-base font-medium whitespace-nowrap text-gray-900">
                      <div className="font-semibold">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-base whitespace-nowrap text-gray-800">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-4 text-base text-gray-800">
                      <div className="flex flex-wrap gap-1">
                        {formatRoles(user.roles)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(user);
                          }}
                          title="Edit user"
                        >
                          <HiPencil />
                        </button>
                        <button
                          className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.id);
                          }}
                          title="Delete user"
                        >
                          <HiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={goPrev}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={goNext}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddUserForm
          onSubmit={handleAddUser}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditUserForm
          onSubmit={handleEditUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          isSubmitting={isSubmitting}
          user={editingUser}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDeleteUser}
        title="Delete user"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variation="danger"
      />
    </>
  );
}

export default Users;
