import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { getAuth } from "firebase/auth";

function Portfolio() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const request = {
            uid: user.uid,
          };
          const response = await axios.post(
            "http://localhost:5001/get_balance",
            request
          );

          if (response.status === 200) {
            const data = response.data.result;
            // Convert the JSON response into an array of objects
            const transformedData = Object.entries(data).map(
              ([name, value]) => ({
                name: name,
                value: value,
              })
            );
            console.log(transformedData);
            setData(transformedData);
          } else {
            throw new Error("Network response was not ok");
          }
        } else {
          console.log("Error: Not logged in");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false whether it succeeded or failed
        setLoading(false);
      }
    };

    fetchData(); // Call the async fetchData function
  }, []);

  const columns = [
    { field: "name", headerName: "Symbol", width: 100 },
    { field: "value", headerName: "Quantity", width: 150 },
    // Add more columns as needed
  ];

  return (
    <Box>
      <Box
        m="20px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Header
          title="PORTFOLIO"
          subtitle="View your Kraken Portfolio"
        ></Header>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        ml="15px"
        mr="15px"
        mb="15px"
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.name + row.value}
          pageSize={10}
          rowsPerPageOptions={[25]}
          style={{ minHeight: "400px", maxHeight: "615px" }}
        />
      </Box>
    </Box>
  );
}

export default Portfolio;
