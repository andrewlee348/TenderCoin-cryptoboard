import { Box, Typography, useTheme } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
// import { mockDataTeam } from "../../data/mockData";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlinedIcon";
// import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlinedIcon";
import Header from "../../components/Header";

const MostPopular = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
  ];
  return (
    <Box
      m="20px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Header title="MOST POPULAR" subtitle="Trending Crypto"></Header>
      {/* <Box>
        <DataGrid rows={mockData} columns={columns} />
      </Box> */}
    </Box>
  );
};

export default MostPopular;
