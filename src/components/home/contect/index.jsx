"use client";
import { useEffect } from "react";
import api from "../../../instance";
import { Clock, Compass } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Index = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    AOS.refresh();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      title: formData.get("title"),
      description: formData.get("description"),
      rating: Number(formData.get("rating")),
    };

    try {
      await api.post("/reviews", payload);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: {
              type: "success",
              title: "Review submitted",
              message: "Thanks for your feedback!",
            },
          })
        );
      }
      form.reset();
      window.location.reload();
    } catch {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: {
              type: "error",
              title: "Submission failed",
              message: "Please try again.",
            },
          })
        );
      }
    }
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left content */}
        <div data-aos="fade-up" data-aos-delay={0}>
          <div className="mb-6">
            <h2 className="text-xl font-[400] text-black">
              Share Your Details
            </h2>
          </div>
          <p className="text-gray-700 text-[14px] leading-7 mb-8">
            Have questions about our psychological services?
          </p>
          <p className="text-gray-700 leading-7 mb-8">
            Whether you're seeking therapy, assessments, or wellness programs,
            we're here to support you. Reach out and let us guide you toward
            better mental well-being.
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <div
              className="flex items-start gap-4"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              <div className="h-12 w-12 rounded-xl bg-[#E53935] flex items-center justify-center shrink-0">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <p className="font-semibold mb-1">Quick Response</p>
                <p className="text-gray-700 text-sm leading-6">
                  We prioritize timely support so you can get the help you need
                  without delays.
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-4"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              <div className="h-12 w-12 rounded-xl bg-[#E53935] flex items-center justify-center shrink-0">
                <Compass className="text-white" size={24} />
              </div>
              <div>
                <p className="font-semibold mb-1">Guided Support</p>
                <p className="text-gray-700 text-sm leading-6">
                  Receive clear, compassionate guidance at every step of your
                  wellness journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right content - Form */}
        <div className="w-full" data-aos="fade-up" data-aos-delay={150}>
          <div
            className="flex justify-end mb-6"
            data-aos="fade-up"
            data-aos-delay={250}
          >
            <button className="inline-flex items-center gap-2 bg-[#E53935] text-white px-5 py-3 rounded-full shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
              Get in Touch
            </button>
          </div>

          <div className="mb-6" data-aos="fade-up" data-aos-delay={300}>
            <p className="text-gray-700 leading-7">
              Let’s Start the Conversation — Your Well-Being Matters.
            </p>
            <p className="text-gray-700 leading-7">
              Whether you’re seeking therapy, mental health assessments, or
              emotional support, our team of professionals is here to listen and
              guide you. Share your details, and we’ll connect with you to take
              the next step toward better mental health.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex gap-4 justify-between">
              <div className="w-full" data-aos="fade-up" data-aos-delay={350}>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full border border-gray-200 rounded-md h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFCB05]"
                  required
                />
              </div>
              <div className="w-full" data-aos="fade-up" data-aos-delay={450}>
                <label className="block text-sm mb-2">Rating</label>
                <select
                  name="rating"
                  className="w-full border border-gray-200 rounded-md h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFCB05]"
                  required
                >
                  <option value="">Select rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay={500}>
              <label className="block text-sm mb-2">Message</label>
              <textarea
                name="description"
                placeholder="Write your review here"
                rows={6}
                className="w-full border border-gray-200 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFCB05]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E53935] text-white h-12 rounded-md"
              data-aos="fade-up"
              data-aos-delay={550}
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Index;
