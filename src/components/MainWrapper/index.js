import React from "react";
import { Grid } from "@material-ui/core";
import MapTool from "../MapTool";
import LeftMenu from "../LeftMenu";
import { connect } from "react-redux";
import { useStyles } from "./styles";

const MainWrapper = (props) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.grid}>
      <Grid item md={3} className={classes.side}>
        <LeftMenu
          mapViewport={props.features.viewPort}
          features={props.features.features}
          dispatch={props.dispatch}
        />
      </Grid>
      <Grid item sm={12} md={9} className={classes.map}>
        <MapTool
          mapViewport={props.features.viewPort}
          fit={props.features.fit}
          features={props.features.features}
          dispatch={props.dispatch}
          bounds={props.features.bounds}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ featureReducer }) => {
  return {
    features: featureReducer,
  };
};
export default connect(mapStateToProps)(MainWrapper);
