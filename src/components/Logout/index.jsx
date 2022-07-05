import React, { useState, useEffect } from "react";

import { Auth } from "aws-amplify";

import { useNavigate } from "react-router-dom";
import { Navigate, Route } from "react-router-dom";


function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
       Auth.signOut();
    } catch (e) {

      console.log(e);
    } finally {
      console.log("Logout finally ");
      navigate("/");
    }
  }, []);

  return (
    null
  );
}

export default Logout;
