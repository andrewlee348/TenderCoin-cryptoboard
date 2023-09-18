import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";

function formatNumberWithCommas(value) {
  return value.toLocaleString(); // Format number with commas
}

function MostPopular() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Use the fetch API to make the HTTP request
    fetch("https://crypto-board-1-399420.uc.r.appspot.com/get_mostpopular")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const columns = [
    {
      field: "image",
      headerName: "Logo",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.name}
          style={{ width: "35px", height: "35px" }}
        />
      ),
    },
    { field: "symbol", headerName: "Symbol", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "current_price",
      headerName: "Price (USD)",
      width: 150,
      valueFormatter: (params) => formatNumberWithCommas(params.value),
    },
    {
      field: "market_cap",
      headerName: "Market Cap (USD)",
      width: 200,
      valueFormatter: (params) => formatNumberWithCommas(params.value),
    },
    {
      field: "circulating_supply",
      headerName: "Circulating Supply",
      width: 200,
      valueFormatter: (params) => formatNumberWithCommas(params.value),
    },
    { field: "total_supply", headerName: "Total Supply", width: 200 },
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
          title="MOST POPULAR CRYPTO"
          subtitle="25 of the Most Popular Crypto"
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

export default MostPopular;
