import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Table, Modal } from "react-bootstrap";

import {
  getTickets,
  getReports,
  createReport,
  getReport,
  editReport,
} from "../features/Reports/reportSlice";
export default function ManageReports() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [status, setStatusLocal] = useState("pending");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const tickets = useSelector((state) => state.tickets);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [viewingReport, setViewingReport] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filterHasReport, setFilterHasReport] = useState("");
  const categories = ['hardware','software','network'];
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
    "other",
  ];
  const ticketsStatus = ["open", "closed", "pending"];

  useEffect(() => {
    dispatch(getReports());
    dispatch(getTickets());
    if (!user) {
      navigate("/login");
    }
    if (selectedTicketId) {
      dispatch(getReport(selectedTicketId)).then((report) => {
        setViewingReport(report.payload);
        setEditTitle(report.payload.title);
        setEditDescription(report.payload.description);
      });
    }
  }, [user, navigate, selectedTicketId, dispatch]);

  const back = () => {
    navigate("/dashboard");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createReport({
        title: text,
        description,
        ticketId: selectedTicketId,
        agentId: selectedAgentId,
      })
    );
    setText("");
    setDescription("");
    setModalIsOpen(false);
  };
  const handleInputChange = (e) => {
    setDescription(e.target.value);
  };
  return (
    <>
      <Header>
        <Button
          variant="primary"
          style={{ marginRight: "10px" }}
          onClick={back}
        >
          back
        </Button>
      </Header>
      <p>Manage Reports</p>
      <Form>
        <Form.Group>
          <Form.Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Filter by category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
          >
            <option value="">Filter by sub category</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Filter by status</option>
            {ticketsStatus.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            value={filterHasReport}
            onChange={(e) => setFilterHasReport(e.target.value)}
          >
            <option value="">Filter by has report</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Form.Select>
          <Form.Control
            type="text"
            placeholder="Filter by email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
        </Form.Group>
      </Form>
      <div className="d-flex justify-content-center">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Status</th>
              <th>title</th>
              <th>Agent Email</th>
              <th>category</th>
              <th>sub category</th>
              <th>creation time</th>
              <th>opening date</th>
              <th>closing date</th>
              <th>Has report?</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tickets.tickets) &&
              tickets.tickets
                .filter((ticket) => {
                  return (
                    (filterCategory === "" ||
                      ticket.category.includes(filterCategory)) &&
                    (filterSubCategory === "" ||
                      ticket.subCategory.includes(filterSubCategory)) &&
                    (filterStatus === "" ||
                      ticket.status.includes(filterStatus)) &&
                    (filterEmail === "" ||
                      ticket.user_info.email.includes(filterEmail)) &&
                    (filterHasReport === "" ||
                      (ticket.hasReport ? "yes" : "no").includes(
                        filterHasReport
                      ))
                  );
                }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.status}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.user_info.email}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.subCategory}</td>
                    <td>{ticket.createdAt}</td>
                    <td>{ticket.openingDate}</td>
                    <td>{ticket.closingDate}</td>
                    <td>{ticket.hasReport ? "Yes" : "No"}</td>
                    <td>
                      {ticket.hasReport ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setModalIsOpen(true);
                            setSelectedTicketId(ticket._id);
                          }}
                        >
                          View Report
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setModalIsOpen(true);
                            setSelectedTicketId(ticket._id);
                            setSelectedAgentId(ticket.agentid);
                          }}
                        >
                          Create Report
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </div>
      <Modal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="text"
                value={viewingReport ? editTitle : text}
                onChange={(e) =>
                  viewingReport
                    ? setEditTitle(e.target.value)
                    : setText(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                value={viewingReport ? editDescription : description}
                onChange={(e) =>
                  viewingReport
                    ? setEditDescription(e.target.value)
                    : setDescription(e.target.value)
                }
              />
            </Form.Group>
            {viewingReport ? (
              <Button
                variant="primary"
                onClick={() =>
                  dispatch(
                    editReport({
                      id: viewingReport._id,
                      title: editTitle,
                      description: editDescription,
                    })
                  )
                }
              >
                Edit
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                Submit
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
