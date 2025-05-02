// src/renderer/components/profile-comps/settings/MainProfile.tsx
import React from "react";
import Icons from "../../../shared/icons";
import { MDBBtn } from "mdb-react-ui-kit";
import { useAuth } from "../../../shared/AuthContext";

const MainProfile = React.memo(() => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div>
            <div className="settings-title mb-3">My Account</div>
            <div className="profile-display-container">
                <div className="top-container"></div>
                <div className="bottom-container">

                    <div className="profile-name-container">
                        <div className="img-container">
                            <img src={user?.picture || "https://via.placeholder.com/150"} alt="Profile" />
                        </div>
                        <div>
                            <div>{user?.name || "User"}</div>
                            <div className="mt-2"><Icons.HashSign className="profile-tip" /></div>
                        </div>
                        <div>
                            <MDBBtn>Edit User Profile</MDBBtn>
                        </div>
                    </div>

                    <div className="profile-edit-container">
                        <div className="profile-edit-container-inner">

                            <div className="profile-edit-list mb-3">
                                <div>
                                    <div className="list-title">Display Name</div>
                                    <div>{user?.name || "User"}</div>
                                </div>
                                <div><MDBBtn>Edit</MDBBtn></div>
                            </div>

                            <div className="profile-edit-list mb-3">
                                <div>
                                    <div className="list-title">Username</div>
                                    <div>{user?.email?.split('@')[0] || "username"}</div>
                                </div>
                                <div><MDBBtn>Edit</MDBBtn></div>
                            </div>

                            <div className="profile-edit-list mb-3">
                                <div>
                                    <div className="list-title">Email</div>
                                    <div>{user?.email || "email@example.com"}</div>
                                </div>
                                <div><MDBBtn>Edit</MDBBtn></div>
                            </div>

                            <div className="profile-edit-list mb-3">
                                <div>
                                    <div className="list-title">Connected Accounts</div>
                                    <div className="google-connected">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                            alt="Google"
                                            style={{ width: '16px', marginRight: '8px' }}
                                        />
                                        Google (Connected)
                                    </div>
                                </div>
                            </div>

                            <div className="profile-edit-list">
                                <div>
                                    <div className="list-title">Account Actions</div>
                                    <div></div>
                                </div>
                                <div><MDBBtn color="danger" onClick={handleLogout}>Logout</MDBBtn></div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
});

export default MainProfile;
