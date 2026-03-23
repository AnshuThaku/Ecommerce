
import React,{useState} from "react"
import Sidebar from "../components/Sidebar"

import UserDetails from "../components/Userdetails"
import AddressContent from "../components/AddressContent"

const Account = () => {

const [activeTab,setActiveTab] = useState("profile")

const renderContent = () => {

switch(activeTab){

case "profile":
return <UserDetails/>

case "addresses":
return <AddressContent/>

default:
return <div className="p-10 text-gray-600">Coming Soon</div>

}

}

return(

<div className="min-h-screen bg-gray-50 p-10">

<div className="max-w-6xl mx-auto flex gap-8">

{/* Sidebar */}

<div className="w-80">

<Sidebar
activeTab={activeTab}
setActiveTab={setActiveTab}
/>

</div>

{/* Page Content */}

<div className="flex-1 bg-white border border-gray-200">

{renderContent()}

</div>

</div>

</div>

)

}

export default Account