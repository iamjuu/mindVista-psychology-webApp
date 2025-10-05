
import Navbar from "../../../components/home/navbar";
import Hero from "../../../components/home/hero";
import About from "../../../components/home/about";
import Support from "../../../components/home/support";
import { MainBackgroundImage } from "../../../assets";
import Service from "../../../components/home/service";
import Footer from "../../../components/home/footer";
import QuickAnswer from "../../../components/home/quickanswer";
import Contact from "../../../components/home/contect";
export default function Home() {
  return (
    <div
    
      className="min-h-screen  px-2 "
    >
      <div className="flex py-4  gap-3 flex-col ">
        <div>
          <Navbar />
        </div>
        <div id="hero">
          <Hero />
        </div>

        <div className="flex flex-col" id="solution">
          <About />
                    <Support />

        </div>
        <div id="project">
          {/* <Support /> */}
        </div>
        <div id="blog">
          {/* <Carousel items={items} /> */}
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
