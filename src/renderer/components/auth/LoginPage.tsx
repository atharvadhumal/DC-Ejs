// src/renderer/components/auth/LoginPage.tsx
import React from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useAuth } from '../../shared/AuthContext';
import Icons from '../../shared/icons';

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <MDBContainer fluid className="login-page-container vh-100 d-flex align-items-center justify-content-center bg-dark">
      <MDBRow className="w-100 justify-content-center">
        <MDBCol md={5} className="login-card p-4 text-center">
          <div className="mb-4">
            <Icons.DiscordLogo className="login-logo" style={{ width: '80px', height: '80px' }} />
            <h2 className="mt-3">Welcome to Discord-EJS</h2>
            <p className="text-muted">Sign in to continue to your account</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <MDBBtn
            onClick={handleLogin}
            className="google-login-btn w-100 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            <div className="d-flex align-items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                style={{ width: '20px', marginRight: '10px' }}
              />
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </div>
          </MDBBtn>

          <p className="mt-4 text-muted small">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default LoginPage;
