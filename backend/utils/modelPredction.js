const axios = require("axios");

module.exports = async function getPrediction(type ,priority) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
        {
            type: type,
            priority: priority,
        },
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
    );
    return response.data;
    } catch (error) {
    console.log("error is "+ error);
    return error;
    }
}