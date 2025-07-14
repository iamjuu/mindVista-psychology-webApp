import React from 'react'
import {Logo} from '../../assets'
const index = () => {
  return (
    <footer className="bg-[#F5F5F5]">
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="lg:flex lg:items-start lg:gap-8">
        <div className="text-teal-600">
        <img style={{width:'100px'}} src={Logo} alt="" />
        </div>
  
        <div className="mt-8 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16">
          <div className="col-span-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nos 2</h2>
  
              <p className="mt-4 text-gray-500">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse non cupiditate quae nam
                molestias.
              </p>
            </div>
          </div>
  
          <div className="col-span-2 lg:col-span-3 lg:flex lg:items-end">
            <form className="w-full">
              <label htmlFor="UserEmail" className="sr-only"> Email </label>
  
              <div
                className="border border-gray-100 p-2 focus-within:ring sm:flex sm:items-center sm:gap-4"
              >
                <input
                  type="email"
                  id="UserEmail"
                  placeholder="john@rhcp.com"
                  className="w-full border-none p-3 focus:border-transparent focus:ring-transparent sm:text-sm"
                />
  
                <button
                  className="mt-1 w-full bg-amber-700 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-none hover:bg-amber-800 sm:mt-0 sm:w-auto sm:shrink-0"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
  
          <div className="col-span-2 sm:col-span-1">
            <p className="font-medium text-gray-900">Services</p>
  
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> 1on1 Coaching </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Company Review </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> HR Consulting </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> SEO Optimisation </a>
              </li>
            </ul>
          </div>
  
          <div className="col-span-2 sm:col-span-1">
            <p className="font-medium text-gray-900">Company</p>
  
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> About </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Meet the Team </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
              </li>
            </ul>
          </div>
  
          <div className="col-span-2 sm:col-span-1">
            <p className="font-medium text-gray-900">Helpful Links</p>
  
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Contact </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> FAQs </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Live Chat </a>
              </li>
            </ul>
          </div>
  
          <div className="col-span-2 sm:col-span-1">
            <p className="font-medium text-gray-900">Legal</p>
  
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Accessibility </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Returns Policy </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Refund Policy </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Hiring Statistics </a>
              </li>
            </ul>
          </div>
  
          <div className="col-span-2 sm:col-span-1">
            <p className="font-medium text-gray-900">Downloads</p>
  
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> Marketing Calendar </a>
              </li>
  
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75"> SEO Infographics </a>
              </li>
            </ul>
          </div>
  
          <ul className="col-span-2 flex justify-start gap-6 lg:col-span-5 lg:justify-end">
          <li>
              <a
      href='https://wa.me/7025715250'
      rel="noreferrer"
                target="_blank"
                className="text-gray-700 transition hover:opacity-75"
              >
                <span className="sr-only">whatsupp</span>
  
                <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
  className="whatsapp-icon"
>
  <path d="M20.52 3.479A11.706 11.706 0 0 0 12.003 0C5.37 0 .296 5.087.296 11.662c0 2.055.537 4.066 1.561 5.839L0 24l6.715-1.74a11.918 11.918 0 0 0 5.288 1.257c6.633 0 11.707-5.088 11.707-11.662 0-3.116-1.236-6.046-3.19-8.216zM12.003 21.634c-1.81 0-3.593-.46-5.146-1.324l-.37-.205-3.99 1.032 1.09-3.867-.24-.384a9.611 9.611 0 0 1-1.47-5.225c0-5.393 4.407-9.792 9.853-9.792 2.63 0 5.1 1.027 6.965 2.894a9.538 9.538 0 0 1 2.888 6.884c0 5.39-4.408 9.793-9.88 9.793zm5.243-7.203c-.287-.144-1.708-.84-1.973-.933-.264-.093-.457-.138-.651.138-.194.275-.748.933-.917 1.123-.168.19-.336.213-.623.07-.288-.143-1.22-.45-2.08-1.143-.767-.61-1.288-1.36-1.44-1.588-.152-.275-.016-.423.127-.562.13-.128.288-.34.432-.508.143-.167.191-.288.287-.482.095-.194.048-.363-.024-.51-.073-.145-.653-1.573-.894-2.148-.239-.574-.484-.496-.652-.504h-.56c-.184 0-.48.07-.735.337-.255.268-.99.97-.99 2.365 0 1.395 1.013 2.744 1.155 2.94.143.198 1.723 2.653 4.185 3.715.586.252 1.043.404 1.398.517.588.187 1.124.16 1.547.097.47-.07 1.691-.694 1.932-1.365.24-.67.24-1.244.168-1.37-.072-.124-.264-.198-.556-.343z" />
</svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/muhammed_ajmalcc/?hl=en"
                rel="noreferrer"
                target="_blank"
                className="text-gray-700 transition hover:opacity-75"
              >
                <span className="sr-only">Instagram</span>
  
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
  
            <li>
              <a
                href="#"
                rel="noreferrer"
                target="_blank"
                className="text-gray-700 transition hover:opacity-75"
              >
                <span className="sr-only">Facebook</span>
  
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
  
          
            <li>
  <a
    href="muhammedajmalcc6424094@gmail.com"
    rel="noreferrer"
    target="_blank"
    className="text-gray-700 transition hover:opacity-75"
  >
    <span className="sr-only">Gmail</span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 10a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10zm2 0v28h36V10L24 24 6 10zM24 22L6 10h36L24 22z" />
    </svg>
  </a>
</li>



          </ul>
        </div>
      </div>
  
      <div className="mt-8 border-t border-gray-100 pt-8">
        <div className="sm:flex sm:justify-between">
          <p className="text-xs text-gray-500">&copy; 2022. Company Name. All rights reserved.</p>
  
          <ul className="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
            <li>
              <a href="#" className="text-gray-500 transition hover:opacity-75"> Terms & Conditions </a>
            </li>
  
            <li>
              <a href="#" className="text-gray-500 transition hover:opacity-75"> Privacy Policy </a>
            </li>
  
            <li>
              <a href="#" className="text-gray-500 transition hover:opacity-75"> Cookies </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default index

