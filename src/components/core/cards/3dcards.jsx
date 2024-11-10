import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { CardBody, CardContainer, CardItem } from "../../../components/ui/cards/3dcards";

export function ThreeDCardDemo({ h1, img, p, link }) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-[#E9E9E9] dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
          {h1}
        </CardItem>
        <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {p}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img src={img} alt="Card Item" />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link} // Use Link component
            to={link} // Replace href with to
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            About →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Register
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
