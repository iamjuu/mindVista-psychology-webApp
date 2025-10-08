import { useState, useEffect, useRef, useCallback } from 'react';

const targetCounts = {
  happyClients: 512,
  totalProject: 85,
  awardsWon: 12,
  teamMembers: 7
};

const Counter = () => {
  const [counts, setCounts] = useState({
    happyClients: 0,
    totalproject: 0,
    awardsWon: 0,
    teamMembers: 0
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  const startAnimation = useCallback(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    const animateCount = (key, target) => {
      let current = 0;
      const increment = target / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepDuration);
    };

    // Start animations with slight delays for staggered effect
    setTimeout(() => animateCount('happyClients', targetCounts.happyClients), 100);
    setTimeout(() => animateCount('totalproject', targetCounts.totalProject), 200);
    setTimeout(() => animateCount('awardsWon', targetCounts.awardsWon), 300);
    setTimeout(() => animateCount('teamMembers', targetCounts.teamMembers), 400);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            startAnimation();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully in view
      }
    );

    const currentRef = counterRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, startAnimation]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
  };

  return (
    <section ref={counterRef} className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Happy Clients */}
          <div className="text-center group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-orange-100 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-2xl md:text-3xl font-[500] text-black mb-2">
                  {formatNumber(counts.happyClients)}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base font-medium">
              Happy Clients
            </p>
          </div>

          {/* Total Rooms */}
          <div className="text-center group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-orange-100 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-2xl md:text-3xl font-[500] text-black mb-2">
                  {counts.totalproject}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base font-medium">
              Total Project
            </p>
          </div>

          {/* Awards Won */}
          <div className="text-center group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-orange-100 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-2xl md:text-3xl font-[500] text-black mb-2">
                  {counts.awardsWon}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base font-medium">
              Awards Won
            </p>
          </div>

          {/* Team Members */}
          <div className="text-center group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-orange-100 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-2xl md:text-3xl font-[500] text-black mb-2">
                  {counts.teamMembers}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base font-medium">
              Team Members
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;
