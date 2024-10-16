import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <section className="elementor-section elementor-top-section">
        <div className="elementor-container">
          <div className="elementor-element">
            <span className="elementor-divider-separator"></span>
          </div>
          <div className="elementor-element elementor-widget elementor-widget-text-editor">
            <div className="elementor-widget-container">
              <h1 style={{ textAlign: 'center' }}>
                Our <span style={{ color: '#dc1414' }}>Marathon Medical</span> Family
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* First Row */}
      <section className="elementor-section elementor-top-section">
        <div className="elementor-container">
          <div className="elementor-column">
            <div className="elementor-widget-container">
              <p style={{ textAlign: 'center' }}>
                <b>Eric Bonner, Managing Partner</b>
              </p>
              <p style={{ textAlign: 'center' }}>Raleigh/Durham/Chapel Hill</p>
              <div className="elementor-icon-wrapper">
                <a className="elementor-icon elementor-animation-pulse" href="https://www.linkedin.com/in/cericbonner/" target="_blank">
                  <i className="hm hm-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* Other team members in similar structure */}
        </div>
      </section>

      {/* Second Row */}
      <section className="elementor-section elementor-top-section">
        <div className="elementor-container">
          <div className="elementor-column">
            <div className="elementor-widget-container">
              <p style={{ textAlign: 'center' }}>
                <b>Justin Gross, Managing Partner</b>
              </p>
              <p style={{ textAlign: 'center' }}>North Carolina and South Carolina</p>
              <div className="elementor-icon-wrapper">
                <a className="elementor-icon elementor-animation-pulse" href="https://www.linkedin.com/in/justin-gross-8240491/" target="_blank">
                  <i className="hm hm-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Other team members in similar structure */}
        </div>
      </section>

      {/* Additional rows for each group of team members */}
      <section className="elementor-section elementor-top-section">
        <div className="elementor-container">
          {/* Repeat similar structure for each row and team member */}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
