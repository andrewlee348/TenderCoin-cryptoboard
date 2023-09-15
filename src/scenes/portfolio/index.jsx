import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";

function BigDippers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Use the fetch API to make the HTTP request
    fetch("http://localhost:5001/get_balance/<user_id>")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Convert the JSON response into an array of objects
        const transformedData = Object.entries(data.result).map(
          ([symbol, value]) => ({
            name: symbol,
            value: value,
          })
        );
        console.log(transformedData);
        setData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const columns = [
    { field: "symbol", headerName: "Symbol", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
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
          pageSize={10}
          rowsPerPageOptions={[25]}
          style={{ minHeight: "400px", maxHeight: "615px" }}
        />
      </Box>
    </Box>
  );
}

export default BigDippers;
