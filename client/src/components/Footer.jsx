import React from "react";
import { Link } from "react-router-dom";
import '../componentsCss/footer.css'
import { Grid, Typography, Icon } from "@mui/material"
import { CIcon } from "@coreui/icons-react";
import { cilLocationPin, cilPhone, cibGmail, cibFacebook, cibTwitter, cibInstagram } from "@coreui/icons";
import CopyrightIcon from '@mui/icons-material/Copyright';

function Footer() {
  return (
    <Grid container className="footer">
      <Grid container className="footer-upper"  >
        <Grid className=" col col-1" size={3}  >
          <h5>Quick Links</h5>
          <Link to="/">Home</Link>
          <Link to="dog">Dogs</Link>
          <Link to="cat">Cats</Link>
        </Grid>
        <Grid className=" col col-2" size={3}  >
          <h5>Popular Dog Breeds</h5>
          <Link to="">Labrador Retriever</Link>
          <Link to="">German Shepherd</Link>
          <Link to="">Bulldog</Link>
          <Link to="">Poodle</Link>
        </Grid>
        <Grid className=" col col-3" size={3}   >
          <h5>Popular Cat Breeds</h5>
          <Link to="">Maine Moon</Link>
          <Link to="">Siamese</Link>
          <Link to="">Persian</Link>
          <Link to="">Bengal</Link>
        </Grid>
        <Grid className=" col col-4" size={3}   >
          <h5>Customer Service</h5>
          <Link to="">FAQ</Link>
          <Link to="">Shipping Policy</Link>
          <Link to="">Return & Refunds</Link>
          <Link to="">privacy Policy</Link>
        </Grid>
      </Grid>
      <Grid container className="footer-lower" >
        <Grid size={4} className=" col col-1">
          <h5>Pet Breeds Guide</h5>
          <p>Your comprehensive guide to cat and dog breeds from around the world</p>
          <Grid size={3} className='social-media' >
            <Link to='' > <CIcon icon={cibFacebook} /> </Link> 
            <Link to='' > <CIcon icon={cibInstagram} /> </Link>
            <Link to='' > <CIcon icon={cibTwitter} /> </Link>
          </Grid>
        </Grid>
        <Grid size={4} className=" col col-2">
          <h5>Contact US</h5>
          <p><span><CIcon icon={cilLocationPin} /></span>Level 12, Citrine Bagmane World Technology Center, Mahadevapura,Bengaluru</p>
          <p><span><CIcon icon={cilPhone} />+91 9398551122</span></p>
          <p><span><CIcon icon={cibGmail} /></span>info@petpals.com</p>
        </Grid>
      </Grid>
      <Grid size={12} container className='copyRight' >
        <Typography><CopyrightIcon/>2025 Pet Breeds Guide. All rights reserved</Typography>
        <Grid className='privacy' >
        <Link to='' >Terms of Service</Link>
        <Link to='' >Privacy Policy</Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Footer;
