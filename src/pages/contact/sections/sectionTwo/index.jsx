import React, { useState } from "react";
import { Container, ContainerWrap } from "../../styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Main,
  FormContainer,
  StyledForm,
  FormLabel,
  FormInput,
  FormButton,
} from "./style";
import { Bgimg } from "../../../../assets";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Form submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="form">
            <FormContainer>
              <StyledForm onSubmit={handleSubmit}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <FormLabel htmlFor="message">Message</FormLabel>
                <FormInput
                  as="textarea"
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <FormButton type="submit">Submit</FormButton>
              </StyledForm>
            </FormContainer>
          </div>

          <div className="content">
            <img src={Bgimg} alt="Background" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        </Main>
      </ContainerWrap>
      <ToastContainer />
    </Container>
  );
};

export default Index;
