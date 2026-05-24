"use client";

export default function Newsletter() {
  return (
    <section className="md:w-[1150px] mx-auto px-4">
      <div className="bg-linear-to-br flex-1 from-[#1A1A1A] to-[#2E2E2E] rounded-4xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="font-heading text-3xl md:text-4xl text-white leading-snug mb-6">
            STAY UPDATED WITH <br /> OUR NEWSLETTER
          </h2>

          <div className="flex items-center bg-white rounded-full overflow-hidden w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your mail address"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <button className="bg-black text-white px-4 py-2 text-sm font-medium rounded-full mr-1">
              Subscribe
            </button>
          </div>
        </div>

        {/* Right Section */}
        <p className="text-gray-300 text-sm md:max-w-xs">
          Be the first to know about exclusive offers, new arrivals, and special deals!
        </p>
      </div>
    </section>
  );
}
