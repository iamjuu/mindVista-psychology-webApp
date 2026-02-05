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




    function PsychologyCarousel() {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % psychologyContent.length);
      }, 3500);
  
      return () => clearInterval(timer);
    }, []);
  
    return (
      <section  className="w-full py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="flex gap-6   animate-carousel">
            {[...psychologyContent, ...psychologyContent].map((item, i) => (
              <div
                key={i}
                className="min-w-[320px] md:min-w-[360px] bg-white/5 backdrop-blur-md border rounded-2xl p-6 shadow-lg"
              >
                <p className="text-base md:text-lg leading-relaxed opacity-90">
                  {item.text}
                </p>

                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    
    );
  }

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);

  // Memoize WhatsApp URL to avoid recalculation on every render
  const whatsappUrl = useMemo(() => {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || "";
    const text = encodeURIComponent("Hi MindVista, I need help.");
    return `https://wa.me/${number}?text=${text}`;
  }, []);



  const psychologyContent = [
    {
      text: "Psychology is the scientific study of the mind and behavior, helping us understand thoughts, emotions, and actions.",
      title: "Psychology",
      subtitle: "Introduction",
    },
    {
      text: "Mental health includes emotional, psychological, and social well-being, influencing how we think, feel, and act.",
      title: "Mental Health",
      subtitle: "Core Concept",
    },
    {
      text: "Cognitive psychology explores mental processes such as perception, memory, learning, and problem-solving.",
      title: "Cognitive Psychology",
      subtitle: "Branch of Psychology",
    },
    {
      text: "Behavioral psychology focuses on observable behaviors and how they are learned through interaction with the environment.",
      title: "Behavioral Psychology",
      subtitle: "Learning & Behavior",
    },
    {
      text: "Developmental psychology studies how people grow and change throughout their lifespan, from infancy to old age.",
      title: "Developmental Psychology",
      subtitle: "Human Growth",
    },
    {
      text: "Clinical psychology focuses on diagnosing and treating mental, emotional, and behavioral disorders.",
      title: "Clinical Psychology",
      subtitle: "Therapy & Treatment",
    },
    {
      text: "Social psychology examines how individuals are influenced by social interactions, groups, and cultural norms.",
      title: "Social Psychology",
      subtitle: "Society & Behavior",
    },
    {
      text: "Positive psychology emphasizes strengths, well-being, happiness, and what helps people thrive in life.",
      title: "Positive Psychology",
      subtitle: "Well-Being",
    },
    {
      text: "Neuropsychology explores the relationship between the brain, nervous system, and behavior.",
      title: "Neuropsychology",
      subtitle: "Brain & Behavior",
    },
    {
      text: "Educational psychology studies how people learn and how teaching methods can improve learning outcomes.",
      title: "Educational Psychology",
      subtitle: "Learning Science",
    },
  ];
  
  
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

        <section id="solution" className="flex md:mt-24 flex-col">
          <About />
          <Support />
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
          {/* <Contact /> */}
        </section>
        <section id="contect">
        <PsychologyCarousel/>
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
