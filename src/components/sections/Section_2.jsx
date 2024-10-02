const Section_2 = () => {
  return (
    <div className="bg-gradient-to-b from-[#160242] to-[#380855] py-10 px-4 md:px-12 lg:px-20 xl:px-[200px] flex flex-col md:flex-row">
      {/* Left Side Image - Hidden on small screens */}
      <div className="w-full md:w-1/2 flex justify-center md:block hidden">
        <img
          src="/Images/bitcoin.png"
          alt="Mining"
          className="w-3/4 md:w-full h-auto animate-up-down"
        />
      </div>

      {/* Right Side Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 mt-8 md:mt-0 pl-0 md:pl-12">
        {/* First Div: Circles */}
        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <span className="w-[12px] h-[12px] bg-blue-500 rounded-full"></span>
          <span className="w-[12px] h-[12px] bg-violet-500 rounded-full"></span>
          <span className="w-[12px] h-[12px] bg-yellow-500 rounded-full"></span>
          <span className="w-[12px] h-[12px] bg-green-500 rounded-full"></span>
          <span className="w-[12px] h-[12px] bg-blue-900 rounded-full"></span>
          <span className="w-[12px] h-[12px] bg-orange-500 rounded-full"></span>
          <span className="w-[12px] h-[12px] bg-violet-500 rounded-full"></span>
        </div>

        {/* Second Div: Heading and Paragraph */}
        <div className="text-white text-center md:text-left px-4 md:px-0">
          <h1 className="text-[28px] md:text-[36px] lg:text-[40px]">
            What is Bitcoin
          </h1>
          <p className="mt-3 text-gray-300 text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed md:leading-loose">
            Bitcoin is a digital currency that is decentralized. Any two people
            can send each other bitcoins with no involvement of banks or
            governments. Every transaction of bitcoins is recorded on the public
            ledger called blockchain. The ledger can be accessed by anyone.
            There will only ever be 21 million bitcoins and since it's digital,
            it cannot be inflated or manipulated. There is no need to acquire
            all bitcoins, owning a fraction suffices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section_2;
