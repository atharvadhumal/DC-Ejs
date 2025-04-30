import React from "react";
import Icons from "../../shared/icons";
import { MDBBtn } from "mdb-react-ui-kit";
import { TUserProfile } from "../../shared/types";

const ProfilePreview = React.memo(React.forwardRef((props: any, ref: any) => {
    return (
        <div ref={ref} className="profile-previewer profile-previewer-d-none">
            <div className="previewer-display-container">
                <div className="top-container"></div>
                <div className="bottom-container">

                    <div className="profile-name-container">
                        <div className="img-container">
                            <div>
                                <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRcbLjcZKWWHRRpf5gdOSCI78jLz3gpNgL67AcTD3zFE-zU_GTG" alt="" />
                            </div>
                        </div>
                        <div className="icon-container">
                            <div><Icons.HashSign className="profile-tip" /></div>
                        </div>

                    </div>

                    <div className="profile-edit-container mt-2">
                        <div className="profile-edit-container-inner">
                            <div className="profile-names mb-3">
                                <div>Atharva</div>
                                <div>cnctr24</div>
                            </div>

                            <div className="member-since">
                                <div className="title">Member Since</div>
                                <div className="content">
                                    <span>20sept 2022</span>
                                    <Icons.Dot />
                                    <span>{new Date().toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="note-container mt-2">
                                <div className="title">Note</div>
                                <div className="send-note" contentEditable={true}></div>
                                <div className="message">
                                    <input type="text" placeholder="Message @testUser" />
                                </div>
                            </div>



                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}));

export default ProfilePreview;
