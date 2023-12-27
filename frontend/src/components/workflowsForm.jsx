import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";

import {
  createWorkflow,
  getWorkflows,
  editWorkflow,
} from "../features/workflows/workflowsSlice";
import Spinner from "./Spinner";
const categories = ["Network", "Software", "Hardware"];
const subCategories = [
  "desktops",
  "laptops",
  "printers",
  "servers",
  "networking equipment",
  "operating system",
  "application software",
  "custom software",
  "integration issues",
  "email issues",
  "internet connection problems",
  "website errors",
];

function WorkflowsForm() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const color_ballet = useSelector((state) => state.branding.activeBranding && state.branding.activeBranding.color_ballet);

  const [newWorkflow, setNewWorkflow] = useState({
    category: "",
    subCategory: "",
    steps: [],
    description: "",
    active: true,
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const workflows = useSelector((state) => state.workflows.workflows);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getWorkflows());
  }, [dispatch]);

  const handleInputChange = (e) => {
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (e.target.name === "steps") {
      value = value.split("\n");
    }
    setNewWorkflow({ ...newWorkflow, [e.target.name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (selectedWorkflow) {
      dispatch(editWorkflow({ id: selectedWorkflow._id, data: newWorkflow }))
        .then(() => {
          setIsEditModalOpen(false);
          setSelectedWorkflow(null);
          setNewWorkflow({
            category: "",
            subCategory: "",
            steps: [],
            description: "",
            active: false,
          });
          dispatch(getWorkflows());
        })
        .catch((error) => {
          console.error("Failed to edit workflow:", error);
          setError("Failed to edit workflow");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      dispatch(createWorkflow(newWorkflow))
        .then(() => {
          setIsCreateModalOpen(false);
          setNewWorkflow({
            category: "",
            subCategory: "",
            steps: [],
            description: "",
            active: false,
          });
        })
        .catch((error) => {
          console.error("Failed to create workflow:", error);
          setError("Failed to create workflow");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleEdit = (workflow) => {
    setSelectedWorkflow(workflow);
    setNewWorkflow({
      ...workflow,
      _id: workflow._id,
    });
    setIsEditModalOpen(true);
  };

  return (
    <>
      {loading && <Spinner />}
      {error && <p>{error}</p>}

      <div>
        <button
          className="btn"
          onClick={() => {
            setIsCreateModalOpen(true);
            setNewWorkflow({
              category: "",
              subCategory: "",
              steps: [],
              description: "",
              active: false,
            });
          }}
          style={{ backgroundColor: color_ballet ? color_ballet[0] : 'defaultColor', color: '#fff' }}

        >
          Create Workflow
        </button>
        <Modal
          isOpen={isCreateModalOpen}
          onRequestClose={() => setIsCreateModalOpen(false)}
        >
        <form onSubmit={onSubmit} className="p-4" style={{ color: color_ballet ? color_ballet[1] : 'defaultColor' }}>
            <h2 className="mb-3">Create Workflow</h2>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={newWorkflow.category}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="" disabled selected>
                  Choose a category
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sub-Category</label>
              <select
                name="subCategory"
                value={newWorkflow.subCategory}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="" disabled selected>
                  Choose a sub-category
                </option>
                {subCategories.map((subCategory, index) => (
                  <option key={index} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Steps</label>
              <textarea
                name="steps"
                value={newWorkflow.steps.join("\n")}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={newWorkflow.description}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="active"
                checked={newWorkflow.active}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label className="form-check-label">Active</label>
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </Modal>
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
        >
        <form onSubmit={onSubmit} className="p-4" style={{ color: color_ballet ? color_ballet[1] : 'defaultColor' }}>
            <h2 className="mb-3">Edit Workflow</h2>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={newWorkflow.category}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sub-Category</label>
              <select
                name="subCategory"
                value={newWorkflow.subCategory}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                {subCategories.map((subCategory, index) => (
                  <option key={index} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Steps</label>
              <textarea
                name="steps"
                value={newWorkflow.steps.join("\n")}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={newWorkflow.description}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="active"
                checked={newWorkflow.active}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label className="form-check-label">Active</label>
            </div>
            <div className="mb-3">
              <label className="form-label">Creator</label>
              <input
                type="text"
                name="creator"
                value={newWorkflow.creator}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: color_ballet ? color_ballet[2] : 'defaultColor', color: '#fff' }}>
              Edit
            </button>
          </form>
        </Modal>
      </div>
      {console.log("workflows", workflows)}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Sub-Category</th>
            <th>Description</th>
            <th>active?</th>
            <th>createdAt</th>
            <th>creator</th>
            <th>steps</th>
          </tr>
        </thead>
        <tbody>
          {console.log("workflows", workflows)}
          {workflows &&
            workflows.map((workflow) => (
              <tr key={workflow.id} style={{ backgroundColor: color_ballet ? color_ballet[0] : 'defaultColor', color: '#fff' }}>
                <td>{workflow.category}</td>
                <td>{workflow.subCategory}</td>
                <td>{workflow.description}</td>
                <td>{workflow.active.toString()}</td>
                <td>{new Date(workflow.createdAt).toLocaleString()}</td>
                <td>{workflow.creator}</td>
                <td>{workflow.steps.join(", ")}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(workflow)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}

export default WorkflowsForm;
