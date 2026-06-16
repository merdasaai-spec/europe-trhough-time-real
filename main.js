fetch('/europe.geojson')
  .then(r => r.json())
  .then(data => { europeData = data; initMap(); })
  .catch(err => console.error('Failed to load map data:', err));

let europeData = null;

const cities = [
  // Greece (3)
  { name: "Athens", lon: 23.73, lat: 37.98 },
  { name: "Thessaloniki", lon: 22.94, lat: 40.64 },
  { name: "Sparta", lon: 22.43, lat: 37.08 },
  // Italy (3)
  { name: "Rome", lon: 12.50, lat: 41.90 },
  { name: "Venice", lon: 12.32, lat: 45.44 },
  { name: "Florence", lon: 11.26, lat: 43.77 },
  // Turkey (3)
  { name: "Constantinople (Istanbul)", lon: 28.98, lat: 41.01 },
  { name: "Smyrna (Izmir)", lon: 27.14, lat: 38.42 },
  { name: "Ankara", lon: 32.85, lat: 39.93 },
  // France (3)
  { name: "Paris", lon: 2.35, lat: 48.86 },
  { name: "Avignon", lon: 4.81, lat: 43.95 },
  { name: "Marseille", lon: 5.37, lat: 43.30 },
  // United Kingdom (3)
  { name: "London", lon: -0.13, lat: 51.51 },
  { name: "York", lon: -1.08, lat: 53.96 },
  { name: "Edinburgh", lon: -3.19, lat: 55.95 },
  // Spain (3)
  { name: "Madrid", lon: -3.70, lat: 40.42 },
  { name: "Cordoba", lon: -4.78, lat: 37.89 },
  { name: "Barcelona", lon: 2.17, lat: 41.39 },
  // Portugal (2)
  { name: "Lisbon", lon: -9.14, lat: 38.72 },
  { name: "Porto", lon: -8.61, lat: 41.15 },
  // Netherlands (2)
  { name: "Amsterdam", lon: 4.90, lat: 52.37 },
  { name: "Rotterdam", lon: 4.48, lat: 51.92 },
  // Germany (3)
  { name: "Berlin", lon: 13.40, lat: 52.52 },
  { name: "Cologne", lon: 6.96, lat: 50.94 },
  { name: "Aachen", lon: 6.08, lat: 50.78 },
  // Austria (1)
  { name: "Vienna", lon: 16.37, lat: 48.21 },
  // Russia (3)
  { name: "Moscow", lon: 37.62, lat: 55.76 },
  { name: "St. Petersburg", lon: 30.31, lat: 59.94 },
  { name: "Novgorod", lon: 31.27, lat: 58.52 },
  // Czechia (1)
  { name: "Prague", lon: 14.42, lat: 50.09 },
  // Belgium (1)
  { name: "Brussels", lon: 4.35, lat: 50.85 },
  // Sweden (1)
  { name: "Stockholm", lon: 18.06, lat: 59.33 },
  // Denmark (1)
  { name: "Copenhagen", lon: 12.57, lat: 55.68 },
  // Ireland (1)
  { name: "Dublin", lon: -6.27, lat: 53.35 },
  // Poland (2)
  { name: "Warsaw", lon: 21.01, lat: 52.23 },
  { name: "Krakow", lon: 19.94, lat: 50.06 },
  // Hungary (1)
  { name: "Budapest", lon: 19.04, lat: 47.50 },
  // Ukraine (1)
  { name: "Kyiv", lon: 30.52, lat: 50.45 },
  // Serbia (1)
  { name: "Belgrade", lon: 20.46, lat: 44.79 },
  // Bosnia (1)
  { name: "Sarajevo", lon: 18.41, lat: 43.86 },
  // Romania (1)
  { name: "Bucharest", lon: 26.10, lat: 44.43 },
  // Bulgaria (1)
  { name: "Sofia", lon: 23.32, lat: 42.70 },
  // Latvia (1)
  { name: "Riga", lon: 24.10, lat: 56.95 },
  // Switzerland (1)
  { name: "Zurich", lon: 8.54, lat: 47.38 },
  // Georgia (1)
  { name: "Tbilisi", lon: 44.79, lat: 41.72 },
  // Armenia (1)
  { name: "Yerevan", lon: 44.51, lat: 40.18 },
  // Finland (1)
  { name: "Helsinki", lon: 24.94, lat: 60.17 },
  // Norway (1)
  { name: "Oslo", lon: 10.75, lat: 59.91 }
];

const eras = [
  { label: "Stone Age",      year: -3000, range: [-3000, -1200] },
  { label: "Bronze Age",     year: -1500, range: [-1200, -800]  },
  { label: "Iron Age",       year: -600,  range: [-800, -27]    },
  { label: "Antiquity",      year: -27,   range: [-27, 476]     },
  { label: "Middle Ages",    year: 900,   range: [476, 1450]    },
  { label: "Renaissance",    year: 1500,  range: [1450, 1650]   },
  { label: "Enlightenment",  year: 1750,  range: [1650, 1800]   },
  { label: "Industrial Age", year: 1850,  range: [1800, 1914]   },
  { label: "Modern era",     year: 1950,  range: [1914, 2010]   },
  { label: "Present day",    year: 2026,  range: [2010, 2026]   }
];

function getEraLabel(year) {
  for (const era of eras) {
    if (year >= era.range[0] && year <= era.range[1]) return era.label;
  }
  return "";
}

function formatYear(year) {
  if (year < 0) return Math.abs(year) + " BC";
  if (year === 0) return "0";
  return String(year);
}

// Special labeled years for context
const milestones = {
  "-3000": "Early Bronze Age — first farming settlements across Europe",
  "-2500": "Megalithic culture — stone monuments built across Europe",
  "-1200": "Late Bronze Age collapse — trade networks break down",
  "-800":  "Early Iron Age — iron spreads across the continent",
  "-500":  "Celtic cultures dominate Central and Western Europe",
  "-27":   "Roman Empire established — Mediterranean world unified",
  "100":   "Height of the Roman Empire — roads connect the continent",
  "376":   "Great Migration — peoples move across Europe en masse",
  "476":   "Fall of the Western Roman Empire",
  "541":   "Plague of Justinian spreads across Europe",
  "700":   "Early medieval kingdoms form across Europe",
  "1000":  "Viking Age — Norse settlements from Iceland to Russia",
  "1095":  "Crusades begin — Europe mobilizes toward the Holy Land",
  "1347":  "Black Death — kills one third of Europe's population",
  "1450":  "Gutenberg's printing press — knowledge spreads rapidly",
  "1453":  "Fall of Constantinople — end of the Byzantine Empire",
  "1517":  "Reformation — Christianity splits across Europe",
  "1618":  "Thirty Years' War devastates Central Europe",
  "1648":  "Peace of Westphalia — modern state system begins",
  "1750":  "Enlightenment — reason and science reshape European thought",
  "1789":  "French Revolution — old order collapses across the continent",
  "1815":  "Congress of Vienna — Europe redrawn after Napoleon",
  "1848":  "Revolutions sweep across Europe",
  "1871":  "Industrial age — railways and factories transform the continent",
  "1914":  "World War I begins — Europe tears itself apart",
  "1918":  "World War I ends — empires collapse, borders redrawn",
  "1939":  "World War II begins — Europe at war again",
  "1945":  "World War II ends — continent in ruins, Cold War begins",
  "1957":  "Treaty of Rome — European cooperation begins",
  "1989":  "Fall of the Berlin Wall — Cold War ends",
  "1993":  "European Union founded",
  "2004":  "EU expands eastward",
  "2024":  "AI age begins — technology reshapes European society",
  "2026":  "Present day Europe"
};

function getEraLabelForYear(year) {
  // find nearest milestone at or before this year
  let best = null;
  let bestYear = -Infinity;
  for (const k in milestones) {
    const y = parseInt(k);
    if (y <= year && y > bestYear) {
      bestYear = y;
      best = milestones[k];
    }
  }
  return best || getEraLabel(year);
}

function initMap() {
// --- Map setup ---
const svg = d3.select("#map");
const width = 800, height = 700;

const projection = d3.geoMercator()
  .center([25, 53])
  .scale(480)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

svg.selectAll("path.land")
  .data(europeData.features)
  .join("path")
  .attr("class", "land")
  .attr("d", path);

const cityGroups = svg.selectAll("g.city-group")
  .data(cities)
  .join("g")
  .attr("class", "city-group")
  .attr("transform", d => {
    const [x, y] = projection([d.lon, d.lat]);
    return `translate(${x}, ${y})`;
  })
  .style("cursor", "pointer")
  .on("click", (event, d) => openModal(d))
  .on("mouseover", () => {})

cityGroups.append("circle")
  .attr("class", "city-dot")
  .attr("r", 5);

cityGroups.append("text")
  .attr("class", "city-label")
  .attr("x", 9)
  .attr("y", 4)
  .text(d => d.name);

} // end initMap

// --- Slider / year display ---
const slider = document.getElementById("yearSlider");
const yearNumber = document.getElementById("yearNumber");
const eraLabel = document.getElementById("eraLabel");

function updateYearDisplay(year) {
  yearNumber.textContent = formatYear(year);
  eraLabel.textContent = getEraLabelForYear(year);
  updateActiveEraButton(year);
}

slider.addEventListener("input", (e) => {
  updateYearDisplay(parseInt(e.target.value));
});

// --- Era preset buttons ---
const eraPresets = document.getElementById("eraPresets");
eras.forEach(era => {
  const btn = document.createElement("button");
  btn.className = "era-btn";
  btn.textContent = era.label;
  btn.dataset.year = era.year;
  btn.addEventListener("click", () => {
    slider.value = era.year;
    updateYearDisplay(era.year);
  });
  eraPresets.appendChild(btn);
});

updateYearDisplay(parseInt(slider.value));

function updateActiveEraButton(year) {
  const buttons = eraPresets.querySelectorAll(".era-btn");
  let closest = null;
  let closestDist = Infinity;
  buttons.forEach(btn => {
    const dist = Math.abs(parseInt(btn.dataset.year) - year);
    if (dist < closestDist) {
      closestDist = dist;
      closest = btn;
    }
    btn.classList.remove("active");
  });
  // Only highlight if reasonably close to a preset's era range
  for (const era of eras) {
    if (year >= era.range[0] && year <= era.range[1]) {
      buttons.forEach(btn => {
        if (btn.textContent === era.label) btn.classList.add("active");
      });
      return;
    }
  }
}

// --- Modal ---
const overlay = document.getElementById("overlay");
const modalClose = document.getElementById("modalClose");
const modalCity = document.getElementById("modalCity");
const modalYear = document.getElementById("modalYear");
const modalDesc = document.getElementById("modalDesc");
const modalImage = document.getElementById("modalImage");

async function openModal(city) {
  const year = parseInt(slider.value);
  const eraLabelText = getEraLabelForYear(year);
  modalCity.textContent = city.name;
  modalYear.textContent = formatYear(year) + " — " + eraLabelText;
  modalDesc.textContent = `This is where an AI-generated image would show what ${city.name} looked like around ${formatYear(year)}.`;

  const prompt = `Historical realistic painting of ${city.name} in the year ${formatYear(year)}, ${getEraLabelForYear(year)} period, detailed architecture and people, cinematic lighting, oil painting style`;


  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Image generation failed');
    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      modalImage.innerHTML = '';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      modalImage.appendChild(img);
    };
    img.onerror = () => {
      modalImage.innerHTML = '<span style="padding:20px;display:block;text-align:center;color:#8A7457;">Failed to load image — click again to retry</span>';
    };
    img.src = imageUrl;
  } catch (err) {
    modalImage.innerHTML = '<span style="padding:20px;display:block;text-align:center;color:#8A7457;">Could not load image — please try again</span>';
  }

  overlay.classList.add("open");

  // mark active dot
  d3.selectAll(".city-group").classed("active", d => d.name === city.name);
}

function closeModal() {
  overlay.classList.remove("open");
  d3.selectAll(".city-group").classed("active", false);
}

modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
