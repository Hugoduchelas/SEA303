// Fonction pour lire le fichier CSV et analyser les données
async function fetchAndCount(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();

  // Diviser le fichier en lignes
  const rows = text.split("\n").filter((row) => row.trim() !== "");

  // Identifier les index des colonnes "Gender", "Age" et "prefered_listening_content"
  const header = rows[0].split(",");
  const genderIndex = header.indexOf("Gender");
  const ageIndex = header.indexOf("Age");
  const contentIndex = header.indexOf("preferred_listening_content");

  if (genderIndex === -1 || ageIndex === -1 || contentIndex === -1) {
    console.error(
      "Les colonnes nécessaires sont introuvables dans le fichier CSV."
    );
    return { genderCounts: {}, ageContentCounts: {} };
  }

  // Initialiser les compteurs
  const genderCounts = { male: 0, female: 0, others: 0 };
  const ageContentCounts = {};

  // Parcourir les lignes pour compter les occurrences
  rows.slice(1).forEach((row) => {
    const columns = row.split(",");
    const gender = columns[genderIndex].trim().toLowerCase();
    const age = parseInt(columns[ageIndex].trim(), 10);
    const content = columns[contentIndex].trim().toLowerCase();

    // Compter les genres
    if (gender === "male") genderCounts.male++;
    if (gender === "female") genderCounts.female++;
    if (gender === "others") genderCounts.others++;

    // Compter les contenus préférés par âge
    if (!isNaN(age)) {
      if (!ageContentCounts[age]) {
        ageContentCounts[age] = { music: 0, Podcast: 0 };
      }
      if (content === "music") ageContentCounts[age].music++;
      if (content === "Podcast") ageContentCounts[age].Podcast++;
    }
  });

  return { genderCounts, ageContentCounts };
}

// Fonction pour créer le graphique circulaire
async function createPieChart(genderCounts) {
  const labels = ["Homme", "Femme", "Non définis"];
  const values = [genderCounts.male, genderCounts.female, genderCounts.others];
  const colors = ["#0080FF", "#ff1d8d", "#7f00FF"];

  const chartData = [
    {
      values: values,
      labels: labels,
      hole: 0.5,
      type: "pie",
      marker: { colors: colors },
    },
  ];

  const layout = {
    title: "Répartition des genres",
    height: 600,
    width: 600,
    paper_bgcolor: "transparent",
    font: { color: "white" },
  };

  Plotly.newPlot("user-graph1", chartData, layout);
}

// Fonction pour créer le graphique à barres groupées
async function createGroupedBarChart(ageContentCounts) {
  const sortedAges = Object.keys(ageContentCounts).sort((a, b) => a - b);
  const labels = sortedAges.map((age) => `Âge ${age}`);
  const musicValues = sortedAges.map((age) => ageContentCounts[age].music);
  const podcastValues = sortedAges.map((age) => ageContentCounts[age].Podcast);

  const musicData = {
    x: labels,
    y: musicValues,
    name: "Musique",
    type: "bar",
    marker: { color: "#1f77b4" },
  };

  const podcastData = {
    x: labels,
    y: podcastValues,
    name: "Podcast",
    type: "bar",
    marker: { color: "#ff7f0e" },
  };

  const chartData = [musicData, podcastData];

  const layout = {
    title: "Contenus préférés par âge",
    barmode: "group",
    xaxis: { title: "Âge", tickangle: -45 },
    yaxis: { title: "Nombre d'utilisateurs" },
    paper_bgcolor: "transparent",
    font: { color: "white" },
    height: 600,
    width: 800,
  };

  Plotly.newPlot("user-graph2", chartData, layout);
}

// Créer les graphiques
(async function () {
  const filePath = "../data/Spotify_users_data.csv"; // Chemin vers le fichier CSV
  const { genderCounts, ageContentCounts } = await fetchAndCount(filePath);

  // Créer les graphiques
  createPieChart(genderCounts);
  createGroupedBarChart(ageContentCounts);
})();