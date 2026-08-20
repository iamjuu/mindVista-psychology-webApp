import React, { useState, useEffect } from 'react';
import HeaderNav from '../../../components/common/HeaderNav';
import Footer from '../../../components/common/Footer';
import BookingModal from '../../../components/booking/BookingModal';
import api from '../../../instance';

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctors');
      if (res.data && res.data.doctors && res.data.doctors.length > 0) {
        setDoctors(res.data.doctors);
      } else {
        setDefaultDoctors();
      }
    } catch (err) {
      console.warn('Backend offline, using fallback doctors:', err.message);
      setDefaultDoctors();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultDoctors = () => {
    setDoctors([
      {
        _id: 'doc_alisha',
        name: 'Dr. Alisha Verma',
        professionalType: 'AYURVEDA_DOCTOR',
        specialization: 'Holistic Psychiatrist & Ayurvedic Healer',
        qualifications: ['BAMS', 'MD (Ayurveda)'],
        experience: 12,
        rating: 4.9,
        specialities: ['Mindfulness', 'Dietary alignment', 'Stress Management'],
        bio: 'Specializing in integrating cognitive behavioral therapies with ancient Ayurvedic lifestyle adjustments to treat chronic stress and mild anxiety naturally.',
        profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK9hRci2nolXvUCiPNv0yaUgYfXdk1y-dh9KJ6upAW8ZVvxNj3cBkpkMN2qOy_l7PQ9Y50A1pvxzcEBNxD7bq_aKQAvejEHQ7gXQ5NCWOoq54zC9r-qSfWpZ5IE-nrmVxb2qY3-Un5mJMcig2Y4CAZEvkPSjoS-XQtqKtJRL-wWutUNrixNKwS1tVGocwo-hwuFIpuDNsWjgFTGyEJYHFna4pdb5d3QMm574KYJOAaZ491vXhJMB2gNw',
        consultation: { durationMinutes: 45, price: 599 },
      },
      {
        _id: 'doc_rohan',
        name: 'Dr. Rohan Mehta',
        professionalType: 'PSYCHOLOGIST',
        specialization: 'Clinical Psychologist',
        qualifications: ['M.Phil (NIMHANS)', 'CBT Specialist'],
        experience: 8,
        rating: 4.9,
        specialities: ['Anxiety', 'Depression', 'Work Stress'],
        profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXGc9u5ClwV8jRlAWu4-nk2l-WrtRB1ek2kpmt_bEm2cZfGPxVqqjnJUy3PncV2qfrWmQa6hwTY7o7hdpLDsyaKmk1rPUeebMf1l-lI-_oIyV9bClpEky6TvdRDWSTurmk79Cpme6E_EZTIiM5sFnbXJGCZ7FY-W8F8mxnHv_IZIUHekXKE6mf8dWFGDtRFA8CWYwvFcp72swsCFVIWkbCY2J9G08YPZxHiWfkDCKVwAV4WD3xsVCGzg',
        consultation: { durationMinutes: 45, price: 599 },
      },
      {
        _id: 'doc_neha',
        name: 'Vaidya Neha Sharma',
        professionalType: 'AYURVEDA_DOCTOR',
        specialization: 'Ayurvedic Consultant',
        qualifications: ['BAMS', 'Panchakarma Expert'],
        experience: 10,
        rating: 4.8,
        specialities: ['Gut Health', 'Stress Relief', 'Holistic Sleep'],
        profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALuZz3xJ2EnKE7U8lIrfGGL5Nki6srJE2CZlI6BtVBhBr3nEyvFmOgl12E173d2YI9dptl_8AUtMRdOmMwXH0sricM4bqv2Cnw3vCwJFnhak7Qht26A_1NoP_kfAXjYsE0eegjOkNTegAHX1X2ooFfIMSryVqqIBfnzXIupm7-Hx09JhVc7vEKv4cFYc0gAyu27004ocMmdSuE6t_5l5g8_xLQSuYan4LZ3rQdvvbLxCYzsz8TkBe-iA',
        consultation: { durationMinutes: 45, price: 599 },
      },
    ]);
  };

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  const featuredDoctor = doctors[0] || {};
  const secondaryDoctors = doctors.slice(1, 3);

  return (
    <div className="font-sans bg-surface text-on-surface antialiased overflow-x-hidden relative min-h-screen flex flex-col">
      {/* Botanical Background Accent */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none botanical-accent z-0" />

      <HeaderNav />

      <main className="w-full max-w-container-max mx-auto px-4 sm:px-8 lg:px-16 relative z-10 flex-grow">
        
        {/* 1. HERO SECTION (Concept C: Mind + Nature) */}
        <section className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 flex flex-col gap-6 pr-0 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/30 text-secondary rounded-full w-max text-xs sm:text-sm font-medium border border-secondary-container/50">
              <span className="material-symbols-outlined text-[18px]">spa</span>
              <span>Mind + Nature Approach</span>
            </div>

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-[48px] lg:leading-[56px] text-on-surface font-bold tracking-tight">
              Find clarity through <span className="text-primary italic font-serif opacity-95">ancient wisdom</span> &amp; modern science.
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant max-w-lg leading-relaxed">
              Discover personalized psychological care rooted in Ayurvedic principles. Realign your mind and body with tailored wellness plans designed for lasting tranquility.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('experts');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-sm text-label-sm hover:opacity-90 transition-all interactive-shadow flex items-center justify-center gap-2 shadow-[0px_4px_12px_rgba(74,101,78,0.2)]"
              >
                <span>Start Your Journey</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('experts');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-transparent text-primary border border-primary/20 rounded-xl font-label-sm text-label-sm hover:bg-primary/5 transition-colors flex items-center justify-center"
              >
                Explore Practitioners
              </button>
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Intro Offer Card */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden ambient-shadow bg-surface-container-lowest">
            <img
              alt="Mind and Nature Harmony"
              className="w-full h-full object-cover absolute inset-0 z-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb7JXZLX9mWSfrBPcJUHiEUikrdGeic6_ozB2ImPXwCr0wcNZQC55VXHBlydnoYptDj-LaJO1QSewrNnISzJBBS8j7fIu3m__CB6ZjptHUbaXZtWBkHPZ0PO-dfVwfk2JyUXweQj77iZe7o7BEjm1v5gWR4aRvxcV9PMoZoFGBvGjsPP5DfJQKRDkmPuTT_hxWH5ZWyza3cDyhOCc2iC5VNXsosS54kZi08fuDS-G8l1sd3xvgqxSMjA"
            />

            {/* Introductory Offer Floating Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-surface-bright/95 backdrop-blur-md p-6 rounded-2xl border border-surface-variant/50 ambient-shadow z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-headline text-[20px] font-semibold text-on-surface">Introductory Consultation</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">Begin your wellness journey with a holistic assessment.</p>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-primary font-bold text-2xl font-headline">₹599</span>
                <span className="text-xs text-outline line-through">₹1200</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. AREAS OF FOCUS SECTION (Concept C: Asymmetric Grid) */}
        <section className="py-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-headline text-3xl sm:text-[36px] font-bold text-on-surface mb-2">
                Areas of Focus
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Targeted care for modern psychological challenges.
              </p>
            </div>
            <a
              href="#experts"
              className="text-primary text-xs font-bold uppercase tracking-wider hover:underline hidden sm:block"
            >
              View All Focus Areas
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Focus Card 1: Stress Reduction */}
            <div className="group relative h-80 rounded-3xl overflow-hidden bg-surface-container-high interactive-shadow transition-all duration-300 flex flex-col justify-end p-8 border border-surface-variant/30">
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent z-10" />
              <img
                alt="Stress Management"
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeLRUi64IgR8QIf_dXSvQZnrlgsFvYL6_M9svQLlh68DPZnTKC7jfHytMf6MzsALuXj_OIaVB-VLzbJTR35WVwEQ5HxCCC9CdjqTV8NoGqoZCF8A5DKwoNSzm01C7lRX4Tavfs-KiCKsGUvETyH4nJS3uNHvxsHx3hUt1u_oDPhOL15T_E8L1caDL63WJuVLgVTSk4wHBFJ8e2kitJdmqaMs6AwHvYFVWRvKizlXeyLoxNhA8sTy0RJw"
              />
              <div className="relative z-20">
                <span className="inline-block px-3 py-1 bg-surface-bright/20 backdrop-blur-sm text-white rounded-full text-[11px] font-semibold mb-3 border border-surface-bright/30">
                  Psychology
                </span>
                <h3 className="font-headline text-white text-2xl font-bold group-hover:-translate-y-1 transition-transform duration-300">
                  Stress Reduction
                </h3>
              </div>
            </div>

            {/* Focus Card 2: Anxiety Relief (Elevated in Desktop) */}
            <div className="group relative h-80 rounded-3xl overflow-hidden bg-surface-container-high interactive-shadow transition-all duration-300 flex flex-col justify-end p-8 border border-surface-variant/30 md:translate-y-6">
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent z-10" />
              <img
                alt="Anxiety Relief"
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANKCuPtSs34csQr-WR0GdhSIpum9N-RQ2_BpsRge72aWpyxci_dPiOK3X6_qooOtvdT48GQirKPauQlwMxreaIa43gzWtYu_ssLMovO9hIjQta3d7tt1PKRCE2mdi7F6pfdGb2qhbNzwBuLpW8Kg7PBwh25Nvt4CjUIbInRCnc2vZZkkf_yl5KfUUGmkJVU_lsroHTxTKDBgJwpaRcTrpqNP7rrU_U5L3oHJE0AMKi_zJ6Vdj5QFZAPg"
              />
              <div className="relative z-20">
                <span className="inline-block px-3 py-1 bg-surface-bright/20 backdrop-blur-sm text-white rounded-full text-[11px] font-semibold mb-3 border border-surface-bright/30">
                  Ayurveda
                </span>
                <h3 className="font-headline text-white text-2xl font-bold group-hover:-translate-y-1 transition-transform duration-300">
                  Anxiety Relief
                </h3>
              </div>
            </div>

            {/* Focus Card 3: Sleep Harmony */}
            <div className="group relative h-80 rounded-3xl overflow-hidden bg-surface-container-high interactive-shadow transition-all duration-300 flex flex-col justify-end p-8 border border-surface-variant/30">
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent z-10" />
              <img
                alt="Sleep Hygiene"
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAM1-S1NqPxhTms26x7VzKODOBjmtSCnnnccobF2fRlscwF6ctMJXdweu9SZlwYrJQqddcTYFkWeuZQwhe-aJGgifq8sGmDMweI8mbdV3ie81w0-H10PtoEpdveYl-VXXldx2D6yw4bIg_Eq0mgGQ7Yu3qK1Z18yZZ7B3scYV7_UaCQdaUqLFnC4Tr3t1vFIEdRPOk0JRpfzcA1FvPuHluEG37PTmje1JzHAOym6fwQqlKtn34DtHOBw"
              />
              <div className="relative z-20">
                <span className="inline-block px-3 py-1 bg-surface-bright/20 backdrop-blur-sm text-white rounded-full text-[11px] font-semibold mb-3 border border-surface-bright/30">
                  Holistic
                </span>
                <h3 className="font-headline text-white text-2xl font-bold group-hover:-translate-y-1 transition-transform duration-300">
                  Sleep Harmony
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MEET OUR EXPERTS BENTO SECTION (Concept C) */}
        <section id="experts" className="py-20">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl sm:text-[36px] font-bold text-on-surface mb-3">
              Meet Our Experts
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              A curated selection of practitioners blending clinical expertise with holistic healing methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Featured Practitioner (8 Cols) */}
            {featuredDoctor && (
              <div className="col-span-1 lg:col-span-8 bg-surface-container-lowest rounded-3xl ambient-shadow p-6 sm:p-8 flex flex-col md:flex-row gap-8 border border-surface-variant/30 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full md:w-1/3 aspect-[4/5] rounded-2xl overflow-hidden shrink-0 relative">
                  <img
                    alt={featuredDoctor.name}
                    className="w-full h-full object-cover"
                    src={featuredDoctor.profilePicture || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK9hRci2nolXvUCiPNv0yaUgYfXdk1y-dh9KJ6upAW8ZVvxNj3cBkpkMN2qOy_l7PQ9Y50A1pvxzcEBNxD7bq_aKQAvejEHQ7gXQ5NCWOoq54zC9r-qSfWpZ5IE-nrmVxb2qY3-Un5mJMcig2Y4CAZEvkPSjoS-XQtqKtJRL-wWutUNrixNKwS1tVGocwo-hwuFIpuDNsWjgFTGyEJYHFna4pdb5d3QMm574KYJOAaZ491vXhJMB2gNw'}
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-[#f0fdf4] text-[#166534] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
                      Ayurveda
                    </span>
                    <span className="bg-[#f3f4f6] text-[#374151] px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm border border-gray-200">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-2xl font-bold text-on-surface">
                        {featuredDoctor.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-[16px] text-amber-500 fill-icon">star</span>
                        <span className="text-xs font-bold text-on-surface">4.9</span>
                      </div>
                    </div>

                    <p className="text-primary font-semibold text-sm mb-3">
                      {featuredDoctor.specialization}
                    </p>

                    <p className="text-xs sm:text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
                      {featuredDoctor.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(featuredDoctor.specialities || ['Mindfulness', 'Dietary alignment', 'Stress Management']).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 border border-outline-variant rounded-full text-xs text-on-surface-variant bg-surface-bright"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-surface-variant pt-4">
                    <div>
                      <span className="text-xs text-on-surface-variant block">Consultation Fee</span>
                      <span className="font-headline font-bold text-2xl text-primary">₹{featuredDoctor.consultation?.price || 599}</span>
                    </div>

                    <button
                      onClick={() => handleBookClick(featuredDoctor)}
                      className="px-6 py-3 bg-secondary text-on-secondary rounded-xl font-label-sm text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0px_4px_12px_rgba(58,102,95,0.2)]"
                    >
                      <span>Book Consultation</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Right: Secondary Practitioner Stack (4 Cols) */}
            <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
              {secondaryDoctors.map((doc) => {
                const isAyurveda = doc.professionalType === 'AYURVEDA_DOCTOR';
                return (
                  <div
                    key={doc._id}
                    className="bg-surface-container-lowest rounded-3xl ambient-shadow p-5 border border-surface-variant/30 flex gap-4 flex-col justify-between interactive-shadow transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-outline-variant">
                        <img
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          src={doc.profilePicture}
                        />
                      </div>
                      <div>
                        <h4 className="font-headline text-[18px] font-bold text-on-surface leading-tight">
                          {doc.name}
                        </h4>
                        <p className="text-xs text-primary font-medium mt-0.5 mb-2">
                          {doc.specialization}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                            isAyurveda
                              ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]'
                              : 'bg-[#faf5ff] text-[#6b21a8] border-[#e9d5ff]'
                          }`}
                        >
                          {isAyurveda ? 'Ayurveda' : 'Psychology'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-2 pt-3 border-t border-surface-variant/50">
                      <span className="font-headline font-bold text-primary text-base">
                        ₹{doc.consultation?.price || 599}
                      </span>
                      <button
                        onClick={() => handleBookClick(doc)}
                        className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Book</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                if (doctors.length > 0) handleBookClick(doctors[0]);
              }}
              className="px-8 py-3.5 bg-surface-container-high text-on-surface rounded-xl font-label-sm text-xs font-bold hover:bg-surface-variant transition-colors border border-outline-variant/30"
            >
              Explore All Practitioners
            </button>
          </div>
        </section>
      </main>

      {/* Stepped Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={() => {
            fetchDoctors();
          }}
        />
      )}

      <Footer />
    </div>
  );
}
