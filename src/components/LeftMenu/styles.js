import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles((theme) => ({
  paper: {
    width: "300px",
    padding: "8px",
    margin: "16px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
    cursor: "pointer",
  },
  upload: {
    backgroundColor: "#3f51b5",
    color: "white",
    padding: "0.5rem",
    fontFamily: "sans-serif",
    borderRadius: "0.3rem",
    cursor: "pointer",
    marginTop: "1rem",
    marginLeft: "8px",
  },
  formControl: {
    minWidth: "100%",
    marginBottom: "8px",
    marginTop: "8px",
  },
}));
