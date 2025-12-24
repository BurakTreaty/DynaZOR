import { useEffect } from "react";
import Profile from "../components/Profile/Profile";
import Navbar from "../components/Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
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
      <Profile/>
    </>
  )
};

export default ProfilePage;
