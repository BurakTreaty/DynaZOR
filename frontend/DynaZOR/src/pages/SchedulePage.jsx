import { useEffect } from "react";
import Schedule from "../components/Schedule/Schedule"
import Navbar from "../components/Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

const SchedulePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // prefer the target user's ID from navigation state; fall back to current user
  const targetUserID = state?.userID || localStorage.getItem("userID");

  useEffect(() => {
    if (!targetUserID) {
      navigate("/login");
    }
  }, [targetUserID, navigate]);

  return (
    <>
      <Navbar userID={localStorage.getItem("userID")}/>
      <Schedule userID={targetUserID} />
    </>
  )
}

export default SchedulePage