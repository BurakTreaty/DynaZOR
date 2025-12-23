import { useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Navbar from "../components/Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userID = state?.userID;
  const ID = localStorage.getItem("userID");

  useEffect(() => {
    if (!userID) {
    navigate("/login");
    }
  }, [])

  return (
    <>
      <Navbar userID={ID}/>
      <Dashboard userID={ID}/>
    </>
  )
};

export default DashboardPage;
