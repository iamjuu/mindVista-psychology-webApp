import { useEffect, useState, useMemo } from "react";
import Navbar from "../../../components/home/navbar";
import Hero from "../../../components/home/hero";
import About from "../../../components/home/about";
import Support from "../../../components/home/support";
import Carousel from "../../../components/home/caroseal";
import Footer from "../../../components/home/footer";
import QuickAnswer from "../../../components/home/quickanswer";
import Contact from "../../../components/home/contect";
import Counter from "../../../components/home/counter";
import Docters from "../../../components/home/doctors";
import { CustomSpinner } from "../../../common/Loader";
import api from "../../../instance";

export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);

  // Memoize WhatsApp URL to avoid recalculation on every render
  const whatsappUrl = useMemo(() => {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || "";
    const text = encodeURIComponent("Hi MindVista, I need help.");
    return `https://wa.me/${number}?text=${text}`;
  }, []);




  
  // Fetch reviews data
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
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // WhatsApp button bounce animation
  useEffect(() => {
    const triggerBounce = () => {
      setIsBouncing(true);
      return setTimeout(() => setIsBouncing(false), 1200);
    };

    // Initial bounce after a short delay
    const initialTimeout = setTimeout(triggerBounce, 500);
    
    // Repeat bounce every 10 seconds
    const intervalId = setInterval(triggerBounce, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(initialTimeout);
    };
  }, []);

  // Show loader while initial data is loading
  if (isLoading) {
    return <CustomSpinner />;
  }

  return (
    <div className="min-h-screen px-2">
      <div className="flex py-4 gap-3 flex-col">
        <Navbar />

        <section id="hero">
          <Hero />
        </section>

        <section id="solution" className="flex flex-col">
          <Support />
          <About />
        </section>

        <section id="Doctors">
          <Docters />
        </section>

        <Counter />

        <section id="Reviews">
          <Carousel items={items} />
        </section>

        <QuickAnswer />

        <section id="contect">
          <Contact />
        </section>

        <Footer />
      </div>

      {/* Floating WhatsApp button */}
      <a
        href={whatsappUrl}
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
          className="w-16 drop-shadow-xl"
        />
      </a>
    </div>
  );
}
