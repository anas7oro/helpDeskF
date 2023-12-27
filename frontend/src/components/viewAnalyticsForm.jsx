import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Typography from "@material-ui/core/Typography";

import {
  getAnalytics,
  getAgentAnalytics,
  getAnalyticsCharts,
} from "../features/analytics/analyticsSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Form, Button, Table } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const categories = ["hardware", "software", "network"];
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
const status = ["open", "closed", "pending"];

function ViewAnalyticsForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { analytics, isLoading, isError, isSuccess, message, categoryCounts } =
    useSelector((state) => state.analytics);
  const agentAnalytics = useSelector((state) => state.agentAnalytics);
  const analyticsCharts = useSelector(
    (state) => state.analytics.analyticsCharts
  );
  const data = analyticsCharts.topSubcategoryCounts.map((item) => ({
    ...item,
    idAndSubCategory: `${item._id} - ${item.topSubCategory}`,
  }));
  console.log("analyticsCharts : ", analyticsCharts);
  const [form, setForm] = useState({
    creationDate: "",
    closingDate: "",
    openingDate: "",
    status: "",
    userEmail: "",
    agentEmail: "",
    category: "",
    subCategory: "",
  });

  useEffect(() => {
    dispatch(getAgentAnalytics());
    dispatch(getAnalytics(form));
    dispatch(getAnalyticsCharts());

    if (isError) {
      toast.error(message);
    }
  }, [formSubmitted, isError, isSuccess]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const utcForm = {
      ...form,
      creationDate: form.creationDate
        ? new Date(form.creationDate).toISOString()
        : "",
      closingDate: form.closingDate
        ? new Date(form.closingDate).toISOString()
        : "",
      openingDate: form.openingDate
        ? new Date(form.openingDate).toISOString()
        : "",
    };
    dispatch(getAnalytics(utcForm));
    dispatch(getAgentAnalytics());
  };

  if (isLoading) {
    return <Spinner />;
  } else {
    return (
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Creation Date:</Form.Label>
            <Form.Control
              type="date"
              name="creationDate"
              value={form.creationDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Closing Date:</Form.Label>
            <Form.Control
              type="date"
              name="closingDate"
              value={form.closingDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Opening Date:</Form.Label>
            <Form.Control
              type="date"
              name="openingDate"
              value={form.openingDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category:</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value=""></option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Sub Category:</Form.Label>
            <Form.Control
              as="select"
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
            >
              <option value=""></option>
              {subCategories.map((subCategory, index) => (
                <option key={index} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>User Email:</Form.Label>
            <Form.Control
              type="email"
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status:</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value=""></option>
              {status.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button type="submit">Get Info</Button>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Count</th>
              <th>user Email</th>
              <th>avg/Rating</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(analytics) &&
              analytics.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item._id.category}</td>
                    <td>{item._id.subCategory}</td>
                    <td>{item.count}</td>
                    <td>{item._id.userEmail}</td>
                    <td>{item.avgRate}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Agent id</th>
              <th>Agent email</th>
              <th>Rating</th>
              <th>tickets number</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(agentAnalytics.agentAnalytics) &&
              agentAnalytics.agentAnalytics.map((item, index) => (
                <tr key={index}>
                  <td>{item.agentId}</td>
                  <td>{item.agentEmail}</td>
                  <td>{item.avgRate}</td>
                  <td>{item.ticketCount}</td>
                </tr>
              ))}
          </tbody>
        </Table>

        <Typography variant="h6">
          Average Rating:{" "}
          {analyticsCharts.agentAvgRates && analyticsCharts.agentAvgRates[0]
            ? analyticsCharts.agentAvgRates[0].avgRate
            : "N/A"}{" "}
          From{" "}
          {analyticsCharts.agentAvgRates && analyticsCharts.agentAvgRates[0]
            ? analyticsCharts.agentAvgRates[0].ratedTickets
            : "N/A"}{" "}
          Tickets
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
            <div style={{ flex: "1 0 50%", maxWidth: "50%" }}>

          <PieChart width={400} height={400}>
            <Pie
              data={analyticsCharts.categoryCounts || []}
              cx={200}
              cy={200}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label={({ _id }) => _id}
            >
              {(analyticsCharts.categoryCounts || []).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <LineChart
            width={500}
            height={300}
            data={analyticsCharts.topSubcategoryCounts || []}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
          </div>
          <div style={{ flex: "1 0 50%", maxWidth: "50%" }}>

          <BarChart
            width={500}
            height={300}
            data={analyticsCharts.statusCounts || []}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 0, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="idAndSubCategory" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewAnalyticsForm;
