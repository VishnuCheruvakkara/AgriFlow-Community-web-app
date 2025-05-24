import React, { useState } from 'react';
import OutgoingRequestsSection from '../../components/Community/PendingRequest/OutgoingRequestsSection';
import IncomingRequestsSection from '../../components/Community/PendingRequest/IncomingRequestSection';
import CommunityInvitationsSection from '../../components/Community/PendingRequest/CommunityInvitationsSection';
import AdminApprovalsSection from '../../components/Community/PendingRequest/AdminApprovalsSection';

function CommunityRequests() {
    // State to track which sections are expanded
    const [expandedSections, setExpandedSections] = useState({
        outgoingRequests: false,
        incomingRequests: false,
        adminInvites: false,
        pendingApprovals: false
    });

    // Toggle section visibility
    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    return (
        <div className="mx-auto">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Pending Requests</h2>

            <OutgoingRequestsSection 
                expanded={expandedSections.outgoingRequests} 
                toggleSection={toggleSection} 
            />
            
            <IncomingRequestsSection 
                expanded={expandedSections.incomingRequests} 
                toggleSection={toggleSection} 
            />
            
            <CommunityInvitationsSection 
                expanded={expandedSections.adminInvites} 
                toggleSection={toggleSection} 
            />
            
            <AdminApprovalsSection 
                expanded={expandedSections.pendingApprovals} 
                toggleSection={toggleSection} 
            />
        </div>
    );
}

export default CommunityRequests;