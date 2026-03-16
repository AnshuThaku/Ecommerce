// import React from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { ShoppingBag, Settings, Box, CreditCard, Power } from "lucide-react"
// import SidebarItem from "./SidebarItem"

// const Sidebar = ({ activeTab, setActiveTab }) => {

// const navigate = useNavigate()

// const handleLogout = () => {
// localStorage.removeItem("token")
// navigate("/login")
// }

// return (

// <div className="bg-[#111111] rounded-sm border border-zinc-800 shadow-xl overflow-hidden flex flex-col">

// {/* Orders Route */}
// <Link to="/cart">
// <SidebarItem icon={ShoppingBag} label="My Orders" />
// </Link>

// {/* Account Settings */}
// <div className="border-b border-zinc-800/50">

// <div className="flex items-center gap-3 p-4 text-[#C8A253] font-bold uppercase text-[10px] tracking-[0.2em] bg-[#1A1A1A]/50">
// <Settings size={14}/>
// <span>Account Settings</span>
// </div>

// <SidebarItem
// label="Profile Information"
// id="profile"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// <SidebarItem
// label="Manage Addresses"
// id="addresses"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// </div>

// {/* Payments */}
// <div className="border-b border-zinc-800/50">

// <div className="flex items-center gap-3 p-4 text-[#C8A253] font-bold uppercase text-[10px] tracking-[0.2em] bg-[#1A1A1A]/50">
// <CreditCard size={14}/>
// <span>Payments</span>
// </div>

// <SidebarItem
// label="Gift Cards"
// id="gifts"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// <SidebarItem
// label="Saved UPI"
// id="upi"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// </div>

// {/* Personal */}
// <div className="border-b border-zinc-800/50">

// <div className="flex items-center gap-3 p-4 text-[#C8A253] font-bold uppercase text-[10px] tracking-[0.2em] bg-[#1A1A1A]/50">
// <Box size={14}/>
// <span>Personal Collection</span>
// </div>

// <SidebarItem
// label="My Coupons"
// id="coupons"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// <SidebarItem
// label="Reviews & Ratings"
// id="reviews"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// <SidebarItem
// label="All Notifications"
// id="notifications"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// <SidebarItem
// label="Wishlist"
// id="wishlist"
// activeTab={activeTab}
// setActiveTab={setActiveTab}
// isSubItem
// />

// </div>

// {/* Logout */}
// <button
// onClick={handleLogout}
// className="flex items-center gap-3 p-4 text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition"
// >
// <Power size={18}/>
// <span>Logout</span>
// </button>

// </div>

// )

// }

// export default Sidebar

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingBag, Settings, Box, CreditCard, Power } from "lucide-react"
import SidebarItem from "./SidebarItem"

const Sidebar = ({ activeTab, setActiveTab }) => {

const navigate = useNavigate()

const handleLogout = () => {
localStorage.removeItem("token")
navigate("/login")
}

return (

<div className="bg-white rounded-sm border border-gray-200 shadow-xl overflow-hidden flex flex-col">

{/* Orders Route */}
<Link to="/cart">
<SidebarItem icon={ShoppingBag} label="My Orders" />
</Link>

{/* Account Settings */}
<div className="border-b border-gray-200">

<div className="flex items-center gap-3 p-4 text-black font-bold uppercase text-[10px] tracking-[0.2em] bg-gray-50">
<Settings size={14}/>
<span>Account Settings</span>
</div>

<SidebarItem
label="Profile Information"
id="profile"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

<SidebarItem
label="Manage Addresses"
id="addresses"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

</div>

{/* Payments */}
<div className="border-b border-gray-200">

<div className="flex items-center gap-3 p-4 text-black font-bold uppercase text-[10px] tracking-[0.2em] bg-gray-50">
<CreditCard size={14}/>
<span>Payments</span>
</div>

<SidebarItem
label="Gift Cards"
id="gifts"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

<SidebarItem
label="Saved UPI"
id="upi"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

</div>

{/* Personal */}
<div className="border-b border-gray-200">

<div className="flex items-center gap-3 p-4 text-black font-bold uppercase text-[10px] tracking-[0.2em] bg-gray-50">
<Box size={14}/>
<span>Personal Collection</span>
</div>

<SidebarItem
label="My Coupons"
id="coupons"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

<SidebarItem
label="Reviews & Ratings"
id="reviews"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

<SidebarItem
label="All Notifications"
id="notifications"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

<SidebarItem
label="Wishlist"
id="wishlist"
activeTab={activeTab}
setActiveTab={setActiveTab}
isSubItem
/>

</div>

{/* Logout */}
<button
onClick={handleLogout}
className="flex items-center gap-3 p-4 text-black hover:text-black hover:bg-gray-100 transition"
>
<Power size={18}/>
<span>Logout</span>
</button>

</div>

)

}

export default Sidebar