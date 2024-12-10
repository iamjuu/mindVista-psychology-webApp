import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, ContainerWrap } from "../../styles";
import { Main, Left, Right } from "./style";
import Btn from "../../../../components/core/button";
import Navbar from "../../../../components/navbar";
import Footer from "../../../../components/footer";
import {Bgimg} from '../../../../assets'

// Program data mapping
const PROGRAM_DATA_MAP = {
  MindfulnessMeditation: "MindfulnessMeditation",
  grief: "Grief",
  self: "Self",
  "kids-family": "kids",
  "future-planning": "Life",
  "old-age": "old",
};

const ProgramContent = ({ ProgramSectionleft, ProgramSectionRight }) => {
  const { programId } = useParams();
  const [programData, setProgramData] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    const dataKey = PROGRAM_DATA_MAP[programId];
    if (dataKey && ProgramSectionleft[dataKey]) {
      setProgramData(ProgramSectionleft[dataKey][0]);
    }
  }, [programId, ProgramSectionleft]);

  return (
    <>
      <Navbar />

      <Container>
        <ContainerWrap>
          <Main>
            {/* Dynamic Left Section */}
            <Left>
              {programData ? (
                <>
                  <div className="first">
                    <h1>{programData.second[0].h1}</h1>
                    <h5>{programData.second[0].h5}</h5>
                    <p>{programData.second[0].p}</p>
                    <div style={{width:'500px'}}>
                    <img src={programData.second[0].img} alt="" />

                    </div>
                  </div>

                  <div className="second">
                    <h1>{programData.third[0].h1}</h1>
                    <p>{programData.third[0].p}</p>
                    <ul>
                      {programData.third[0].points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="third">
                    <h1>{programData.four[0].h1}</h1>
                    <p>{programData.four[0].p}</p>
                    <div className="img-content">
                      <div className="img">
                        <img src={programData.four[0].img} alt="" />
                      </div>
                      <div className="content">
                        <p>{programData.four[0].h5}</p>
                        <ul>
                          {programData.four[0].point.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="four">
                    <h1>{programData.five[0].h1}</h1>
                    <p>{programData.five[0].p}</p>
                    <h5>Call +1 921 124 9220 and book an appointment now.</h5>
                  </div>
                </>
              ) : (
                <div className="p-4">Select a program from the menu...</div>
              )}
            </Left>

            {/* Static Right Section */}
            <Right>
              <div className="first">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <h1>{ProgramSectionRight.first[0].h1}</h1>
                  <hr style={{ width: "125px" }} />
                </div>
                <ul>
                  {ProgramSectionRight.first[0].point.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "15px",
                        backgroundColor:
                          hoverIndex === index ? "#333" : "#f9f7f7",
                        color: hoverIndex === index ? "#f7f7f7" : "#000",
                        transition:
                          "background-color 0.3s ease, color 0.3s ease",
                      }}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="second">
                <div>
                  <h1>{ProgramSectionRight.second[0].h1}</h1>
                  <h5>{ProgramSectionRight.second[0].h5}</h5>
                </div>
                <div>
                  <input type="text" name="" id="" />
                  <Btn  btnName={'SUBSCRIBE NOW'}  bg={'#a57355'} />
                </div>
              </div>

              <div className="third">
          <div>
            <img src={Bgimg} alt="" />
          </div>
              </div>
            </Right>
          </Main>
        </ContainerWrap>
      </Container>
      <Footer />
    </>
  );
};

export default ProgramContent;
