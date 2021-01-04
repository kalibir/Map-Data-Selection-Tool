import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  grid: {
    width: "100%",
    height: "100vh",
    margin: "0px",
  },
  map: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  side: {
    padding: theme.spacing(2),
    height: "100vh",
    color: theme.palette.text.secondary,
    background: "#ebebeb",
    overflowY: "scroll",
  },
}));
