import Navbar from "../../../components/home/navbar";
import Hero from "../../../components/home/hero";
import About from "../../../components/home/about";
import Support from "../../../components/home/support";
import Service from "../../../components/home/service";
import Carousel from "../../../components/home/caroseal";
import Footer from "../../../components/home/footer";
import QuickAnswer from "../../../components/home/quickanswer";
import Contact from "../../../components/home/contect";
import Counter from "../../../components/home/counter";
import Docters from "../../../components/home/doctors";
import { useEffect, useState } from "react";
import api from "../../../instance";
export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/reviews?limit=20");
        if (!isMounted) return;
        const mapped = data.map((r) => ({
          src: r.avatarUrl || "/x.png",
          name: r.name,
          title: r.title,
          description: r.description,
          rating: "⭐".repeat(Math.max(1, Math.min(5, Number(r.rating) || 0))),
        }));
        setItems(mapped);
      } catch {
        // ignore for now
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen  px-2 ">
      <div className="flex py-4  gap-3 flex-col ">
        <div>
          <Navbar />
        </div>
        <div id="hero">
          <Hero />
        </div>

        <div className="flex flex-col" id="solution">
          <Support />
          <About />
        </div>
        <div>
          <Docters />
        </div>

        <div id="project">{/* <Support /> */}</div>
        <div>
          <Counter />
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
