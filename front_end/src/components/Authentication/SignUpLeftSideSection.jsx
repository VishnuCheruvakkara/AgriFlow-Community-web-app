import React from 'react'
import AgriFlowWhiteLogo from '../../assets/images/agriflowwhite.png'
import { Link } from 'react-router-dom';

function SignUpLeftSideSection() {
    return (
        <div>
            <div className="hidden lg:flex lg:w-1/2 bg-green-600 flex-col justify-center items-center p-12 fixed h-screen top-0 left-0">
                <div className="absolute inset-0 bg-black opacity-40"></div>

                <div className="relative z-10 text-center">
                    <Link to='/'>
                        <img src={AgriFlowWhiteLogo} alt="AgriFlow logo" className="w-24 h-24 mx-auto mb-8" />
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">AgriFlow</h1>
                    <p className="text-xl text-white opacity-90">
                        Modernizing agriculture through smart technology
                    </p>
                    <div className="mt-12 bg-white/20 backdrop-blur-sm p-6 rounded-lg">
                        <p className="text-white text-lg italic">
                            "AgriFlow transformed our farm management. Productivity increased by 35% in just one growing season."
                        </p>
                        <p className="text-white mt-4 font-semibold">- James Miller, Sunset Valley Farms</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpLeftSideSection
