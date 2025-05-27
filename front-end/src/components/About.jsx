import React, { useEffect, useRef, useContext } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaCompass,
  FaGlobe,
  FaUsers,
  FaRegComments,
  FaHeart,
  FaShareSquare,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../assets/darkmode";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <FaCompass className="w-10 h-10 text-primary" />,
    title: "Explorez le monde",
    description: "Découvrez de nouveaux horizons partagés par notre communauté.",
  },
  {
    icon: <FaGlobe className="w-10 h-10 text-accent" />,
    title: "Partagez vos aventures",
    description: "Documentez vos souvenirs inoubliables et inspirez d'autres.",
  },
  {
    icon: <FaUsers className="w-10 h-10 text-secondary" />,
    title: "Rejoignez une communauté",
    description: "Connectez-vous avec des voyageurs du monde entier.",
  },
  {
    icon: <FaRegComments className="w-10 h-10 text-ocean-dark" />,
    title: "Échangez vos conseils",
    description: "Commentez et partagez des astuces utiles avec les autres.",
  },
  {
    icon: <FaHeart className="w-10 h-10 text-red-400" />,
    title: "Likez les expériences",
    description: "Soutenez les récits qui vous touchent.",
  },
  {
    icon: <FaShareSquare className="w-10 h-10 text-forest" />,
    title: "Partage social",
    description: "Diffusez vos moments préférés sur d'autres plateformes.",
  },
];

const stats = [
  { value: "15K+", label: "Membres actifs" },
  { value: "70K+", label: "Histoires partagées" },
  { value: "100+", label: "Pays explorés" },
  { value: "1.5M+", label: "Interactions mensuelles" },
];

const About = () => {
  const sectionRefs = useRef([]);
  sectionRefs.current = [];
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    sectionRefs.current.forEach((section) => {
      gsap.set(section, { opacity: 0, y: 50 });
    });

    sectionRefs.current.forEach((section) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });
    });

    const cards = gsap.utils.toArray(".feature-card");
    gsap.set(cards, { opacity: 0, y: 50 });

    cards.forEach((card) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.4)",
      });
    });

    gsap.to(".stats-marquee", {
      xPercent: -50,
      duration: 20,
      ease: "linear",
      repeat: -1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-bg1 text-darkText"} font-sans`}>
      {/* Hero */}
      <section
        ref={addToRefs}
        className={`min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-20 ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-ocean-light to-bg2"}`}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-primary drop-shadow-md">
          Bienvenue sur <span className="text-accent">Jouala</span>
        </h1>
        <p className={`max-w-2xl text-lg md:text-xl mb-10 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Le réseau social pour les amoureux du voyage. Partagez, découvrez et connectez-vous.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-ocean-dark text-white font-semibold py-4 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Rejoindre maintenant
        </button>
      </section>

      {/* Features */}
      <section
        ref={addToRefs}
        className="features-section max-w-7xl mx-auto px-6 md:px-20 py-20"
      >
        <h2 className={`text-4xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-darkText"}`}>
          Pourquoi <span className="text-primary">Jouala</span> est unique ?
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`feature-card rounded-xl p-8 shadow-md hover:shadow-xl transition duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Marquee */}
      <section className="bg-primary text-white py-20 px-6 md:px-20 overflow-hidden">
        <div className="flex whitespace-nowrap gap-16 stats-marquee">
          {[...stats, ...stats].map((stat, i) => (
            <div key={i} className="min-w-[200px] text-center">
              <p className="text-5xl font-extrabold mb-2">{stat.value}</p>
              <p className="text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        ref={addToRefs}
        className={`py-20 px-6 md:px-20 text-center ${darkMode ? "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900" : "bg-gradient-to-r from-accent via-primary to-ocean-dark"} text-white`}
      >
        <h2 className="text-4xl font-extrabold mb-6">Prêt à explorer ?</h2>
        <p className="mb-10 max-w-xl mx-auto text-lg">
          Rejoignez notre communauté dès aujourd'hui et commencez votre journal de voyage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-primary font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition"
          >
            Créer un compte
          </button>
          <button
            onClick={() => navigate("/")}
            className="border-2 border-white hover:bg-white hover:text-primary transition rounded-full py-4 px-10 font-bold"
          >
            Voir la plateforme
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
