import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

function Portfolio() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Set persistence to local
    setPersistence(getAuth(), browserLocalPersistence)
      .then(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const request = {
            uid: user.uid,
          };
          axios
            .post("http://localhost:5001/get_balance", request)
            .then((response) => {
              if (response.status !== 200) {
                throw new Error("Network response was not ok");
              }
              return response.data.result;
            })
            .then((data) => {
              // Convert the JSON response into an array of objects
              const transformedData = Object.entries(data).map(
                ([name, value]) => ({
                  name: name,
                  value: value.amount,
                  holding: Math.round(value.holding * 100) / 100,
                })
              );
              console.log(transformedData);
              setData(transformedData);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        } else {
          console.log("Error: Not logged in");
        }
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, []);

  const columns = [
    { field: "name", headerName: "Symbol", width: 100 },
    { field: "value", headerName: "Quantity", width: 100 },
    { field: "holding", headerName: "Amount (USD)", width: 100 },
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
