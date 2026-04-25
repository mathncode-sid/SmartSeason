import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>SmartSeason</h1>
            <p className="tagline">Intelligent Field Monitoring for Modern Agriculture</p>
            <p className="description">
              Track crop progress across multiple fields in real-time. Make data-driven decisions 
              to maximize yield and optimize farm operations.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary btn-large">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                Create Account
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-shape">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#1db854" d="M45.7,-78C61.1,-71.3,77.1,-59.3,85.9,-43.5C94.8,-27.7,97.6,-8.3,94.1,10.5C90.6,29.2,80.8,47.7,67.6,61.9C54.4,76.1,37.8,86,20.4,90.5C3,95,-16.2,94,-33.1,87.8C-50,81.6,-64.5,70.1,-73.4,55.1C-82.3,40.1,-85.6,21.6,-83.3,4.5C-81,-12.6,-73.1,-28.2,-62.6,-40.1C-52.1,-52,-39,-60.1,-24.9,-66.8C-10.8,-73.5,5.7,-79,45.7,-78Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose SmartSeason?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span>📊</span>
              </div>
              <h3>Real-Time Monitoring</h3>
              <p>Track field status and crop progress with instant updates and live data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <span>👥</span>
              </div>
              <h3>Team Collaboration</h3>
              <p>Assign fields to agents and coordinate work seamlessly across your farm</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <span>📈</span>
              </div>
              <h3>Smart Analytics</h3>
              <p>Intelligent status calculation identifies at-risk fields and optimizes scheduling</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <span>🔒</span>
              </div>
              <h3>Secure & Reliable</h3>
              <p>Enterprise-grade security with role-based access and data protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Fields</h3>
              <p>Add your fields with crop type and planting date</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Assign Agents</h3>
              <p>Distribute fields to your field agents</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Track Progress</h3>
              <p>Monitor stages and receive status updates</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Optimize Harvest</h3>
              <p>Make decisions based on intelligent insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="demo-section">
        <div className="container">
          <h2>Try It Now</h2>
          <p className="demo-description">
            Experience SmartSeason with our demo accounts:
          </p>
          <div className="demo-credentials">
            <div className="credential-box admin">
              <h4>Administrator</h4>
              <p><strong>Email:</strong> admin@smartseason.com</p>
              <p><strong>Password:</strong> password123</p>
              <p className="credential-note">Manage all fields and assign work to agents</p>
            </div>
            <div className="credential-box agent">
              <h4>Field Agent</h4>
              <p><strong>Email:</strong> agent@smartseason.com</p>
              <p><strong>Password:</strong> password123</p>
              <p className="credential-note">Submit field updates and track assignments</p>
            </div>
          </div>
          <Link to="/login" className="btn btn-primary btn-large" style={{ marginTop: '30px' }}>
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} SmartSeason. Empowering Agricultural Excellence.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
