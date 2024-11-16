import React from "react";
import { Container, ContainerWrap, FreeContainer } from "../../styles";
import { Main, Left, Right } from "./style";
import { Bgimg, Psychologist } from "../../../../../assets";
const index = () => {
  return (
    <Container>
      <ContainerWrap>
        <Main>
          <Left>
            <div className="first">
              <h1>This program is perfect for you if...</h1>
              <h5>
                Elementum class viverra orci hymenaeos curae;. Rhoncus
                adipiscing. Conubia condimentum quam taciti dictumst, diam proin
                consectetuer leo malesuada fames praesent
              </h5>
              <p>
                Vivamus hendrerit. Quisque donec in luctus tincidunt Aptent,
                ipsum facilisi magna sagittis augue orci mattis tellus hendrerit
                id vivamus hymenaeos. Senectus sociis, hac eleifend nisl et
                ultrices eros. Condimentum ante egestas eget natoque. Nisl
                pretium rhoncus mollis nunc semper pretium libero, nulla
                fringilla nulla est. Tortor blandit torquent etiam, dolor
                euismod, vulputate senectus.
              </p>
              <img src={Bgimg} alt="" />
            </div>
            {/* *************************second************************* */}
            <div className="second">
              <h1>
                Let’s find out why your relationship is being affected by your
                work life.
              </h1>
              <p>
                Aliquam hymenaeos fusce urna massa nec quis, ut, imperdiet
                convallis sapien lacinia aptent justo accumsan. Amet ut curae;
                Maecenas. Nec varius pharetra auctor vel sed velit magna
                nascetur sed eu tellus a egestas egestas euismod hymenaeos donec
                donec ullamcorper litora amet phasellus dui, class at metus
                pretium metus duis pharetra fringilla.
              </p>
              <ul>
                <li>
                  Nullam nostra dis nibh ut sollicitudin vel at eros Erat in
                  ornare risus adipiscing eget suscipit.
                </li>
                <li>
                  Eu mollis dictum metus nisl diam purus ante nam natoque risus
                  netus condimentum etiam pede porttitor leo duis.
                </li>
                <li>
                  Morbi faucibus iaculis faucibus mollis lacus platea velit
                </li>
              </ul>
            </div>
            {/* ************************third**************************** */}
            <div className="third">
              <h1>How therapy can save your relationship?</h1>
              <p>
                Condimentum torquent ornare conubia pede at ridiculus ad
                consequat conubia etiam lacus tortor, ac phasellus ultrices
                sollicitudin nullam fames odio suscipit tristique lacus luctus
                integer Mauris ligula sed velit ullamcorper pellentesque dapibus
                hymenaeos varius congue, libero et mattis. Ligula. Elit.
                Faucibus class euismod non varius taciti sapien nostra euismod.
              </p>
              <div className="img-content">
                <div className="img">
                  <img src={Bgimg} alt="" />
                </div>
                <div className="content">
                  <p>
                    At justo at nulla senectus phasellus porttitor op mattis dui
                    mus per tincidunt Parturient class de blandit, montes nulla.
                    Id habitasse ligula fames etiam. Quam hac etiam primis
                    aptent nullam ligula dolor taciti quam.
                  </p>
                  <ul>
                    <li>
                      Nullam nostra dis nibh ut sollicitudin vel at eros Erat in
                      ornare risus adipiscing eget suscipit.
                    </li>
                    <li>
                      Eu mollis dictum metus nisl diam purus ante nam natoque
                      risus netus condimentum etiam pede porttitor leo duis.
                    </li>
                    <li>
                      Morbi faucibus iaculis faucibus mollis lacus platea velit
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* *************************four******************************* */}
            <div className="four">
              <h1>Our Therapy Process</h1>
              <p>
                Magnis hendrerit tempor commodo Venenatis quam nec nec. Purus
                proin egestas mi donec dictumst eget rhoncus porttitor diam diam
                placerat etiam ultricies. Morbi id feugiat sociosqu vel.
                Bibendum nonummy hac. Varius. Sapien. Sociis nec per, sem dui
                posuere in dis habitasse. Nec ultricies. Nec torquent posuere
                habitasse gravida dictum purus.
  
              </p>

              <h5>Call +1 921 124 9220 and book an appointment now.</h5>
            </div>
          </Left>

          <Right></Right>
        </Main>
      </ContainerWrap>
    </Container>
  );
};

export default index;
