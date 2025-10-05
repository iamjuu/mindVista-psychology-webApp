
import Navbar from "../../../components/home/navbar";
import Hero from "../../../components/home/hero";
import About from "../../../components/home/about";
import Support from "../../../components/home/support";
import Carousel from "../../../components/home/caroseal";
import { MainBackgroundImage } from "../../../assets";
import Service from "../../../components/home/service";
import Footer from "../../../components/home/footer";
import QuickAnswer from "../../../components/home/quickanswer";
import Contact from "../../../components/home/contect";
import { Bolt, Users, LineChart, Clock, Ticket, Database } from "lucide-react";
export default function Home() {
  const items = [
    {
      icon: <Bolt />,
      title: "Increased Productivity",
      description:
        "Streamline operations with reliable IT and infrastructure solutions that keep your business running without downtime.",
    },
    {
      icon: <Users />,
      title: "Better Customer Experience",
      description:
        "Deliver smarter, faster, and more secure services that enhance satisfaction and build long-term loyalty.",
    },
    {
      icon: <LineChart />,
      title: "Scalability & Growth",
      description:
        "Flexible solutions that grow with your business, supporting expansion across Dubai and the UAE.",
    },

    {
      icon: <Clock />,
      title: "24/7 Availability",
      description:
        "Round-the-clock support and monitoring ensure your business is always connected and protected.",
    },
    {
      icon: <Ticket />,
      title: "Cost Reduction",
      description:
        "Cut operational costs with efficient, scalable systems designed to maximize ROI.",
    },
    {
      icon: <Database />,
      title: "Data-Driven Insights​",
      description:
        "Gain real-time visibility and smarter decision-making through connected, automated systems.",
    },
  ];
  return (
    <div
      style={{
        backgroundImage: `url(${MainBackgroundImage.src})`,
        backgroundPosition: "bottom",
        backgroundSize: "full",
        backgroundRepeat: "repeat",
      }}
      className="min-h-screen  px-2 "
    >
      <div className="flex flex-col ">
        <div>
          <Navbar />
        </div>
        <div id="hero">
          <Hero />
        </div>

        <div id="solution">
          <About />
        </div>
        <div id="project">
          <Support />
        </div>
        <div id="blog">
          <Carousel items={items} />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <div id="about">
          <Service />
        </div>
        <div>
          <QuickAnswer />
        </div>
        <Footer />
      </div>
    </div>
  );
}
