const Footer = () => {
  return (
    <footer className="bg-[#192057] text-white py-10 px-4 md:px-8 lg:px-20">
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* Left Column: Logo and Copyright */}
        <div className="mb-6 md:mb-0 md:w-1/4">
          {/* Logo */}
          <div className="text-2xl font-bold mb-4">
            <img src="/Images/logo.jpg" alt="Logo" className="w-32" />
          </div>
          {/* Copyright */}
          <p className="text-gray-300 text-sm">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>

        {/* Right Column: 3 Divs in a Row */}
        <div className="flex flex-col md:flex-row md:w-3/4 justify-around">
          {/* First Div: Navigate */}
          <div className="space-y-3 mb-6 md:mb-0 md:w-1/3">
            <h3 className="font-semibold text-lg">Navigate</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Our Company</a>
              </li>
              <li>
                <a href="#">What We Do</a>
              </li>
              <li>
                <a href="#">Reach Us</a>
              </li>
            </ul>
          </div>

          {/* Second Div: Explore */}
          <div className="space-y-3 mb-6 md:mb-0 md:w-1/3">
            <h3 className="font-semibold text-lg">Privacy & TOC</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="#">Usage Policy</a>
              </li>
              <li>
                <a href="./Privacy_Policy.html">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Third Div: Support */}
          <div className="space-y-3 md:w-1/3">
            <h3 className="font-semibold text-lg">Address</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="max-w-[300px]">
                <a href="#">
                  Room 5, Ground Floor Courtney House, 12 Dudley Street, Luton,
                  Beds, England, LU2 0NT
                </a>
              </li>
            </ul>
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="mailto:support@gmail.com">Support@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
