import React, { useState } from "react";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { addFeature } from "../../store/actions/addFeatureAction";
import ReactFileReader from "react-file-reader";
import { useStyles } from "./styles";
import { labels } from "./variables";

const LeftMenu = ({ dispatch, features, mapViewport }) => {
  const classes = useStyles();
  // SET DATA FOR DOWNLOAD FILE
  const downloadData =
    "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(features));

  const [uploaded, setUploaded] = useState({
    data: null,
  });

  const [name, setName] = useState("");

  const handleNameChange = (e, feature) => {
    e.preventDefault();
    feature.properties.label = e.target.value;
    setName(e.target.value);
  };

  const handleUpload = (files) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      // Use reader.result
      setUploaded({
        data: reader.result,
      });
      const fileObjs = JSON.parse(e.currentTarget.result);
      fileObjs.forEach((obj) => {
        dispatch(addFeature(obj));
      });
    };
    reader.readAsText(files[0]);
  };

  return (
    <>
      <h2>Selections:</h2>
      <div style={{ display: "flex" }}>
        {features.length > 0 ? (
          <Button
            variant="contained"
            color="primary"
            href={`data: + ${downloadData}`}
            download="data.json"
            style={{
              marginRight: "8px",
            }}
          >
            download JSON
          </Button>
        ) : null}
        <ReactFileReader
          multipleFiles={false}
          fileTypes={[".json"]}
          handleFiles={handleUpload}
        >
          <Button variant="contained" color="primary">
            upload JSON
          </Button>
        </ReactFileReader>
      </div>
      {features.map((paper, index) => {
        return (
          <Paper elevation={1} className={classes.paper} key={index}>
            <form className={classes.formControl}>
              <InputLabel htmlFor="selection-label">
                {paper.properties.label}
              </InputLabel>
              <Select
                native
                onChange={(e) => handleNameChange(e, paper)}
                inputProps={{
                  name: "label",
                  id: "selection-label",
                }}
                className={classes.formControl}
              >
                {labels.map((label, index) => {
                  return <option value={label}>{label}</option>;
                })}
              </Select>
            </form>
            <div style={{ marginBottom: "8px" }}>
              Area: {paper.properties.area} m2
            </div>
          </Paper>
        );
      })}
    </>
  );
};

export default LeftMenu;
