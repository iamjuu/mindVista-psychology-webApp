
import styled from "styled-components";
 export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fde2e4, #cce4f7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const Content = styled.div`
  display: flex;
  padding: 24px;
  gap: 32px;
  flex-wrap: wrap;
`;

export const LeftColumn = styled.div`
  flex: 1;
  min-width: 300px;
`;

export const RightColumn = styled.div`
  flex: 2;
`;

export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  text-align: center;
`;

export const ProfileImage = styled.img`
margin-top: 10px;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 16px;
`;

export const Name = styled.h2`
  font-size: 20px;
  color: #333;
`;

export const Role = styled.p`
  color: #666;
  margin-bottom: 16px;
`;

export const Description = styled.p`
  color: #888;
  margin-bottom: 24px;
  line-height: 1.5;
`;

export const Skills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Skill = styled.span`
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #555;
`;

export const Notes = styled.div`
  margin-top: 24px;
`;

export const NotesTitle = styled.h3`
  margin-bottom: 8px;
  font-size: 16px;
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
`;

export const NotesButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

export const BasicInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

export const InfoItem = styled.div`
  flex: 1;
  min-width: 150px;
`;

export const Label = styled.p`
  font-weight: bold;
  color: #666;
  font-size: 16px;
`;

export const Value = styled.p`
  font-size: 16px;
  color: #333;
`;

export const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  border: ${(props) => (props.secondary ? "1px solid #007bff" : "none")};
  background: ${(props) => (props.secondary ? "transparent" : "#007bff")};
  color: ${(props) => (props.secondary ? "#007bff" : "white")};
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.secondary ? "#e0f2ff" : "#0056b3")};
  }
`;

export const Experience = styled.div``;

export const SectionTitle = styled.h3`
  margin-bottom: 16px;
  font-weight: bold;
`;

export const ExperienceItem = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

export const Logo = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

export const ExperienceDetails = styled.div``;

export const Company = styled.h4`
  font-size: 16px;
  color: #007bff;
`;

export const Period = styled.p`
  font-size: 12px;
  color: #666;
`;
