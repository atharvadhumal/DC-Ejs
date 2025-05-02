// src/renderer/components/profile-comps/settings/MainProfile.tsx
import React from "react";
import Icons from "../../../shared/icons";
// Use dynamic import for MDB React UI Kit
import { MDBBtn } from "mdb-react-ui-kit";
import { useAuth } from "../../../shared/AuthContext";
import { useAppSelector } from "../../../shared/rdx-hooks";
import { GoogleUser } from "../../../shared/types"; //

const MainProfile = React.memo(() => {
    const { user, logout } = useAuth();
    const userProfile = useAppSelector(state => state.main.user_profile);

    // Format join date
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    // Use null coalescing to handle possible null values
    const joinDate = userProfile?.date_joined || new Date().toLocaleDateString();

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
                            <img
                                src={user?.picture || (userProfile && userProfile.image) || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>
                        <div>
                            <div className="user-display-name">{user?.name || (userProfile && userProfile.name)}</div>
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
                                    <div>{user?.name || (userProfile && userProfile.name)}</div>
                                </div>
                                <div><MDBBtn>Edit</MDBBtn></div>
                            </div>

                            <div className="profile-edit-list mb-3">
                                <div>
                                    <div className="list-title">Username</div>
                                    <div>{(userProfile && userProfile.user_name) || user?.email?.split('@')[0] || "username"}</div>
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
                                    <div className="list-title">Member Since</div>
                                    <div>{formatDate(joinDate)}</div>
                                </div>
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
                                        Google {user ? '(Connected)' : '(Not Connected)'}
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
    );
});

export default MainProfile;
