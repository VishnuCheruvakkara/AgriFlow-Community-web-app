import React from 'react';
import AgriFlowWhiteLogo from '../../assets/images/agriflowwhite.png';
import { Link } from 'react-router-dom';

function SignUpLeftSideSection() {
    return (
        <div>
            <div 
                className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 fixed h-screen top-0 left-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/admin-login-background.jpg')" }}
            >
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                {/* Content inside */}
                <div className="relative z-10 text-center">
                    <Link to='/'>
                        <img src={AgriFlowWhiteLogo} alt="AgriFlow logo" className="w-24 h-24 mx-auto mb-4" />
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">AgriFlow</h1>
                    <p className="text-xl text-white opacity-90">
                        Modernizing agriculture through smart technology
                    </p>
                  
                </div>
            </div>
        </div>
    );
}

export default SignUpLeftSideSection;
