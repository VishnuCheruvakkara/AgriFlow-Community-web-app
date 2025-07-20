import React from 'react';
import SentRequestsSection from '../../components/connection/SendRequestConnection';
import ReceivedRequestsSection from '../../components/connection/ReceivedRequestConnection';

function PendingRequests() {
    return (
        <div className="mx-auto">
            <h2 className="text-lg font-medium text-gray-800 mb-3 dark:text-zinc-200">Pending Connections</h2>

            {/* Sent Connection Requests Section */}
            <SentRequestsSection />

            {/* Received Connection Requests Section */}
            <ReceivedRequestsSection />
        </div>
    );
}

export default PendingRequests;
