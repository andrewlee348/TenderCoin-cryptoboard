import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios"; // Import Axios for making HTTP requests

function MyForm() {
  const [formData, setFormData] = useState({
    api_key: "",
    api_secret: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your Flask backend
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const request = {
          uid: user.uid,
          api_key: formData.api_key,
          api_secret: formData.api_secret,
        };
        await axios.post("http://localhost:5001/update_user", request);
      } else {
        console.log("Error: Not logged in");
      }

      // Clear the form
      setFormData({ api_key: "", api_secret: "" });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="api_key">API Key:</label>
      <input
        type="text"
        id="api_key"
        name="api_key" // Unique name for API Key input
        value={formData.api_key}
        onChange={handleChange}
        required
      />
      <br />
      <label htmlFor="api_secret">API Secret Key:</label>
      <input
        type="text"
        id="api_secret"
        name="api_secret" // Unique name for API Secret input
        value={formData.api_secret}
        onChange={handleChange}
        required
      />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
