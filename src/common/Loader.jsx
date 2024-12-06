import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const SpinnerWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSvg = styled.svg`
  width: 150px;
  height: 150px;
`;

const BackgroundPath = styled.path`
  opacity: 0.05;
  fill: none;
  stroke: #000000;
  stroke-width: 3;
`;

const ProgressPath = styled.path`
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 60, 310;
  will-change: stroke, stroke-dashoffset;
  stroke: ${(props) => props.stroke};
  stroke-dashoffset: ${(props) => props.offset};
`;

const lerp = (x, x0, x1, y0, y1) => {
  const t = (x - x0) / (x1 - x0);
  return y0 + t * (y1 - y0);
};

const lerpColor = (x, x0, x1, y0, y1) => {
  const b0 = y0 & 0xff;
  const g0 = (y0 & 0xff00) >> 8;
  const r0 = (y0 & 0xff0000) >> 16;

  const b1 = y1 & 0xff;
  const g1 = (y1 & 0xff00) >> 8;
  const r1 = (y1 & 0xff0000) >> 16;

  const r = Math.floor(lerp(x, x0, x1, r0, r1));
  const g = Math.floor(lerp(x, x0, x1, g0, g1));
  const b = Math.floor(lerp(x, x0, x1, b0, b1));

  return `#${("00000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6)}`;
};

const Spinner = () => {
  const [stroke, setStroke] = useState("#ededed");
  const [offset, setOffset] = useState(445);
  const animStartRef = useRef(null);
  const animIdRef = useRef(null);

  useEffect(() => {
    animStartRef.current = Date.now();
    const animate = () => {
      const pathWidth = 372;
      const speed = 2;
      const colorTable = [
        [0.0, 0xf15a31],
        [0.2, 0xffd31b],
        [0.33, 0xa6ce42],
        [0.4, 0x007ac1],
        [0.45, 0x007ac1],
        [0.55, 0x007ac1],
        [0.6, 0x007ac1],
        [0.67, 0xa6ce42],
        [0.8, 0xffd31b],
        [1.0, 0xf15a31],
      ];

      const currentAnim = Date.now();
      const t = ((currentAnim - animStartRef.current) % 6000) / 6000;
      const colorValue = lerpColor(t, 0, 1, colorTable[0][1], colorTable[colorTable.length - 1][1]);

      let newOffset = offset - speed;
      if (newOffset < 0) newOffset = pathWidth;

      setStroke(colorValue);
      setOffset(newOffset);

      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animIdRef.current);
    };
  }, [offset]);

  return (
    <SpinnerWrapper>
      <StyledSvg viewBox="0 0 115 115" preserveAspectRatio="xMidYMid meet">
        <BackgroundPath d="M 85 85 C -5 16 -39 127 78 30 C 126 -9 57 -16 85 85 C 94 123 124 111 85 85 Z" />
        <ProgressPath
          stroke={stroke}
          offset={offset}
          d="M 85 85 C -5 16 -39 127 78 30 C 126 -9 57 -16 85 85 C 94 123 124 111 85 85 Z"
        />
      </StyledSvg>
    </SpinnerWrapper>
  );
};

export default Spinner;
