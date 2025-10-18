import React from 'react'
import { Pic1,Pic2,Pic3,Medition} from '../../../assets'
import { Zap, ShieldCheck, Clock3, MapPin, Server, GraduationCap, Users } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Individual Therapy',
    description: 'One-on-one personalized counseling sessions tailored to your unique needs, fostering self-discovery and mental wellness.'
  },
  {
    icon: ShieldCheck,
    title: 'Couple Therapy',
    description: 'Relationship counseling tailored for modern couples, combining emotional awareness with respect to their needs.'
  },
  {
    icon: Clock3,
    title: 'Stress & Anxiety Management',
    description: 'Effective strategies and evidence-based techniques to manage stress, anxiety, and everyday mental health challenges.'
  },
  {
    icon: MapPin,
    title: 'Workshops & Wellness Programs',
    description: 'Group workshops, wellness events, and community programs to encourage awareness.'
  },
  {
    icon: GraduationCap,
    title: 'Student Mentorship Therapy',
    description: 'Dedicated support for students facing academic pressure, career decisions, and personal development challenges.'
  },
  {
    icon: Users,
    title: 'Community Circles',
    description: 'Safe, small online groups where people share, learn, and heal together — from grief to growth.'
  },
]


const index = () => {
  return (
<div className="w-full">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
    {/* Left: Image + Right: Features */}
        <div className="w-full flex flex-col md:flex-row gap-6" data-aos="fade-up">
      {/* Image */}
          <div className="w-full  md:block  hidden md:w-[40%] flex justify-center md:justify-start" data-aos="zoom-in" data-aos-delay="100">
        <img
          src={Medition}
          alt="About Tabdeel"
          className="w-full max-w-xs md:w-96 rounded-xl object-cover"
      
        />
      </div>

      {/* Feature list */}
          <div className="w-full md:w-[60%]" data-aos="fade-down" data-aos-delay="150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map(({ icon: Icon, title, description }, idx) => (
            <div
              key={idx}
                  className="flex items-start gap-5 rounded-xl border border-primary-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={(idx % 2 === 0 ? 0 : 100) + Math.floor(idx / 2) * 100}
            >
              <div className="shrink-0 rounded-full bg-green-100 text-green-700 p-3">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom paragraph */}
        <div className="w-full mt-4 md:mt-8" data-aos="fade-up" data-aos-delay="150">
            <div className=' px-2 md:px-20 '>
            <p className="w-full py-10 rounded-xl border border-primary-300 bg-white/30 p-6 text-center text-[28px] leading-relaxed text-gray-700 shadow-sm">
  We Provide Compassionate Psychological Care for a Healthier Mind
</p>

      </div>
    </div>
  </div>
</div>

  )
}

export default index
