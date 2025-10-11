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
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || ""; // E.164 format, e.g., 15551234567
  const whatsappText = encodeURIComponent("Hi MindVista, I need help.");
  const [isBouncing, setIsBouncing] = useState(false);

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

  useEffect(() => {
    const triggerBounce = () => {
      setIsBouncing(true);
      const timeoutId = setTimeout(() => setIsBouncing(false), 1200);
      return timeoutId;
    };

    // Start with an initial bounce, then repeat every 10 seconds
    let timeoutId = triggerBounce();
    const intervalId = setInterval(() => {
      timeoutId = triggerBounce();
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
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
        <div id="Doctors">
          <Docters />
        </div>

        <div id="project">{/* <Support /> */}</div>
        <div>
          <Counter />
        </div>
        <div id="Reviews">
          <Carousel items={items} />
        </div>
        <div id="contect">
          <Contact />
        </div>
        <div id="Services">
          <Service />
        </div>
        <div>
          <QuickAnswer />
        </div>
        <Footer />
      </div>
      {/* Floating WhatsApp button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`fixed z-50 bottom-24 right-5 transition-transform hover:scale-105 active:scale-95 ${
          isBouncing ? "animate-bounce" : ""
        }`}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-16  drop-shadow-xl"
        />
      </a>
    </div>
  );
}
