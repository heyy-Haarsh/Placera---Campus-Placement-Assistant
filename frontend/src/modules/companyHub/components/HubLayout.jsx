import React, { useState } from 'react';
import HubHeader from './HubHeader';
import CommunityModule from '../community/CommunityModule';
import ResourcesModule from '../resources/ResourcesModule';
import MockModule from '../mock/MockModule';
import AMAModule from '../ama/AMAModule';
import InsightsModule from '../insights/InsightsModule';

const HubLayout = ({ companyId, companyData, t, dark, role }) => {
    const [activeTab, setActiveTab] = useState('community');

    const renderModule = () => {
        switch (activeTab) {
            case 'community': return <CommunityModule companyData={companyData} t={t} dark={dark} role={role} />;
            case 'resources': return <ResourcesModule companyData={companyData} t={t} />;
            case 'mock': return <MockModule companyData={companyData} t={t} />;
            case 'ama': return <AMAModule companyData={companyData} t={t} />;
            case 'insights': return <InsightsModule companyData={companyData} t={t} />;
            default: return null;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg }}>
            <HubHeader
                companyData={companyData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                t={t}
            />
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {renderModule()}
            </div>
        </div>
    );
};

export default HubLayout;
