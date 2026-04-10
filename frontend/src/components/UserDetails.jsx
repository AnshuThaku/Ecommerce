import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axiosInstance from "../utils/axiosInstance"; // Ensure this path is correct

const UserDetails = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Female" // Default fallback
  });

  // 1. Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Aapke route ke hisaab se endpoint /auth/profile hai
        const { data } = await axiosInstance.get('/auth/profile');
        
        if (data.success && data.user) {
          // Backend se aane wale single 'name' ko first aur last name me split karna
          const fullName = data.user.name || "";
          const nameParts = fullName.trim().split(" ");
          const fName = nameParts[0] || "";
          const lName = nameParts.slice(1).join(" ") || "";

          setProfileData({
            firstName: fName,
            lastName: lName,
            email: data.user.email || "",
            phone: data.user.phone || "",
            gender: data.user.gender || "Female" // Agar backend gender support karta hai
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Update Profile Data
  const handleProfileSave = async () => {
    try {
      setSaving(true);
      
      // Frontend ke firstName aur lastName ko milakar single 'name' banana
      const updatedName = `${profileData.firstName} ${profileData.lastName}`.trim();

      const payload = {
        name: updatedName,
        email: profileData.email,
        phone: profileData.phone,
        gender: profileData.gender
      };

      const { data } = await axiosInstance.put('/auth/profile', payload);

      if (data.success) {
        setIsEditingProfile(false);
        alert("Profile updated successfully!"); // Aap yaha react-toastify bhi laga sakte hain
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditingProfile(false);
    // Optional: Cancel karne par purana data wapas lane ke liye wapas fetch function call kar sakte hain 
    // par abhi ke liye sirf edit mode band kar rahe hain.
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="p-8 bg-white h-full text-black">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-serif text-black">
          Personal Information
        </h2>

        {!isEditingProfile ? (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="text-blue-500 font-bold text-sm uppercase"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleProfileSave}
              disabled={saving}
              className="text-green-600 font-bold text-sm uppercase flex items-center gap-1 disabled:opacity-50"
            >
              <Check size={16} /> {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleCancel}
              disabled={saving}
              className="text-red-600 font-bold text-sm uppercase flex items-center gap-1 disabled:opacity-50"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* NAME */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase font-bold">
            First Name
          </label>
          <input
            type="text"
            readOnly={!isEditingProfile}
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
            }
            className={`w-full p-3 border rounded-sm ${
              isEditingProfile
                ? "bg-gray-100 border-gray-400"
                : "bg-transparent border-gray-200 text-gray-600"
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase font-bold">
            Last Name
          </label>
          <input
            type="text"
            readOnly={!isEditingProfile}
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData({ ...profileData, lastName: e.target.value })
            }
            className={`w-full p-3 border rounded-sm ${
              isEditingProfile
                ? "bg-gray-100 border-gray-400"
                : "bg-transparent border-gray-200 text-gray-600"
            }`}
          />
        </div>
      </div>

      {/* GENDER */}
      <div className="mb-10">
        <p className="text-xs font-bold text-gray-500 uppercase mb-4">
          Gender
        </p>
        <div className="flex gap-10">
          {["Male", "Female"].map((g) => (
            <label
              key={g}
              className={`flex items-center gap-3 ${
                profileData.gender === g ? "text-black" : "text-gray-600"
              }`}
            >
              <input
                type="radio"
                disabled={!isEditingProfile}
                checked={profileData.gender === g}
                onChange={() =>
                  setProfileData({ ...profileData, gender: g })
                }
                className="accent-gray-600"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* EMAIL */}
      <div className="mb-10">
        <h2 className="text-xl font-serif text-black mb-4">
          Email Address
        </h2>
        <input
          type="email"
          readOnly={!isEditingProfile}
          value={profileData.email}
          onChange={(e) =>
            setProfileData({ ...profileData, email: e.target.value })
          }
          className={`w-full md:w-2/3 p-3 border rounded-sm ${
            isEditingProfile
              ? "bg-gray-100 border-gray-400"
              : "bg-transparent border-gray-200 text-gray-600"
          }`}
        />
      </div>

      {/* PHONE */}
      <div className="mb-10">
        <h2 className="text-xl font-serif text-black mb-4">
          Mobile Number
        </h2>
        <input
          type="text"
          readOnly={!isEditingProfile}
          value={profileData.phone}
          onChange={(e) =>
            setProfileData({ ...profileData, phone: e.target.value })
          }
          className={`w-full md:w-2/3 p-3 border rounded-sm ${
            isEditingProfile
              ? "bg-gray-100 border-gray-400"
              : "bg-transparent border-gray-200 text-gray-600"
          }`}
        />
      </div>

      {/* DELETE */}
      <button className="text-red-600 font-bold text-sm uppercase">
        Delete Account
      </button>
    </div>
  );
};

export default UserDetails;