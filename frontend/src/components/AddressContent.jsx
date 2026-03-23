import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

export default function ManageAddress() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Prachi Kushwaha",
      phone: "6267334973",
      pincode: "462023",
      locality: "New Ashoka Garden",
      address: "b178 new ashoka garden bhopal",
      type: "Home",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    type: "Home",
  });

  const handleSaveAddress = () => {
    if (!formData.name || !formData.phone) {
      // alert() ki jagah hum message box suggest karte hain, par logic same rakha hai
      return;
    }

    if (editId) {
      setAddresses(
        addresses.map((a) => (a.id === editId ? { ...formData, id: editId } : a))
      );
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
    }

    setShowForm(false);
    setEditId(null);

    setFormData({
      name: "",
      phone: "",
      pincode: "",
      locality: "",
      address: "",
      type: "Home",
    });
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleEditAddress = (item) => {
    setEditId(item.id);
    setFormData(item);
    setShowForm(true);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 
        className="text-2xl font-semibold text-gray-800 mb-8 border-b border-gray-100 pb-4" 
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Manage Addresses
      </h2>

      {/* Add Address Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 p-4 mb-8 text-yellow-600 font-bold hover:bg-yellow-50 hover:border-yellow-200 transition-all rounded-sm"
        >
          <Plus size={18} />
          ADD NEW ADDRESS
        </button>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="border border-gray-200 p-6 mb-8 bg-gray-50 rounded-sm shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            {editId ? "Edit Address" : "Add New Address"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Name"
              className="p-3 bg-white border border-gray-200 rounded outline-none focus:border-yellow-500 text-gray-800"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              placeholder="Phone Number"
              className="p-3 bg-white border border-gray-200 rounded outline-none focus:border-yellow-500 text-gray-800"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Pincode"
              className="p-3 bg-white border border-gray-200 rounded outline-none focus:border-yellow-500 text-gray-800"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
            <input
              placeholder="Locality"
              className="p-3 bg-white border border-gray-200 rounded outline-none focus:border-yellow-500 text-gray-800"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            />
          </div>

          <textarea
            placeholder="Full Address (House No, Building, Street, Area)"
            rows="3"
            className="w-full p-3 mb-6 bg-white border border-gray-200 rounded outline-none focus:border-yellow-500 text-gray-800"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="flex items-center gap-6">
            <button
              onClick={handleSaveAddress}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-10 py-3 rounded-sm transition-colors uppercase text-sm tracking-widest shadow-md"
            >
              {editId ? "Update" : "Save"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="text-gray-500 font-bold hover:text-black uppercase text-sm tracking-widest"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((item) => (
          <div
            key={item.id}
            className="group border border-gray-200 p-6 bg-white hover:shadow-md transition-shadow relative rounded-sm"
          >
            <div className="absolute top-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEditAddress(item)}
                className="text-blue-600 hover:underline text-xs font-bold uppercase tracking-widest"
              >
                Edit
              </button>
              <button
                onClick={() => deleteAddress(item.id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-widest"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>

            <div className="inline-block bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter mb-3">
              {item.type}
            </div>

            <h3 className="font-bold text-gray-800 text-lg mb-1">
              {item.name}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              {item.address}, {item.locality} - <span className="font-semibold">{item.pincode}</span>
            </p>
            
            <p className="text-gray-800 font-medium mt-3 flex items-center gap-2">
              <span className="text-gray-400 text-xs font-bold uppercase">Phone:</span> {item.phone}
            </p>
          </div>
        ))}

        {addresses.length === 0 && !showForm && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded">
            <p className="text-gray-400">No addresses saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}