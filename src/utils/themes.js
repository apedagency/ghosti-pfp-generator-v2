export const themes = [
  "Superhero Ghosti with a cape and mask",
  "Rockstar Ghosti with electric guitar and leather jacket",
  "Cowboy Ghosti with hat and bandana",
  "Samurai Ghosti with katana and traditional armor",
  "Punk Ghosti with mohawk and studded accessories",
  "Hacker Ghosti with neon visor and cyberpunk gear",
  "Wizard Ghosti with pointy hat and magical staff",
  "Chef Ghosti with chef's hat and cooking utensils",
  "Athlete Ghosti with sports gear and headband",
  "DJ Ghosti with headphones and turntable setup"
];

export const getRandomTheme = () => {
  return themes[Math.floor(Math.random() * themes.length)];
};
