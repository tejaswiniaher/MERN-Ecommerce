import React from 'react';
import {Phone, Mail, GitHub, LinkedIn, Instagram, YouTube} from '@mui/icons-material'
import '../componentStyles/Footer.css'


function Footer() {
  return (
  <footer className='footer'>
    <div className='footer-container'>

      {/* Section1 */}
      <div id="contact" className="footer-section contact">
        <h3>Contact Us</h3>
        <p><Phone fontSize='small'/>phone : +8767584532</p>
        <p><Mail fontSize='small'/>Email : tejaswiniaher64@gmail.com</p>
      </div>

      {/* Section2 */}
      <div className="footer-section social">
        <h3>Follow me</h3>
        <div className="social-links">
          <a href="https://github.com/tejaswiniaher" target='_blank'>
            <GitHub className='social-icon'/>
          </a>
          <a href="https://www.linkedin.com/in/tejaswini-aher-53b9232a4" target='_blank'>
            <LinkedIn className='social-icon'/>
          </a>
          <a href="https://www.youtube.com/@tejaswiniaher9918" target='_blank'>
            <YouTube className='social-icon'/>
          </a>
          <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=muz2zil" target='_blank'>
            <Instagram className='social-icon'/>
          </a>
        </div>
      </div>

      {/* Section3 */}
      <div id="about" className="footer-section about">
        <h3>About</h3>
        <p>
          SnapCart is your fast and reliable online shopping destination.
          We bring quality products, secure payments, and a smooth experience
          - so you can shop in a snap.⚡
        </p>
      </div>

    </div>

    <div className="footer-bottom">
      <p>&copy; 2026 TejaswiniCoding . All rights reserved</p>
    </div>
  </footer>
  )
}
export default Footer