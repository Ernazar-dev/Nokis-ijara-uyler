import React, { useEffect, useState } from "react";
import API from "../../api/axios"; // ✅
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiKey,
  FiTrash2,
  FiUsers,
  FiShield,
  FiX,
} from "react-icons/fi";


const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users"); // ✅
      setUsers(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Maǵlıwmatlardı júklewde qátelik!",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${editingUser.id}`, {
        // ✅
        role: editingUser.role,
        houseLimit: Number(editingUser.houseLimit),
      });
      toast.success("Paydalanıwshı tabıslı jańalandı");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Saqlawda qáte!");
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 6)
      return toast.error("Parol keminde 6 belgiden ibarat bolsın.!");
    try {
      await API.put(`/users/${passwordUser.id}/password`, {
        password: newPassword,
      }); // ✅
      toast.success("Parol jańalandı");
      setPasswordUser(null);
      setNewPassword("");
    } catch (err) {
      toast.error("Qatelik juz berdi");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Paydalanıwshını óshiresizbe ?")) return;
    try {
      await API.delete(`/users/${id}`); // ✅
      toast.success("Paydalanıwshı óshirildi");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Qatelik!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <FiShield className="text-blue-600" /> Super Admin Basqarıwı
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Paydalanıwshılar dizimi hám huqıqların basqarıw
            </p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <FiUsers className="text-blue-500" />
            <span className="text-sm font-bold text-slate-700">
              Jámi: {users.length} paydalaniwshi
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Paydalaniwshi
                  </th>
                  <th className="text-left p-4 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Roli
                  </th>
                  <th className="text-left p-4 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Limit
                  </th>
                  <th className="text-right p-4 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Ámeller
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">
                            {u.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          u.role === "superadmin"
                            ? "bg-purple-50 text-purple-600 border-purple-100"
                            : u.role === "admin"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                        {u.houseLimit}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {u.role !== "superadmin" ? (
                          <>
                            <ActionButton
                              icon={<FiEdit2 size={14} />}
                              color="blue"
                              onClick={() => setEditingUser(u)}
                              title="Ózgertiw"
                            />
                            <ActionButton
                              icon={<FiKey size={14} />}
                              color="amber"
                              onClick={() => setPasswordUser(u)}
                              title="Parolni Ózgertiw"
                            />
                            <ActionButton
                              icon={<FiTrash2 size={14} />}
                              color="red"
                              onClick={() => deleteUser(u.id)}
                              title="Óshiriw"
                            />
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-medium italic">
                            Qorǵalǵan
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="p-10 text-center text-slate-400 text-sm">
              Juklenbekte...
            </div>
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      {editingUser && (
        <Modal
          title="Paydalanıwshını ózgertiw"
          onClose={() => setEditingUser(null)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
                Paydalaniwshi Roli
              </label>
              <select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-700 transition-all"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
                Daǵazalar Limiti
              </label>
              <input
                type="number"
                value={editingUser.houseLimit}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, houseLimit: e.target.value })
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-700 transition-all"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                Biykar qiliw
              </button>
              <button
                type="submit"
                className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Saqlaw
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* PASSWORD MODAL */}
      {passwordUser && (
        <Modal title="Paroldi jańalaw" onClose={() => setPasswordUser(null)}>
          <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-[11px] text-amber-600 font-bold uppercase">
              Paydalaniwshi
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {passwordUser.email}
            </p>
          </div>
          <input
            type="password"
            placeholder="Jańa parol kirgiziń"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 outline-none focus:border-amber-500 font-semibold transition-all"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setPasswordUser(null)}
              className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
            >
              Biykar qiliw
            </button>
            <button
              onClick={changePassword}
              className="flex-1 py-3 text-sm font-bold text-white bg-amber-500 rounded-xl shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
            >
              Jańalaw
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const ActionButton = ({ icon, color, onClick, title }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 hover:bg-blue-600",
    amber: "text-amber-600 bg-amber-50 hover:bg-amber-600",
    red: "text-red-600 bg-red-50 hover:bg-red-600",
  };
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:text-white ${colors[color]}`}
    >
      {icon}
    </button>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default SuperAdminDashboard;
