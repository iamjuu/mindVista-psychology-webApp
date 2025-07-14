import React from "react";
import Swal from "sweetalert2";
import {
  ActionButton,
  Actions,
  BasicInfo,
  Company,
  Container,
  Content,
  Description,
  Experience,
  ExperienceDetails,
  ExperienceItem,
  InfoItem,
  Label,
  LeftColumn,
  Logo,
  Name,
  Notes,
  NotesButton,
  NotesTextarea,
  NotesTitle,
  PageWrapper,
  Period,
  ProfileImage,
  ProfileSection,
  RightColumn,
  Role,
  SectionTitle,
  Skill,
  Skills,
  Value,
} from "./style";
import { Pic1 } from "../../assets";
import { Link } from "react-router-dom";
const ProfilePage = () => {
  const skills = ["mindVista", "+91 702-571-5250"];

  const experience = [
    {
      company: "MindVista",
      name: "john",
      period: "Apr 2022 - Present",
      location: "Pune, India",
      age: "30",
      logo: "MV",
    },
    {
      company: "MindVista",
      name: "john",
      period: "Jan 2023 - Present",
      location: "Pune, India",
      age: "31",
      logo: "MV",
    },
    {
      company: "MindVista",
      name: "john",
      period: "Jan 2024 - Present",
      location: "Pune, India",
      age: "32",
      logo: "MV",
    },
  ];

  const handleSendMessage = () => {
    Swal.fire({
      title: "Message Sent!",
      text: "Your message has been sent successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  return (
    <PageWrapper>
      <Container>
        <Content>
          {/* Left Column */}
          <LeftColumn>
            <ProfileSection>
              <ProfileImage src={Pic1} alt="Profile" />
              <Name>Muhammed ajmal</Name>
              <Role>ID Number: 2132e3</Role>
              <Description>
                You can connect with us through Instagram: @mind_vista
                <br />
                WhatsApp Number: +91 123 456 3456
                <br />
                Session Time: 10 AM to 7 PM (Sunday is a holiday)
              </Description>
              <Skills>
                {skills.map((skill, index) => (
                  <Skill key={index}>{skill}</Skill>
                ))}
              </Skills>
              <Notes>
                <NotesTitle>Send message</NotesTitle>
                <NotesTextarea placeholder="Type here" rows="3" />
                <NotesButton onClick={handleSendMessage}>Send</NotesButton>
              </Notes>
            </ProfileSection>
          </LeftColumn>

          {/* Right Column */}
          <RightColumn>
            <BasicInfo>
              <InfoItem>
                <Label>AGE</Label>
                <Value>20 years</Value>
              </InfoItem>
              <InfoItem>
                <Label>PHONE</Label>
                <Value>+91 702-571-5250</Value>
              </InfoItem>
              <InfoItem>
                <Label>Next Section</Label>
                <Value>jan 2 sunday</Value>
              </InfoItem>
              <InfoItem>
                <Label>LOCATION</Label>
                <Value>Ahmedabad, Gujarat</Value>
              </InfoItem>
              <InfoItem>
                <Label>EMAIL</Label>
                <Value>ananyasharma@gmail.com</Value>
              </InfoItem>
            </BasicInfo>
            <Actions>
              <ActionButton>Download History</ActionButton>
              <Link to="https://wa.me/917025715250?text=Hello%2C%20I%20need%20help%20with%20Diprella">
                <ActionButton secondary>Help</ActionButton>
              </Link>
            </Actions>
            <Experience>
              <SectionTitle>History of Consultant</SectionTitle>
              {experience.map((exp, index) => (
                <ExperienceItem key={index}>
                  <Logo color={exp.logo === "MV" ? "#4e95ff" : "#ffb74e"}>
                    {exp.logo}
                  </Logo>
                  <ExperienceDetails>
                    <Company>{exp.company}</Company>
                    <Period>{exp.name}</Period>
                    <Period>{exp.age}</Period>
                    <Period>
                      {exp.period} | {exp.location}
                    </Period>
                  </ExperienceDetails>
                </ExperienceItem>
              ))}
            </Experience>
          </RightColumn>
        </Content>
      </Container>
    </PageWrapper>
  );
};

export default ProfilePage;
