import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { Grid, Input, InputLabel } from "@material-ui/core";
import { Card, CardContent } from "@material-ui/core";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import {
    getBranding,
    createBranding,
    editBranding as editBrandingAction,
    deleteBranding,
} from "../features/branding/brandingSlice";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  Typography,
} from "@material-ui/core";

function Branding() {
    const color_ballet = useSelector((state) => state.branding.activeBranding && state.branding.activeBranding.color_ballet);
    console.log("color_ballet",color_ballet);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const brandingData = useSelector((state) => state.branding);
  
  const [open, setOpen] = useState(false);
  const [editBranding, setEditBranding] = useState(null);
  const [branding, setBranding] = useState({
    active: false,
    name: "",
    logo: null,
    color_ballet: ["#000000", "#000000", "#000000"],
    banner: null,
  });

  useEffect(() => {
    dispatch(getBranding());
  }, [dispatch]);
  const handleChange = (event) => {
    let value =
      event.target.name === "active"
        ? event.target.checked
        : event.target.value;
    if (event.target.name.startsWith("color_ballet")) {
      const index = parseInt(event.target.name.split("_")[2]) - 1;
      setBranding((prevBranding) => {
        const newColorBallet = [...prevBranding.color_ballet];
        newColorBallet[index] = value;
        return { ...prevBranding, color_ballet: newColorBallet };
      });
    } else {
      setBranding({
        ...branding,
        [event.target.name]: value,
      });
    }
  };
  const handleEdit = (brandingId) => {
    const brandingToEdit = brandingData.branding.find(branding => branding._id === brandingId);
    setEditBranding(brandingToEdit);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
const handleSave = () => {
    console.log(`Save branding with id: ${editBranding._id}`);
    dispatch(editBrandingAction(editBranding));
    setOpen(false);
};
  const handleDelete = (id) => {
    console.log(`Delete branding with id: ${id}`);
    dispatch(deleteBranding(id));
  };
  const handleEditChange = (event) => {
    let value =
      event.target.name === "active"
        ? event.target.checked
        : event.target.value;
    if (event.target.name.startsWith("color_ballet")) {
      const index = parseInt(event.target.name.split("_")[2]) - 1;
      setEditBranding((prevBranding) => {
        const newColorBallet = [...prevBranding.color_ballet];
        newColorBallet[index] = value;
        return { ...prevBranding, color_ballet: newColorBallet };
      });
    } else {
      setEditBranding({
        ...editBranding,
        [event.target.name]: value,
      });
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createBranding(branding));
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Create Branding
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={branding.active}
                    onChange={handleChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={branding.name}
                onChange={handleChange}
              />
            </Grid>
            {branding.color_ballet.map((color, index) => (
              <Grid item xs={12} key={index}>
                <InputLabel htmlFor={`color_ballet_${index + 1}`}>
                  Color Ballet {index + 1}
                </InputLabel>
                <Input
                  type="color"
                  id={`color_ballet_${index + 1}`}
                  name={`color_ballet_${index + 1}`}
                  value={color}
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Create Branding
              </Button>
            </Grid>
          </Grid>
        </form>
        <Typography variant="h4" gutterBottom style={{ marginTop: "2rem" }}>
          Existing Brandings
        </Typography>
        {Array.isArray(brandingData.branding) &&
  brandingData.branding.map((branding, index) => (
            <Card key={index} style={{ marginBottom: "1rem" }}>
              <CardContent>
                <Typography variant="h5">{branding.name}</Typography>
                <Typography variant="body1">
                  Active: {branding.active ? "Yes" : "No"}
                </Typography>

                <Typography variant="body1">
                  Color Ballet: {branding.color_ballet.join(", ")}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(branding._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(branding._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Branding</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={editBranding ? editBranding.name : ""}
            onChange={(event) =>
              setEditBranding({ ...editBranding, name: event.target.value })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editBranding ? editBranding.active : false}
                onChange={(event) =>
                  setEditBranding({
                    ...editBranding,
                    active: event.target.checked,
                  })
                }
                name="active"
                color="primary"
              />
            }
            label="Active"
          />
        {editBranding &&
            editBranding.color_ballet &&
            editBranding.color_ballet.length > 0 &&
            editBranding.color_ballet.map((color, index) => (
                <Grid item xs={12} key={index}>
                    <InputLabel htmlFor={`color_ballet_${index + 1}`}>
                        Color Ballet {index + 1}
                    </InputLabel>
                    <Input
                        type="color"
                        id={`color_ballet_${index + 1}`}
                        name={`color_ballet_${index + 1}`}
                        value={color}
                        fullWidth
                        onChange={handleEditChange}
                    />
                </Grid>
        ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Branding;
