import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { REACT_APP_LOCALHOST_KEY } from "../utils/constant";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(REACT_APP_LOCALHOST_KEY)
    )?.username;
    setUserName(data);
  }, []);
  return (
    <Container>
      <img src={Robot} alt="robot" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 150px;
    width: 150px;
    object-fit: cover;
  }
  span {
    color: #4e0eff;
  }
`;
