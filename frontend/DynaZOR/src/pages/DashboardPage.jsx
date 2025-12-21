import { useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
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

  return <Dashboard userID={ID}/>;
};

export default DashboardPage;
