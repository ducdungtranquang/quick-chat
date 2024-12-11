import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import { REACT_APP_LOCALHOST_KEY } from "../utils/constant";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [isContactsVisible, setIsContactsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data?.username);
      setCurrentUserImage(data?.avatarImage);
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
    setIsContactsVisible(false);
  };

  return (
    <>
      {currentUserImage && (
        <Container>
          <div className="brand">
            <h3>Quick Chat</h3>
            <div
              className="hamburger"
              onClick={() => setIsContactsVisible(!isContactsVisible)}
            >
              &#9776;
            </div>
          </div>
          <div className={`contacts ${isContactsVisible ? "visible" : ""}`}>
            {contacts && contacts?.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
            <Logout />
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 15% 70% 15%;
  background-color: #080420;
  position: relative;
  @media screen and (max-width: 719px) {
    grid-template-rows: 30% 55% 15%;
  }

  .brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    h3 {
      color: white;
      text-transform: uppercase;
    }
    .hamburger {
      display: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
    }
    @media screen and (max-width: 719px) {
      .hamburger {
        display: block;
      }
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    transition: transform 0.3s ease-in-out;
    transform: translateX(-100%);
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 80%;
    background-color: #080420;
    z-index: 10;
    padding-top: 1rem;

    &.visible {
      transform: translateX(0); 
      padding-top: 5rem
    }

    @media screen and (min-width: 720px) {
      position: static;
      transform: translateX(0);
      width: 100%;
    }

    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }

    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (max-width: 1080px) {
      gap: 2rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
