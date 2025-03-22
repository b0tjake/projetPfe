export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // ✅ التصحيح هنا
  theme: {
    extend: {
      colors: {
        primary: "#0077B6",  // Bleu Océan
        secondary: "#F4A261", // Orange Sahara
        accent: "#2A9D8F",   // Vert Atlas
        darkText: "#264653", // Bleu Nuit
        lightBg: "#EAE7DC",  // Beige Sable
        bg1 : "#fcfcfb",    // Blanc Crème
        bg2 : "#f4f4f4",    // Gris Clair
      },
    },
  },
  plugins: [],
};
