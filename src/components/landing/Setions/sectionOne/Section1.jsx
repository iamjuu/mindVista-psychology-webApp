import { Container, ContainerWrap } from "../../Style";
import { Main } from "./style";
const Section1 = () => {
  return (
    <Container>
      <ContainerWrap>
        <Main>
          <div className="first">
            <div className="left">
              <div>
                <h2>How can I help you?</h2>
                <p>
                  If you’re experiencing any kind of mental illness or problem
                  in relations.
                </p>
                <h5>Explore Programs</h5>
              </div>
              <div>
                <ul>
                  <li>Family Problems</li>
                  <li>Breakups</li>
                  <li>Business Failure</li>
                  <li>Stress Issues</li>
                  <li>Online Sessions</li>
                </ul>
              </div>
            </div>
            <div className="right">
              {" "}
              <h1>Call for Consultation</h1>{" "}
              <p>30 minutes free for the first session.</p>{" "}
              <hr  style={{width:'170px'}}/>
              <h5>
                DIAL NOW <br />
                921-124-9220
              </h5>
            </div>
          </div>

          <div className="second"></div>
          <div className="third"></div>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default Section1;
