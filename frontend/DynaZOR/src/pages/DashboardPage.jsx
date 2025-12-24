import { useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Navbar from "../components/Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { getUserID } = useAuth();
  const ID = getUserID();

  useEffect(() => {
    if (!ID) {
      navigate("/home");
    }
  }, [ID, navigate])

  return (
    <>
      <Navbar userID={ID}/>
      <Dashboard userID={ID}/>
    </>
  )
};

export default DashboardPage;
