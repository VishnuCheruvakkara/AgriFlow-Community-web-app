import React from 'react'

function ProfilePage() {
    return (

        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">

            {/* Profile Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">

                {/* Profile Image */}
                <div className="flex justify-center">
                    <img className="w-32 h-32 rounded-full border-4 border-green-500 object-cover" src="/path-to-profile.jpg" alt="Farmer Profile" />
                </div>

                {/* Farmer Name */}
                <h2 className="text-2xl font-bold text-center mt-4 text-gray-800">John Doe</h2>

                {/* Location & Experience */}
                <p className="text-center text-gray-600 mt-2">🌍 Location: Springfield, USA</p>
                <p className="text-center text-gray-600">🌾 Experience: 10+ years in organic farming</p>

                {/* Bio Section */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700">About Me</h3>
                    <p className="text-gray-600 mt-2">
                        Passionate about sustainable farming. I specialize in organic vegetables and hydroponic farming techniques.
                        Always happy to share knowledge and connect with fellow farmers!
                    </p>
                </div>

                {/* Edit Profile Button */}
                <div className="flex justify-center mt-6">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        Edit Profile
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ProfilePage
