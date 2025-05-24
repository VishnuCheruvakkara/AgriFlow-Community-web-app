import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "/images/farmer1.png",
    text: "Empowering Farmers, Connect and Grow Together with AgriFlow!",
    subtext:
      "A community platform for farmers to connect, trade, and build lasting partnerships without intermediaries.",
  },
  {
    image: "/images/farmer2.png",
    text: "Bringing Innovation to Agriculture",
    subtext: "AgriFlow helps farmers grow smarter, not harder.",
  },
  {
    image: "/images/farmer3.png",
    text: "From Soil to Success",
    subtext: "Unite farmers, share knowledge, and grow your future together.",
  },
  {
    image: "/images/farmer4.png",
    text: "Sustainable Farming Made Simple",
    subtext: "We bring technology and tradition together for a better tomorrow.",
  },
  {
    image: "/images/farmer5.jpg",
    text: "Community-Driven Growth",
    subtext: "AgriFlow connects hearts and harvests alike.",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (i) => {
    setIndex(i);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              filter: "brightness(75%)",
            }}
          ></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.text}</h1>
            <p className="text-lg md:text-xl max-w-2xl mb-6">{slide.subtext}</p>
            <Link
              to="/sign-up"
              className="bg-white text-green-700 font-bold py-3 px-6 rounded-md hover:bg-green-700 hover:text-white transition duration-500"
            >
              Join in the community
            </Link>
          </div>
        </div>
      ))}

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-3 w-3 rounded-full transition duration-300 ${
              i === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
