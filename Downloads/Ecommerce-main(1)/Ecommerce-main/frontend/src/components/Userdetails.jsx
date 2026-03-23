import React, { useState } from "react"
import { Check, X } from "lucide-react"

const UserDetails = () => {

  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "Alexa",
    lastName: "Rawles",
    email: "alexarawles@gmail.com",
    phone: "+916267334973",
    gender: "Female"
  })

  const handleProfileSave = () => {
    setIsEditingProfile(false)
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
              className="text-green-600 font-bold text-sm uppercase flex items-center gap-1"
            >
              <Check size={16} /> Save
            </button>

            <button
              onClick={() => setIsEditingProfile(false)}
              className="text-red-600 font-bold text-sm uppercase flex items-center gap-1"
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
              setProfileData({
                ...profileData,
                firstName: e.target.value
              })
            }
            className={`w-full p-3 border rounded-sm
            ${
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
              setProfileData({
                ...profileData,
                lastName: e.target.value
              })
            }
            className={`w-full p-3 border rounded-sm
            ${
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
              className={`flex items-center gap-3
              ${
                profileData.gender === g
                  ? "text-black"
                  : "text-gray-600"
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
            setProfileData({
              ...profileData,
              email: e.target.value
            })
          }
          className={`w-full md:w-2/3 p-3 border rounded-sm
          ${
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
            setProfileData({
              ...profileData,
              phone: e.target.value
            })
          }
          className={`w-full md:w-2/3 p-3 border rounded-sm
          ${
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
  )
}

export default UserDetails