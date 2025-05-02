// src/renderer/components/profile-comps/settings/SettingsSidebar.tsx
import { MDBCol } from "mdb-react-ui-kit";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../shared/AuthContext";

const SettingsSidebar = React.memo(() => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <MDBCol xs={3} md={3} className="h-100 settings-sidebar d-flex justify-content-end">
            <div className="content-list d-block">
                <div className="section-title">
                    User Settings
                </div>
                <Link to={'/settings/main-profile'} className="section-item">
                    My Account
                </Link>
                <hr className="section-separator" />
                <div className="section-item" onClick={handleLogout} style={{cursor: 'pointer'}}>
                    Log Out
                </div>
            </div>
        </MDBCol>
    )
});

export default SettingsSidebar;
