import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-5 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <p>&copy; {currentYear} Your Company Name. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0"> {/* Social media links */}
            <a href="#" className="hover:text-gray-400">
              {/* Add your social media icons here (e.g., Font Awesome, React Icons) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* Example Facebook Icon */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a href="#" className="hover:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* Example Twitter Icon */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9A9 9 0 003 12m0 0l11.49 11.49m-9.4-9.4a2 2 0 112.83 2.83" />
              </svg>
            </a>
            {/* Add more social media links as needed */}
          </div>
          <div className="text-center md:text-right">
            {/* Add any additional links or information here (e.g., Terms of Service, Privacy Policy) */}
            <a href="#" className="hover:text-gray-400 mr-4">Terms</a>
            <a href="#" className="hover:text-gray-400">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;