import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";

import FooterCSS from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={FooterCSS.outerBox}>
      <Grid container direction="row" justify="center" alignItems="flex-start">
          <small>
            Copyright @2021 | William Carlos Williams, “The Red Wheelbarrow” The
            most anthologized poem of the last 25 years for a reason. See also:
            “This is Just to Say,” which, among other things, has spawned a host
            of memes and parodies.
          </small>
      </Grid>
    </div>
  );
};

export default Footer;
