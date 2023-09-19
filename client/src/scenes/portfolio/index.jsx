import { Box, Grid, Typography, Link, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import PieChart from "../../components/PieChart";
import { tokens } from "../../theme";

function formatNumberWithCommas(value) {
  return value.toLocaleString(); // Format number with commas
}

function Portfolio() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalHoldings, setTotalHoldings] = useState(0);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Set persistence to local
    setPersistence(getAuth(), browserLocalPersistence)
      .then(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          console.log(user.uid);
          const request = {
            uid: user.uid,
          };
          axios
            .post(
              "https://crypto-board-1-399420.uc.r.appspot.com/get_balance",
              request
            )
            .then((response) => {
              if (response.status !== 200) {
                throw new Error("Network response was not ok");
              }
              return response.data.result;
            })
            .then((data) => {
              if (data) {
                setHasData(true);
              }
              // Convert the JSON response into an array of objects
              const transformedData = Object.entries(data).map(
                ([name, value]) => ({
                  name: name,
                  value: value.amount,
                  holding: Math.round(value.holding * 100) / 100,
                })
              );
              const transformedPieData = Object.entries(data).map(
                ([name, value]) => ({
                  id: name,
                  value: Math.round(value.holding * 100) / 100,
                })
              );
              const total = transformedData.reduce(
                (acc, currentItem) => acc + currentItem.holding,
                0
              );
              setTotalHoldings(Math.round(total * 100) / 100);
              // console.log(transformedPieData);
              setData(transformedData);
              setPieData(transformedPieData);
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
    {
      field: "value",
      headerName: "Quantity",
      width: 150,
      valueFormatter: (params) => formatNumberWithCommas(params.value),
    },
    {
      field: "holding",
      headerName: "Amount (USD)",
      width: 150,
      valueFormatter: (params) => formatNumberWithCommas(params.value),
    },
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
        <Typography variant="h6">Total Holdings: ${totalHoldings}</Typography>
      </Box>
      {hasData ? (
        <Grid container spacing={2}>
          {/* Grid container to hold both DataGrid and PieChart */}
          <Grid item xs={4.5}>
            {/* Grid item for DataGrid */}
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
                style={{
                  maxWidth: "400px",
                  minHeight: "400px",
                  maxHeight: "615px",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={7.5}>
            {/* Grid item for PieChart */}
            <Box
              height="75vh"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <PieChart data={pieData} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h3" fontWeight="bold" sx={{ m: "0 0 0 20px" }}>
          Follow this{" "}
          <Link
            href="https://github.com/andrewlee348/crypto-board"
            target="_blank"
            variant="h3"
            fontWeight="bold"
            rel="noopener noreferrer"
            color={colors.grey[100]}
            underline="hover" // Add this property to show underline on hover
          >
            guide
          </Link>{" "}
          to set up your Kraken API keys and view your Kraken Portfolio
          <Link to={`https://github.com/andrewlee348/crypto-board`}>this</Link>
        </Typography>
      )}
    </Box>
  );
}

export default Portfolio;
