// Load map data with proper error handling
let europeData = null;
let mapInitialized = false;

function loadMapData() {
  return fetch('/europe.geojson', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (!data || !data.features) {
      throw new Error('Invalid GeoJSON data: missing features array');
    }
    europeData = data;
    mapInitialized = true;
    initMap();
  })
  .catch(err => {
    console.error('Failed to load map data:', err);
    // Show error state to user
    const mapWrap = document.querySelector('.map-wrap');
    if (mapWrap) {
      mapWrap.innerHTML = '<p style="text-align:center;padding:40px;color:#8A7457;font-family:sans-serif;">Failed to load map data. Please refresh the page.</p>';
    }
  });
}

// Start loading immediately
loadMapData();

const countries = [
  // Southern Europe
  { name: "Greece", lon: 23.73, lat: 39.0 },
  { name: "Italy", lon: 12.50, lat: 42.5 },
  { name: "Spain", lon: -3.70, lat: 40.0 },
  { name: "Portugal", lon: -8.61, lat: 39.5 },
  { name: "Turkey", lon: 32.85, lat: 39.0 },
  // Western Europe
  { name: "France", lon: 2.35, lat: 47.0 },
  { name: "United Kingdom", lon: -1.08, lat: 53.0 },
  { name: "Netherlands", lon: 5.29, lat: 52.1 },
  { name: "Belgium", lon: 4.35, lat: 50.5 },
  { name: "Switzerland", lon: 8.54, lat: 46.8 },
  // Central Europe
  { name: "Germany", lon: 10.0, lat: 51.0 },
  { name: "Austria", lon: 14.5, lat: 47.5 },
  { name: "Czechia", lon: 15.0, lat: 50.0 },
  { name: "Poland", lon: 19.0, lat: 52.0 },
  { name: "Hungary", lon: 19.04, lat: 47.0 },
  // Eastern Europe
  { name: "Russia", lon: 37.62, lat: 55.0 },
  { name: "Ukraine", lon: 30.52, lat: 49.0 },
  { name: "Romania", lon: 25.0, lat: 45.0 },
  { name: "Bulgaria", lon: 25.0, lat: 42.5 },
  { name: "Serbia", lon: 20.46, lat: 44.0 },
  { name: "Bosnia", lon: 18.0, lat: 44.0 },
  // Scandinavia & Baltics
  { name: "Sweden", lon: 16.0, lat: 60.0 },
  { name: "Norway", lon: 10.75, lat: 60.0 },
  { name: "Denmark", lon: 10.0, lat: 56.0 },
  { name: "Finland", lon: 25.0, lat: 61.0 },
  { name: "Latvia", lon: 24.10, lat: 57.0 },
  // Other
  { name: "Ireland", lon: -8.0, lat: 53.0 },
  { name: "Georgia", lon: 44.79, lat: 42.0 },
  { name: "Armenia", lon: 45.0, lat: 40.0 }
];

const eras = [
  { label: "Stone Age",      year: -3150, range: [-3300, -3000] },
  { label: "Bronze Age",     year: -2250, range: [-3300, -1200] },
  { label: "Iron Age",       year: -600,  range: [-1200, -27]   },
  { label: "Antiquity",      year: 225,   range: [-27, 476]     },
  { label: "Middle Ages",    year: 963,   range: [476, 1450]    },
  { label: "Renaissance",    year: 1550,  range: [1450, 1650]   },
  { label: "Enlightenment",  year: 1725,  range: [1650, 1800]   },
  { label: "Industrial Age", year: 1857,  range: [1800, 1914]   },
  { label: "Modern era",     year: 1962,  range: [1914, 2010]   },
  { label: "Present day",    year: 2020,  range: [2010, 2026]   }
];

function getEraLabel(year) {
  // Check ranges in reverse so later eras win at boundary points
  for (let i = eras.length - 1; i >= 0; i--) {
    const era = eras[i];
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
  "-3000": "Stone Age — first farming settlements across Europe",
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

// Year-specific prompt modifiers for historically accurate imagery
const yearModifiers = {
  // World War I era
  "1914": {
    scene: "trench warfare, soldiers mobilizing, European armies at the outbreak of WWI",
    architecture: "pre-war European cities, military barracks, train stations with departing soldiers",
    clothing: "WWI era military uniforms (German, French, British), early 20th century civilian dress",
    colors: "sepia-toned, desaturated wartime palette, muddy battlefield tones, muted greens and browns",
    atmosphere: "tension and dread of war, mass mobilization, last moments of peace",
    landscape: "European cities preparing for war, military camps, departure platforms crowded with soldiers",
    style: "WWI-era wartime photography style, documentary realism, historical photojournalism"
  },
  "1915": {
    scene: "trench warfare on the Western Front, soldiers in muddy trenches, artillery fire",
    architecture: "war-damaged European towns, field hospitals, military fortifications",
    clothing: "WWI trench warfare uniforms, gas masks, muddy military gear",
    colors: "desaturated sepia, mud browns, smoke grays, barbed wire silhouettes",
    atmosphere: "brutal trench warfare, smoke and devastation, desperate conditions",
    landscape: "Western Front trenches, no man's land, destroyed villages",
    style: "WWI battlefield photography, gritty documentary realism, wartime photojournalism"
  },
  "1916": {
    scene: "Battle of Verdun and the Somme, massive artillery bombardment, soldiers charging no man's land",
    architecture: "shelled and destroyed fortifications, cratered landscape, ruined churches",
    clothing: "WWI combat uniforms, steel helmets (German Stahlhelm), field gear",
    colors: "charcoal grays, explosion oranges, mud browns, smoke-filled skies",
    atmosphere: "industrial-scale slaughter, catastrophic destruction, horror of modern warfare",
    landscape: "pockmarked battlefield terrain, ruined French countryside, barbed wire everywhere",
    style: "WWI battlefield documentation, raw wartime photography, devastating realism"
  },
  "1917": {
    scene: "trench warfare continues, Russian Revolution, soldiers mutinying, gas attacks",
    architecture: "war-weary European cities, propaganda posters, military headquarters",
    clothing: "WWI military uniforms, revolutionary workers' clothing, gas masks",
    colors: "muted wartime palette, propaganda red accents, trench mud tones, gas yellow haze",
    atmosphere: "war exhaustion, revolutionary fervor, collapse of empires",
    landscape: "Eastern Front devastation, Russian army collapsing, Western Front stalemate",
    style: "WWI documentary photography, revolutionary poster art influence, gritty realism"
  },
  "1918": {
    scene: "end of WWI, armistice celebrations mixed with devastation, returning soldiers",
    architecture: "war-damaged cities, memorial monuments being erected, ruined battlefields",
    clothing: "WWI veterans returning home, mixed military and civilian dress, weary uniforms",
    colors: "somber post-war palette, muted celebrations, gray skies over ruined landscapes",
    atmosphere: "bittersweet armistice, mourning and relief, exhausted survivors",
    landscape: "destroyed Western Europe, memorial cemeteries, demobilization camps",
    style: "post-WWI memorial photography, somber documentary style, historical accuracy"
  },
  // Interwar period
  "1919": {
    scene: "Paris Peace Conference, Treaty of Versailles signing, war-torn Europe recovering",
    architecture: "damaged European cities, peace conference halls, rebuilding efforts",
    clothing: "1920s early fashion, military uniforms transitioning to civilian dress",
    colors: "formal diplomatic palette, muted post-war tones, early Art Deco elegance",
    atmosphere: "diplomatic tension, fragile peace, beginning of reconstruction",
    landscape: "Paris peace negotiations, devastated European countryside, refugee camps",
    style: "1920s diplomatic photography, formal portraiture, early interwar aesthetic"
  },
  "1920": {
    scene: "interwar Europe, beginning of reconstruction, new political borders",
    architecture: "early reconstruction buildings, Art Deco emerging, war memorials",
    clothing: "1920s flapper fashion, men's suits, Art Deco era elegance",
    colors: "Art Deco palette, gold and black elegance, jazz age vibrancy",
    atmosphere: "roaring twenties energy, cultural rebirth, jazz and cabaret culture",
    landscape: "rebuilding European cities, nightlife districts, emerging modern architecture",
    style: "1920s Art Deco photography, elegant interwar aesthetic, jazz age glamour"
  },
  "1923": {
    scene: "hyperinflation in Germany, Ruhr occupation, political instability",
    architecture: "bankrupt German cities, hyperinflation scenes, occupied industrial areas",
    clothing: "depressed middle-class clothing, military occupation uniforms",
    colors: "depression-era grays, desperate economic hardship, occupied territory tones",
    atmosphere: "economic despair, political extremism rising, Weimar Republic instability",
    landscape: "German hyperinflation streets, abandoned factories, political rallies",
    style: "Weimar Republic photography, New Objectivity style, stark documentary realism"
  },
  "1929": {
    scene: "Great Depression beginning, stock market crash, economic devastation",
    architecture: "bank buildings, bread lines, Hoovervilles, economic despair",
    clothing: "1920s-30s Depression-era clothing, shabby suits, desperate poverty",
    colors: "Great Depression grays and browns, economic hardship palette",
    atmosphere: "economic collapse, mass unemployment, despair spreading across Europe",
    landscape: "unemployment lines, closed factories, economic crisis in European cities",
    style: "Great Depression photography, documentary realism, economic hardship documentation"
  },
  // Rise of totalitarianism
  "1933": {
    scene: "Nazi rise to power in Germany, book burnings, concentration camps beginning",
    architecture: "Nazi architecture emerging, Reichstag, propaganda monuments",
    clothing: "Nazi uniforms, SA brownshirts, Jewish citizens in distress",
    colors: "dark authoritarian palette, Nazi red-black-gold, ominous shadows",
    atmosphere: "dawning dictatorship, fear and oppression, totalitarian control",
    landscape: "Nazi rallies, burning books, oppressive state architecture",
    style: "1930s political documentary photography, authoritarian imagery, historical warning"
  },
  "1936": {
    scene: "Spanish Civil War, German intervention, test of new warfare technology",
    architecture: "bombarded Spanish towns, Guernica destruction, Republican and Nationalist positions",
    clothing: "Spanish Civil War militias, International Brigade uniforms, fascist uniforms",
    colors: "Spanish Civil War palette, fascist red-black, Republican blue-red, bombing destruction",
    atmosphere: "ideological conflict testing ground, fascist aggression, international volunteer armies",
    landscape: "Spanish battlefields, German Luftwaffe bombing runs, international brigades",
    style: "Spanish Civil War photography, Robert Capa style, documentary war photography"
  },
  // World War II era
  "1938": {
    scene: "Anschluss of Austria, Munich Agreement, Kristallnacht pogrom",
    architecture: "Nazi-occupied buildings, synagogues being destroyed, annexed territories",
    clothing: "Nazi uniforms, persecuted Jewish citizens, appeasement diplomats",
    colors: "darkening palette, Nazi symbolism, Kristallnacht destruction fire tones",
    atmosphere: "growing terror, failed appeasement, persecution escalating",
    landscape: "annexed Austria, destroyed synagogues, Munich conference",
    style: "1938 documentary photography, pre-war tension, historical documentation"
  },
  "1939": {
    scene: "German invasion of Poland, Blitzkrieg warfare, WWII begins",
    architecture: "Polish cities under bombardment, Blitzkrieg advances, invading German forces",
    clothing: "Polish military, German Wehrmacht uniforms, fleeing civilian populations",
    colors: "wartime palette, German gray uniforms, Polish defense colors, bombing destruction",
    atmosphere: "shock of invasion, Blitzkrieg terror, sudden collapse of peace",
    landscape: "Polish countryside under attack, Warsaw bombardment, refugee columns",
    style: "WWII outbreak photography, Blitzkrieg documentation, wartime urgency"
  },
  "1940": {
    scene: "Fall of France, Battle of Britain, Dunkirk evacuation, Nazi-occupied Europe",
    architecture: "occupied Paris with Nazi flags, Dunkirk beach evacuation, bombed British cities, fortified Atlantic Wall",
    clothing: "German occupation uniforms, French Resistance clothing, British Home Guard, refugee civilians",
    colors: "wartime occupation palette, German military gray, British defense tones, Dunkirk golden hour evacuation",
    atmosphere: "Nazi occupation, desperate evacuation, air raid sirens, resistance under occupation",
    landscape: "occupied French countryside, Dunkirk beaches with evacuating soldiers, London Blitz, Channel coast fortifications",
    style: "WWII occupation photography, Dunkirk evacuation documentation, Blitz photography, wartime military documentation"
  },
  "1941": {
    scene: "Operation Barbarossa, German invasion of Soviet Union, Eastern Front opens",
    architecture: "Soviet cities under attack, burning villages, advancing German columns, fortified positions",
    clothing: "German Wehrmacht eastern front uniforms, Soviet Red Army winter gear, partisan fighters",
    colors: "Eastern Front palette, snow whites, German khaki, Soviet red, burning village oranges",
    atmosphere: "massive invasion, brutal eastern campaign, partisan resistance, winter warfare beginning",
    landscape: "Russian steppe, burning border towns, advancing Panzer divisions, Soviet defensive lines",
    style: "Eastern Front WWII photography, massive military campaign documentation, brutal warfare realism"
  },
  "1942": {
    scene: "Battle of Stalingrad, Holocaust deportations, North African campaign",
    architecture: "ruined Stalingrad buildings, ghetto walls, concentration camp infrastructure, bombed cities",
    clothing: "Soviet defenders in ruins, German eastern front uniforms, Holocaust victims, partisan fighters",
    colors: "Stalingrad rubble grays, winter whites, Holocaust somber tones, desperate combat colors",
    atmosphere: "turning point of the war, brutal urban warfare, systematic persecution, desperate defense",
    landscape: "ruined Stalingrad, frozen Volga river, ghetto Warsaw, North African desert battles",
    style: "WWII turning point photography, Stalingrad ruin documentation, brutal urban warfare imagery"
  },
  "1943": {
    scene: "Allied invasion of Italy, Stalingrad aftermath, resistance movements growing",
    architecture: "Italian campaign battlefields, ruined German positions, partisan sabotage targets",
    clothing: "Allied forces in Italy, Italian partisans, German defense uniforms, resistance fighters",
    colors: "Italian campaign palette, Mediterranean blues, German defensive grays, partisan earth tones",
    atmosphere: "Allied advance, Italian collapse, growing resistance, war turning",
    landscape: "Italian mountain fronts, German defensive lines (Gustav), partisan countryside, bombed Italian cities",
    style: "Italian campaign WWII photography, Allied advance documentation, partisan warfare imagery"
  },
  "1944": {
    scene: "D-Day Normandy landings, Operation Overlord, liberation of France begins",
    architecture: "Normandy beachheads, fortified Atlantic Wall breaches, liberated French towns, bombed German cities",
    clothing: "Allied D-Day uniforms (American, British, Canadian), French Resistance, German defense troops",
    colors: "Normandy greens and grays, Allied military palette, liberation blues and whites, bombing destruction",
    atmosphere: "massive Allied invasion, liberation beginning, desperate German defense, hope and terror",
    landscape: "Normandy beaches with landing craft, hedgerow country, liberated Paris streets, Atlantic Wall fortifications",
    style: "D-Day and Normandy campaign photography, Allied invasion documentation, liberation imagery"
  },
  "1945": {
    scene: "End of WWII in Europe, Nazi surrender, ruined cities, displaced persons, concentration camp liberation",
    architecture: "completely destroyed German and European cities, rubble-strewn streets, liberated concentration camps, bombed Berlin",
    clothing: "victorious Allied soldiers, emaciated concentration camp survivors, German civilians in ruins, V-E Day celebrators",
    colors: "ruin and liberation palette, bombed-out grays, Allied victory colors, somber camp liberation tones, V-E Day red-white-blue",
    atmosphere: "end of the war, devastating destruction, liberation horror, V-E Day celebration mixed with mourning",
    landscape: "ruined Berlin and German cities, concentration camp grounds, Allied advance through Germany, displaced persons camps",
    style: "WWII end-of-war photography, concentration camp liberation documentation, V-E Day imagery, ruins documentation, historical documentary"
  },
  // Post-war
  "1946": {
    scene: "post-war Europe, Marshall Plan beginning, displaced persons camps, rebuilding starts",
    architecture: "war-razed cities, temporary shelters, beginning of Marshall Plan construction, rubble clearance",
    clothing: "post-war rationing clothing, Allied occupation uniforms, displaced persons, early Marshall Plan workers",
    colors: "post-war gray palette, rationing-era muted tones, Marshall Plan optimism blues, rubble grays",
    atmosphere: "exhaustion and hope, Marshall Plan aid, beginning of recovery, displaced populations",
    landscape: "European cities in ruins, Marshall Plan supply trucks, displaced persons camps, reconstruction sites",
    style: "post-WWII reconstruction photography, Marshall Plan documentation, European recovery imagery"
  },
  "1948": {
    scene: "Berlin Blockade, Communist coup in Czechoslovakia, Marshall Plan distributing aid",
    architecture: "Berlin divided, Communist buildings in Eastern Europe, Marshall Plan warehouses",
    clothing: "Berlin blockade civilians, Communist officials, Marshall Plan workers, divided Germany",
    colors: "Cold War palette, Berlin division grays, Communist red, Marshall Plan aid colors",
    atmosphere: "Cold War tensions rising, Europe divided, Soviet expansion, Western resistance",
    landscape: "blockaded Berlin, Communist Eastern Europe, Western aid distribution, divided continent",
    style: "early Cold War photography, Berlin blockade documentation, geopolitical tension imagery"
  },
  "1956": {
    scene: "Hungarian Revolution, Suez Crisis, Soviet suppression of Eastern European freedom",
    architecture: "Hungarian revolutionary barricades, Soviet tanks in Budapest, bombed Hungarian cities",
    clothing: "Hungarian revolutionaries, Soviet military, Hungarian civilians under siege",
    colors: "Hungarian Revolution red-white-green, Soviet military gray, barricade fire oranges",
    atmosphere: "revolution crushed by Soviet tanks, desperate freedom struggle, Eastern European oppression",
    landscape: "Budapest streets with barricades, Soviet tanks, Hungarian revolution sites, refugee flights",
    style: "Hungarian Revolution 1956 photography, Soviet suppression documentation, freedom struggle imagery"
  },
  "1961": {
    scene: "Berlin Wall construction, divided Germany, Cold War dividing Europe",
    architecture: "Berlin Wall being built, checkpoint checkpoints, divided Berlin, fortified border",
    clothing: "East German border guards, West Berlin civilians, Wall construction workers, divided families",
    colors: "Cold War grays, Berlin Wall concrete tones, East German red, West German black-red-gold",
    atmosphere: "Europe physically divided, families separated, Cold War reality made concrete",
    landscape: "Berlin Wall construction, Brandenburg Gate divided, fortified German border, watchtowers",
    style: "Berlin Wall 1961 photography, Cold War division documentation, divided Europe imagery"
  },
  "1968": {
    scene: "Prague Spring, Soviet invasion of Czechoslovakia, European student protests",
    architecture: "Prague under Soviet tanks, student protest barricades, Eastern Bloc buildings, Walled cities",
    clothing: "Czech protesters, Soviet tanks and soldiers, European student activists, Prague Spring reformers",
    colors: "Prague Spring gold and blue, Soviet military green, student protest colors, Eastern Bloc grays",
    atmosphere: "spring of freedom crushed, Soviet tanks in Prague, European student revolution, hope and repression",
    landscape: "Prague streets with Soviet tanks, student protest sites, Eastern Bloc capitals, reform movements",
    style: "1968 European protests photography, Prague Spring documentation, student revolution imagery"
  },
  "1989": {
    scene: "Fall of the Berlin Wall, peaceful revolution in Eastern Europe, Iron Curtain coming down",
    architecture: "Berlin Wall being torn down, East German buildings, peaceful revolution sites, border crossings",
    clothing: "celebrating East and West Germans, peaceful revolutionaries, border guards, European freedom fighters",
    colors: "Berlin Wall fall celebration colors, East German red, West German black-red-gold, triumph blues",
    atmosphere: "triumphant freedom, walls coming down, peaceful revolution, European unity returning",
    landscape: "Berlin Wall gates opening, East German crowds, border crossings, celebrating European cities",
    style: "1989 European revolution photography, Berlin Wall fall documentation, peaceful revolution imagery"
  },
  "1990": {
    scene: "German reunification, collapse of Soviet bloc, new democratic Europe emerging",
    architecture: "reunified Berlin, Brandenburg Gate celebrations, former East German transformation, new democratic institutions",
    clothing: "reunified German citizens, Eastern European freedom fighters, new democratic leaders",
    colors: "reunification black-red-gold, Eastern European freedom colors, new democracy blues",
    atmosphere: "hope and transformation, Iron Curtain falling, democratic awakening across Eastern Europe",
    landscape: "reunified Berlin, Brandenburg Gate crowds, former East Germany, new democratic Europe",
    style: "1990 European transformation photography, German reunification documentation, democratic awakening imagery"
  },
  "1995": {
    scene: "Bosnian War aftermath, Dayton Peace Agreement, Balkans reconstruction",
    architecture: "war-damaged Sarajevo, bombed Bosnian cities, peace agreement sites, reconstruction beginning",
    clothing: "Bosnian civilians, international peacekeepers, war survivors, Dayton negotiators",
    colors: "Bosnian conflict palette, peace agreement blues, war-damaged grays, reconstruction hope tones",
    atmosphere: "post-conflict recovery, international intervention, Balkan peace process, trauma and hope",
    landscape: "damaged Sarajevo, Dayton peace site, Balkan reconstruction, international peacekeeping",
    style: "Bosnian War aftermath photography, Dayton Peace documentation, Balkan recovery imagery"
  },
  "2001": {
    scene: "September 11 attacks impact on Europe, EU expansion debates, European security concerns",
    architecture: "European capitals responding to 9/11, EU institutions, security infrastructure",
    clothing: "European post-9/11 mourning, EU officials, European security forces",
    colors: "post-9/11 somber European palette, EU blue, mourning tones, security grays",
    atmosphere: "European solidarity after 9/11, security concerns, EU debates, unity in grief",
    landscape: "European capitals in mourning, EU institutions, security measures, solidarity gatherings",
    style: "post-9/11 European response photography, EU documentation, European solidarity imagery"
  },
  "2014": {
    scene: "Crimea annexation, Ukraine conflict, European sanctions, refugee crisis beginning",
    architecture: "Crimea military presence, Ukrainian protest sites (Maidan), European border crossings",
    clothing: "Ukrainian protesters, Russian military, European border workers, refugee families",
    colors: "Ukrainian blue-yellow, Crimea conflict grays, European Union blue, refugee crisis tones",
    atmosphere: "European security crisis, Ukrainian resistance, refugee crisis, geopolitical tension",
    landscape: "Crimea military, Ukrainian Maidan, European border crisis, refugee routes",
    style: "2014 European crisis photography, Ukraine conflict documentation, European security imagery"
  },
  "2020": {
    scene: "COVID-19 pandemic in Europe, lockdowns, empty European cities, healthcare crisis",
    architecture: "empty European streets, hospitals overwhelmed, lockdown barriers, masked public spaces",
    clothing: "COVID masks, healthcare workers, lockdown clothing, social distancing",
    colors: "pandemic grays and blues, hospital whites, mask colors, empty city tones",
    atmosphere: "global pandemic, empty streets, healthcare crisis, European unity in crisis",
    landscape: "empty European capitals, overwhelmed hospitals, quarantine zones, deserted tourist sites",
    style: "COVID-19 Europe photography, pandemic documentation, empty city imagery, healthcare crisis"
  },
  "2022": {
    scene: "Russian invasion of Ukraine, European refugee crisis, energy crisis, EU solidarity",
    architecture: "Ukrainian war damage, European refugee centers, energy infrastructure, EU solidarity sites",
    clothing: "Ukrainian refugees, European volunteers, Ukrainian defenders, EU officials",
    colors: "Ukrainian blue-yellow, European solidarity blues, war damage grays, refugee hope tones",
    atmosphere: "European solidarity, Ukrainian resistance, energy crisis, refugee support",
    landscape: "Ukrainian war zones, European refugee routes, energy infrastructure, EU border support",
    style: "2022 European crisis photography, Ukraine invasion documentation, European solidarity imagery"
  },
  // Ancient period — raw, unvarnished, dark, gritty realism
  "-3000": {
    scene: "Neolithic farming settlement in winter — muddy huts, smoke-choked air, starving livestock, people huddled around fire pits in the rain",
    architecture: "Linear Pottery Culture longhouses with sagging thatch roofs, mud-plastered walls cracking from damp, dark smoke-blackened interiors, crude wooden carts sunk in mud, bone hooks hanging from rafters",
    clothing: "rough-spun wool tunics stained with mud and grease, animal skins caked with dried blood and dirt, bone hairpins holding greasy hair, leather sandals worn through at the soles",
    colors: "mud brown, soot black, wet earth gray, dried blood rust, ash gray, dull ochre, rotten wood brown, foggy white",
    atmosphere: "constant damp and cold, smoke-filled air, exhaustion from daily survival, primitive fear of the surrounding dark forests, people huddled together for warmth",
    landscape: "mist-shrouded forest clearings, muddy floodplains, overcast skies, marshy ground, bare winter trees, gray river water",
    style: "gritty historical documentary photography, dark atmospheric lighting, raw unpolished realism, muted earth tones, weathered textures, no romanticization"
  },
  "-2000": {
    scene: "Bronze Age coastal settlement — salt-crusted fishing boats pulled up on muddy shore, people sorting fish by dim firelight, bronze tools half-buried in dirt",
    architecture: "timber-framed houses with thatch roofs sagging under years of rain, mud-brick storage pits half-collapsed, bronze-smithing hearth with soot-blackened walls, crude wooden granaries raised on posts",
    clothing: "coarse woolen garments stiff with salt and dirt, bronze belt buckles tarnished green, animal skins with fur still attached, hair greased with animal fat, rough leather sandals",
    colors: "salt-bleached wood gray, bronze patina green, dried fish brown, mud black, soot gray, dull gold, weathered bone white, foggy blue-gray",
    atmosphere: "brutal coastal life, constant wind and spray, scarcity of fresh water, bronze being precious and rare, people worn down by hard labor, dim firelight",
    landscape: "storm-battered coastline, muddy tidal flats, dark forest edge, overcast sky, rough seas, salt-crusted rocks, sparse vegetation",
    style: "dark documentary photography, muted desaturated palette, raw unvarnished realism, weathered textures, atmospheric fog and rain, no idealization"
  },
  "-1000": {
    scene: "Iron Age hillfort at dusk — iron weapons being forged in smoky furnaces, people huddled in dark timber halls, guards watching over the edge of the cliff in the fading light",
    architecture: "timber hillfort walls with sharpened stakes, dark iron-smelting furnaces belching smoke, longhouses with smoke-blackened interiors, crude stone foundations half-built, defensive ditches filled with rainwater",
    clothing: "rough wool cloaks heavy with rain and mud, iron belts and bronze torcs tarnished dark, animal skins stiff with dried mud, hair matted with dirt and grease, leather armor pieces",
    colors: "iron gray, mud brown, smoke black, tarnished bronze green, wet wool gray, dried blood rust, forest green dark, twilight blue-gray",
    atmosphere: "constant threat of attack, damp and cold, iron technology new and feared, dark forests surrounding settlements, people tense and watchful, smoke-filled air",
    landscape: "hilltop fortifications overlooking dark forests, rain-soaked earth, storm clouds gathering, muddy paths, twilight shadows, iron-smelting fires glowing in the dusk",
    style: "dark historical photography, desaturated earth tones, gritty unvarnished realism, atmospheric smoke and rain, weathered textures, no romanticization, raw documentary style"
  },
  "-500": {
    scene: "Late Iron Age European village — muddy streets, people working by firelight, iron tools and weapons scattered in the dirt, smoke rising from thatched roofs into gray sky",
    architecture: "timber-framed houses with sagging thatch roofs, mud walls stained with soot and rain, iron-smelting furnaces glowing in the twilight, crude defensive walls of packed earth and timber, granaries raised on wooden posts",
    clothing: "rough wool garments stiff with dirt and grease, iron brooches and bronze torcs tarnished dark, animal skins heavy with rain, hair matted with mud, leather sandals worn through",
    colors: "mud brown, iron gray, soot black, tarnished bronze green, wet wool gray, dried blood rust, forest green, twilight blue-gray, ash gray",
    atmosphere: "harsh daily survival, constant damp and cold, iron technology spreading, tribal tensions, people worn down by labor, smoke-filled air, dim firelight",
    landscape: "muddy village streets, dark forest edge, overcast sky, rain-soaked earth, iron-smelting fires glowing in the dusk, defensive earthworks, sparse vegetation",
    style: "dark documentary photography, desaturated earth tones, gritty unvarnished realism, atmospheric smoke and rain, weathered textures, no romanticization, raw historical documentation"
  },
  "0": {
    scene: "Rome at dawn — dusty streets with people hauling water jars, slaves dragging marble blocks, soldiers in worn armor marching through mud, the city sprawling under a hazy sky",
    architecture: "marble temples still being carved with visible tool marks, half-finished aqueducts with wooden scaffolding, crowded insulae apartment blocks leaning and crumbling, muddy roads with cart tracks, workshops with soot-stained walls",
    clothing: "worn wool tunics stained with dust and sweat, leather sandals cracked and patched, soldiers' armor dented and scratched, togas faded and dirty from wear, slaves in rough hemp garments",
    colors: "dusty ochre, marble white with tool marks, mud brown, soot black, worn terracotta, faded red, iron gray, hazy blue sky, sweat-stained linen",
    atmosphere: "harsh labor under the sun, dust and heat, inequality between rich and poor, city sprawling and chaotic, smell of sweat and dung, constant construction and decay",
    landscape: "dusty Roman roads with cart tracks, half-finished monuments, crowded tenement districts, marble quarries with workers, Tiber river muddy and polluted, hazy sunlight through dust",
    style: "dark historical documentary photography, desaturated earth tones, gritty unvarnished realism, atmospheric dust and heat, weathered stone textures, no romanticization, raw urban documentation"
  },
  "200": {
    scene: "Height of the Roman Empire under Antonine dynasty, Mediterranean trade at maximum, Roman urbanization peak",
    architecture: "Roman imperial architecture at peak: marble temples with Corinthian columns (Pantheon), triumphal arches (Arch of Marcus Aurelius), imperial forums with basilicas, Roman aqueducts (Aquae Claudia, Anio Novus), thermae of Caracalla, amphitheaters (Colosseum), Roman villas with elaborate mosaic floors, provincial city forums across Europe",
    clothing: "Roman senatorial togas with wide purple latus clavus stripes, imperial purple-dyed togas, Greek himations and chitons, Roman military lorica segmentata and lorica hamata armor, Roman women's stola and palla with gold jewelry, provincial dress conventions",
    colors: "Roman marble whites and creams, imperial Tyrian purple, Mediterranean azure and cerulean, terracotta roof reds, gold leaf highlights, Punic crimson, Egyptian gold",
    atmosphere: "Pax Romana prosperity at its zenith, Mediterranean trade dominance, Roman civic grandeur, Hellenistic scholarly culture, imperial religious syncretism, gladiatorial spectacles",
    landscape: "Roman road networks stretching between provinces, Mediterranean harbors full of grain ships, Roman provincial cities with forums and baths, Greek island sanctuaries, Egyptian Nile delta trade routes, Alpine passes connecting provinces",
    style: "Roman imperial painting tradition, Hellenistic realism, archaeological accuracy of Roman architecture and urban planning at peak, classical perspective, marble and gold textures"
  },
  "400": {
    scene: "Late Roman Empire in crisis, barbarian incursions, Christianization transforming Europe, Roman infrastructure declining",
    architecture: "damaged Roman marble temples being converted to churches, early Christian basilicas with mosaics, fortified city walls (Walls of Constantinople), Roman aqueducts in partial ruin, imperial palaces at Ravenna, Christian catacombs, Germanic longhouses on imperial territory",
    clothing: "Late Roman military uniforms with barbarian influences, Christian bishop vestments with gold embroidery, Roman senatorial dress with reduced purple trim, Germanic warrior clothing, early Christian monk robes, Eastern Roman court dress with silk and pearls",
    colors: "declining Roman palette, Christian gold and white mosaics, barbarian earth tones, fire and smoke grays, Late Roman imperial purple, marble whites fading",
    atmosphere: "end of an era, Christianization replacing paganism, barbarian pressure, Roman decline, cultural transformation",
    landscape: "damaged Roman cities, early Christian churches, fortified settlements, barbarian migration routes, Constantinople with Theodosian Walls, Roman provincial frontiers",
    style: "late Roman to early Christian transition art, classical architecture in decay, religious transformation, Byzantine mosaic influences"
  },
  "500": {
    scene: "Early Middle Ages, Frankish kingdom rising under Clovis, Byzantine Constantinople flourishing under Justinian, monastic scholarship preserving knowledge",
    architecture: "Frankish timber fortifications (motte-and-bailey), early Byzantine churches with golden mosaics (Hagia Sophia construction), monastic scriptoria in Ireland and Gaul, repurposed Roman basilicas, Merovingian burial churches, Roman ruins being quarried for building stone",
    clothing: "Frankish warrior clothing with bronze fibulae, Byzantine imperial purple robes with gold embroidery, monastic brown and white robes, Merovingian noble attire with gold torcs, early Christian bishop vestments, Celtic druid-inspired garments",
    colors: "early medieval palette, Byzantine gold mosaics, Frankish earth tones, monastic browns and whites, Celtic knotwork greens and reds, Merovingian gold",
    atmosphere: "post-Roman fragmentation, Byzantine cultural preservation, monastic learning, Frankish expansion, Christianization of Europe",
    landscape: "Frankish kingdoms, Byzantine Constantinople with Hagia Sophia, monastic communities in Ireland and Gaul, Roman ruins across Europe, Merovingian burial sites",
    style: "early medieval illumination style, Byzantine mosaic art, Frankish tribal aesthetics, Celtic knotwork influences"
  },
  "800": {
    scene: "Charlemagne crowned Emperor, Carolingian Renaissance, Viking raids beginning across Europe",
    architecture: "Carolingian palaces, Aachen chapel, Viking longships on coasts, fortified monasteries, Carolingian cathedrals",
    clothing: "Carolingian noble clothing, Viking warrior gear, monastic habits, Frankish military armor",
    colors: "Carolingian gold and crimson, Viking silver and blue, monastic brown, Frankish green and gold",
    atmosphere: "Frankish imperial power, Viking terror on coasts, Carolingian cultural rebirth, religious renewal",
    landscape: "Aachen palace chapel, Viking raid sites along coasts, Frankish monasteries, Carolingian court",
    style: "Carolingian illumination style, Viking Age art, Frankish imperial imagery, early medieval manuscript art"
  },
  "1000": {
    scene: "Viking Age peak, Norman settlements, Romanesque churches across Europe, feudal system established",
    architecture: "Viking longhouses and ships, Norman stone castles, Romanesque churches with thick walls, feudal manor houses",
    clothing: "Viking warrior clothing, Norman knight armor, monastic robes, peasant wool tunics, feudal lord attire",
    colors: "Viking silver and iron, Norman stone grays, Romanesque earth tones, feudal gold and crimson",
    atmosphere: "Viking expansion, Norman conquest preparation, Romanesque religious fervor, feudal order",
    landscape: "Viking longships on rivers, Norman castles under construction, Romanesque church building, feudal estates",
    style: "Viking Age art, Romanesque sculpture, Norman illumination, medieval manuscript art"
  },
  "1200": {
    scene: "High Middle Ages, Gothic cathedrals rising, Crusader states, medieval universities forming",
    architecture: "Gothic cathedrals (Notre-Dame, Chartres), Crusader castles in Holy Land, medieval universities, fortified towns",
    clothing: "medieval knight plate and chainmail, Gothic cathedral workers, Crusader Templar armor, scholar robes",
    colors: "Gothic stained glass blues and reds, Crusader white crosses, medieval gold leaf, stone gray",
    atmosphere: "Gothic architectural ambition, Crusader zeal, medieval scholasticism, feudal prosperity",
    landscape: "Gothic cathedral construction sites, Crusader castles on Holy Land hills, medieval university towns",
    style: "Gothic illumination style, Crusader art, medieval cathedral sculpture, high medieval manuscript art"
  },
  "1350": {
    scene: "Black Death devastating Europe, plague-ridden cities, social collapse and religious panic",
    architecture: "plague-stricken medieval cities, pest houses, deserted villages, churches with plague memorials",
    clothing: "plague doctor masks (later), mourning black, peasant rags, fleeing noble clothing, religious penitent robes",
    colors: "plague-era grays and blacks, death imagery, mourning tones, desperate earth colors",
    atmosphere: "terror of mass death, social collapse, religious panic, desperate prayer and penance",
    landscape: "dead medieval towns, mass graves, deserted fields, churches with plague crosses",
    style: "Black Death medieval art, Danse Macabre imagery, plague manuscript illumination, death and decay realism"
  },
  "1450": {
    scene: "Gutenberg printing press revolutionizing Europe, early Renaissance art, Fall of Constantinople approaching",
    architecture: "early Renaissance palaces, Gutenberg printing workshops, late Gothic churches, Ottoman siege engines at Constantinople",
    clothing: "early Renaissance merchant clothing, scholar robes, Ottoman military, late medieval peasant dress",
    colors: "Renaissance gold and crimson, Ottoman military red, early Renaissance blue, parchment and ink tones",
    atmosphere: "knowledge revolution, artistic rebirth, Ottoman threat to Byzantium, end of medieval era",
    landscape: "Florentine Renaissance workshops, Constantinople under Ottoman siege, printing presses, early Renaissance gardens",
    style: "early Renaissance painting style, Gutenberg era documentation, Ottoman siege art, transitional medieval-Renaissance"
  },
  "1500": {
    scene: "High Renaissance, Leonardo and Michelangelo, Ottoman conquest of Constantinople, European exploration begins",
    architecture: "Renaissance palaces (Palazzo Ruggieri), St. Peter's Basilica construction, Ottoman mosques over Byzantine churches, Venetian shipyards",
    clothing: "Renaissance silk and velvet, Ottoman janissary uniforms, Venetian merchant attire, scholarly robes",
    colors: "Renaissance gold and crimson, Ottoman military red, Venetian maritime blue, marble white",
    atmosphere: "artistic golden age, Ottoman expansion, European maritime exploration, Renaissance humanism",
    landscape: "Florentine Renaissance, Ottoman Constantinople with domes and minarets, Venetian harbors, early exploration ships",
    style: "High Renaissance painting style, Ottoman architectural art, Venetian maritime painting, Renaissance humanism"
  },
  "1600": {
    scene: "Spanish Golden Age, Dutch Golden Age, Thirty Years' War brewing, Shakespeare's England",
    architecture: "Spanish Habsburg palaces, Dutch canal houses, Elizabethan theaters, fortified Spanish roads, Baroque churches",
    clothing: "Spanish court black velvet, Dutch merchant clothing, Elizabethan ruffs and farthingales, Baroque noble attire",
    colors: "Spanish court black and gold, Dutch Golden Age warm tones, Elizabethan rich colors, Baroque dramatic lighting",
    atmosphere: "Spanish imperial power, Dutch maritime rise, religious conflict brewing, artistic flourishing",
    landscape: "Madrid Habsburg court, Amsterdam canals, Elizabethan London theater district, Spanish Flemish fields",
    style: "Spanish Golden Age painting, Dutch Golden Age art, Elizabethan theater imagery, early Baroque"
  },
  "1700": {
    scene: "Baroque Europe, Enlightenment beginning, European colonial empires expanding, scientific revolution",
    architecture: "Baroque palaces (Versailles), Enlightenment scientific academies, colonial trading posts, ornate Baroque churches",
    clothing: "Baroque noble attire with lace, Enlightenment scholar robes, colonial merchant clothing, powdered wig fashion",
    colors: "Baroque gold and crimson, Enlightenment cream and gold, colonial tropical colors, academic burgundy",
    atmosphere: "absolutist royal power, Enlightenment intellectual awakening, colonial expansion, scientific discovery",
    landscape: "Versailles palace gardens, Enlightenment salons in Paris, colonial trading posts, Baroque churches",
    style: "Baroque painting style, Enlightenment portraiture, colonial era art, scientific illustration"
  },
  "1800": {
    scene: "Napoleonic Wars, French Revolution aftermath, industrial revolution beginning, European powers reshuffled",
    architecture: "Napoleonic imperial buildings, early factories with smokestacks, Revolutionary Paris, Napoleonic military camps",
    clothing: "Napoleonic military uniforms (French, British, Prussian), post-Revolutionary French dress, early industrial worker clothing",
    colors: "Napoleonic military blue-red-gold, Revolutionary French tricolor, industrial soot and brick, dawn of industrialization",
    atmosphere: "Napoleonic ambition, revolutionary fervor, industrial transformation, European power struggle",
    landscape: "Napoleonic battlefield, early industrial Manchester, Revolutionary Paris, Napoleonic military campaigns across Europe",
    style: "Napoleonic era painting, David's neoclassical style, industrial revolution documentation, military painting"
  },
  "1850": {
    scene: "Industrial Revolution at peak, Victorian England, European nationalism rising, steam power transforming continent",
    architecture: "brick factories with smokestacks, Victorian railway stations, Gothic Revival churches, industrial worker housing",
    clothing: "Victorian formal wear, top hats, long crinoline dresses, industrial worker overalls, railway uniforms",
    colors: "Industrial Revolution sepia, Victorian red brick, steam white, gaslight amber, coal black",
    atmosphere: "industrial progress, Victorian morality, railway expansion, social inequality between classes",
    landscape: "smoky industrial Manchester, Victorian London with Big Ben, railway networks, factory towns",
    style: "Industrial era painting, Victorian photography, railway art, industrial revolution documentation"
  },
  "1900": {
    scene: "Fin de siècle Europe, Belle Époque elegance, imperial powers at peak, tensions building toward war",
    architecture: "Belle Époque Parisian boulevards, Art Nouveau buildings, imperial palaces, early electric tram systems",
    clothing: "Belle Époque high fashion, Art Nouveau elegance, imperial military uniforms, early 20th century formal wear",
    colors: "Belle Époque gold and cream, Art Nouveau green and turquoise, imperial military colors, Parisian café elegance",
    atmosphere: "elegant fin de siècle, imperial confidence, underlying tensions, cultural sophistication",
    landscape: "Parisian Belle Époque, Art Nouveau Brussels, imperial Vienna, Berlin Wilhelmstraße, European capitals at peak",
    style: "Belle Époque painting, Art Nouveau illustration, imperial era photography, fin de siècle elegance"
  },
  "1910": {
    scene: "Pre-War Europe, Edwardian elegance, military buildup, Art Nouveau reaching its peak before WWI",
    architecture: "Art Nouveau theaters and exhibition halls, Edwardian grand hotels, military barracks, early skyscrapers in Vienna and Budapest, ornate train stations",
    clothing: "Edwardian high fashion with tall hats and corseted silhouettes, military uniforms with elaborate braiding, Art Nouveau dress reform, formal day and evening wear",
    colors: "Edwardian cream and gold, Art Nouveau olive green and turquoise, military blues and reds, sepia-toned photography",
    atmosphere: "pre-war elegance masking growing tensions, Art Nouveau cultural flowering, military parade culture, imperial grandeur",
    landscape: "Art Nouveau Brussels and Paris, Edwardian London, Belle Époque Vienna, pre-war European capitals",
    style: "Art Nouveau illustration, Edwardian photography, pre-war military illustration, Belle Époque painting"
  },
  "1920": {
    scene: "Interwar Europe, roaring twenties, Treaty of Versailles aftermath, new nations emerging from collapsed empires",
    architecture: "Art Deco buildings rising across Europe, war-damaged cities being rebuilt, new national capitals, modernist architecture experiments, League of Nations buildings",
    clothing: "1920s flapper dresses with fringe, cloche hats, Art Deco menswear with sharp tailoring, military veterans in uniform, bobbed hair fashion",
    colors: "Art Deco black and gold, jazz age brights, war memorial grays, 1920s neon, sepia and silver screen tones",
    atmosphere: "roaring twenties energy, post-war trauma, cultural liberation, jazz age excess, political instability beneath glamour",
    landscape: "1920s Parisian nightlife, Berlin cabaret scene, newly independent Eastern European capitals, Versailles peace conference",
    style: "Art Deco poster art, 1920s photography, jazz age illustration, post-war reconstruction documentation"
  },
  "1930": {
    scene: "Great Depression Europe, economic collapse, rise of totalitarian regimes, economic recovery efforts",
    architecture: "Art Deco and Bauhaus buildings, Depression-era public works, fascist monumental architecture, economic recovery projects, fortified borders",
    clothing: "1930s Depression-era fashion, Hollywood glamour influence, tailored suits with wide lapels, flapper-to-glamour transition, military uniforms with growing prominence",
    colors: "1930s sepia and muted tones, Art Deco metallics, Depression grays, Hollywood gold, political propaganda reds and blacks",
    atmosphere: "economic hardship masking glamour, political extremism rising, Depression-era resilience, pre-war tension building",
    landscape: "1930s European capitals, Art Deco architecture, Depression-era bread lines, fascist architectural projects, fortified borders",
    style: "1930s Art Deco photography, Bauhaus aesthetic, Depression-era documentary, pre-war political poster art"
  },
  "1940": {
    scene: "World War II Europe, occupation and resistance, total war mobilization, European continent divided by Nazi control",
    architecture: "wartime blackout-covered cities, Luftwaffe bomb-damaged buildings, resistance hideouts in historic cellars, military headquarters in occupied palaces, coastal Atlantic Wall fortifications, underground resistance networks in old catacombs and tunnels",
    clothing: "wartime rationed clothing with patched hems, women in factory overalls and bandanas (Rosie the Riveter style), military uniforms (German Wehrmacht field gray, British khaki, Soviet olive drab), black market silk stockings, resistance fighter civilian clothes, occupation military uniforms with foreign insignia",
    colors: "wartime desaturated palette, olive drab and field gray military tones, blackout black, rationed fabric grays, propaganda poster reds and golds, bomb-damaged stone rubble, winter grays and whites",
    atmosphere: "wartime tension and blackout curtains, resistance hope amid occupation, total war mobilization, rationing and scarcity, air raid sirens and shelter life, European continent at war",
    landscape: "bomb-damaged European cityscapes, coastal Atlantic Wall fortifications, occupied Paris with swastika flags, resistance countryside hideouts, military supply convoys on historic roads, rationed urban markets",
    style: "wartime military photography, propaganda poster art, documentary photojournalism, desaturated wartime color palette, air raid shelter atmosphere"
  },
  "1945": {
    scene: "End of World War II, European liberation, ruins and devastation, Allied victory, beginning of reconstruction",
    architecture: "bomb-damaged Gothic cathedrals, rubble-strewn city centers, Allied military headquarters, temporary refugee camps in historic buildings, early reconstruction scaffolding, liberated concentration camp perimeter fences",
    clothing: "Allied military liberation uniforms (American GIs, British soldiers, Soviet Red Army), civilian refugee clothing with patches, women in practical work clothes, liberated prisoners in striped camp uniforms, occupation military uniforms being removed",
    colors: "wartime desaturated tones, liberation blue skies, rubble grays and browns, Allied military colors (American khaki, British red, Soviet red), victory red-white-blue, winter white",
    atmosphere: "relief and exhaustion of liberation, devastation and loss, hope for peace, beginning of rebuilding, Allied victory celebrations mixed with grief",
    landscape: "liberated European cities with Allied flags, bomb-damaged historic landmarks, refugee columns on country roads, Allied military supply lines, early reconstruction efforts",
    style: "wartime photojournalism, liberation photography, documentary realism, desaturated wartime tones with victory color accents"
  },
  "1950": {
    scene: "Post-war Europe, Marshall Plan reconstruction, early Cold War division, economic recovery beginning",
    architecture: "Marshall Plan reconstruction sites, early modernist housing blocks, bomb ruins being cleared, Berlin Wall construction beginning, European coal and steel industry rebuilding, temporary wooden prefabricated housing",
    clothing: "1950s Dior New Look fashion for women, men in post-war suits with narrow lapels, Soviet military occupation uniforms, European working-class practical clothing, early youth fashion rebellion",
    colors: "1950s pastel revival, Marshall Plan optimism, Cold War grays and blues, European reconstruction browns, Soviet red, Dior black and white",
    atmosphere: "post-war recovery, Cold War anxiety, European unity efforts, economic rebuilding, generational tension between wartime and peace",
    landscape: "rebuilding European cities, Marshall Plan construction sites, early Berlin Wall, European coal mines, post-war refugee camps, emerging NATO borders",
    style: "1950s European photography, Marshall Plan documentation, Cold War political art, post-war reconstruction imagery"
  },
  "1960": {
    scene: "European economic boom, youth revolution, Space Age optimism, European integration deepening",
    architecture: "Space Age modernist architecture, early European Parliament building, shopping centers with modern design, youth culture venues, European Economic Community headquarters, brutalist government buildings",
    clothing: "1960s mod fashion with geometric patterns, youth rebellion mini skirts and go-go boots, European business suits with slim cut, Beatles-influenced hair and clothing, early hippie counterculture",
    colors: "1960s mod brights (orange, pink, turquoise), Space Age silver and white, European Union blue, youth culture rainbow, mod geometric patterns",
    atmosphere: "youth culture rebellion, European economic optimism, Space Age technological wonder, generation gap, European integration progress",
    landscape: "1960s European capitals with modern architecture, youth culture streets, European Economic Community institutions, Space Age exhibitions, mod fashion districts",
    style: "1960s mod illustration, Space Age design, European pop art, youth culture photography, mod fashion editorial"
  },
  "1970": {
    scene: "European oil crisis, Eurocommunism, European cooperation strengthening, post-60s cultural shift",
    architecture: "1970s brutalist architecture, European Council buildings, oil crisis impact on urban planning, Eurocommunist movement centers, social housing projects, early European highway networks",
    clothing: "1970s disco fashion with wide collars, Eurocommunist worker clothing, European business casual, hippie counterculture clothing, oil crisis practical fashion, European punk emerging",
    colors: "1970s earth tones (brown, orange, olive), disco metallics, Eurocommunist red, European Union blue, oil crisis grays, punk black and neon",
    atmosphere: "oil crisis uncertainty, Eurocommunist political movement, disco culture, European integration progress, punk rebellion beginning",
    landscape: "1970s European cities with brutalist architecture, oil crisis fuel queues, European Council meetings, disco venues, Eurocommunist demonstrations",
    style: "1970s European photography, Eurocommunist political art, disco era fashion, brutalist architecture documentation"
  },
  "1980": {
    scene: "Cold War peak, European nuclear tension, Thatcher-Reagan era, European cultural renaissance",
    architecture: "1980s corporate architecture, NATO missile sites, European cultural centers, early shopping malls, Berlin Wall checkpoints, punk and new wave venues",
    clothing: "1980s power suits with broad shoulders, punk fashion with leather and studs, new wave fashion with neon, European business attire, Cold War military uniforms, disco-to-new-wave transition",
    colors: "1980s neon brights (pink, cyan, yellow), Cold War grays and military greens, punk black and safety pins, European Union blue, power suit navy and burgundy",
    atmosphere: "Cold War nuclear anxiety, European cultural confidence, punk and new wave energy, Thatcher-era conservatism, European economic transformation",
    landscape: "1980s European capitals with punk and new wave culture, NATO missile sites, Berlin Wall checkpoints, European shopping districts, Cold War military installations",
    style: "1980s European photography, punk and new wave aesthetics, Cold War documentation, European pop culture imagery"
  },
  "1989": {
    scene: "Fall of the Berlin Wall, European democratization, end of Cold War, European unity celebrations",
    architecture: "Berlin Wall being torn down, historic European buildings with new democracy, European Parliament expansion, democratization monuments, border crossing points, European unity commemorative sites",
    clothing: "1989 celebration fashion, European democratic movement clothing, East and West German unification fashion, European political leader attire, youth culture at democratic revolutions",
    colors: "1989 celebration colors (German black-red-gold, European Union blue with stars), Cold War ending grays, democratic movement reds and whites, Berlin Wall graffiti rainbow, European unity gold",
    atmosphere: "democratic euphoria, Cold War ending, European unity hope, fall of iron curtain, generational freedom, European renaissance",
    landscape: "Berlin Wall falling, European democratization sites, European Parliament celebrations, border crossings opening, European unity monuments being built",
    style: "1989 European photography, democratic revolution documentation, Cold War ending imagery, European unity celebration art"
  },
  "1995": {
    scene: "European Union expansion, post-Cold War prosperity, Euro currency preparation, European cultural integration",
    architecture: "Euro currency preparation facilities, European Union expansion monuments, post-Cold War reconstruction, European high-speed rail networks, EU institution buildings, European cultural heritage sites",
    clothing: "1990s European fashion, EU official attire, post-Cold War business casual, European youth culture fashion, Euro currency celebration clothing, European integration symbolism in dress",
    colors: "Euro blue and gold, European Union flag colors, 1990s European pastels, post-Cold War optimism brights, European cultural heritage earth tones",
    atmosphere: "European integration optimism, Euro currency excitement, post-Cold War prosperity, cultural renaissance, European unity celebration",
    landscape: "European Union expansion sites, Euro currency preparation, European cultural heritage sites, post-Cold War European capitals, European high-speed rail networks",
    style: "1990s European photography, Euro currency documentation, European integration celebration art, post-Cold War European imagery"
  },
  "2000": {
    scene: "Millennium Europe, Euro currency launch, European digital transformation, EU enlargement preparation",
    architecture: "Euro currency facilities, European digital infrastructure, EU enlargement monument sites, modern European architecture, Millennium celebration venues, European tech hubs",
    clothing: "Y2K fashion with metallic and futuristic elements, European business attire, EU official clothing, European youth digital culture fashion, Millennium celebration attire",
    colors: "Euro blue and gold, Y2K silver and white, European Union brights, Millennium celebration colors, digital age blues and greens",
    atmosphere: "Millennium celebration, Euro currency launch, European digital optimism, EU enlargement hope, technological transformation",
    landscape: "Euro currency launch sites, European digital infrastructure, EU enlargement preparation sites, Millennium celebration venues, European tech hubs",
    style: "Y2K European photography, Euro currency documentation, European digital transformation imagery, Millennium celebration art"
  },
  "2010": {
    scene: "European debt crisis, digital Europe, migration debates, European resilience and adaptation",
    architecture: "European debt crisis austerity measures, digital innovation hubs, migration reception centers, European recovery architecture, tech startup spaces, European cultural revival sites",
    clothing: "2010s European fashion, tech industry casual wear, European business attire, migration-influenced clothing, European youth digital culture fashion, sustainable fashion emerging",
    colors: "2010s European muted tones, tech industry grays and blues, European Union blue, sustainable fashion greens, digital age silver and white",
    atmosphere: "European debt crisis uncertainty, digital transformation, migration challenges, European resilience, sustainable future hope",
    landscape: "European debt crisis sites, digital innovation hubs, migration routes, European recovery efforts, tech startup districts, European cultural revival sites",
    style: "2010s European photography, digital transformation documentation, European resilience imagery, sustainable future art"
  },
  "2020": {
    scene: "Pandemic Europe, digital acceleration, climate crisis awareness, European solidarity and recovery",
    architecture: "Pandemic-era temporary medical facilities, digital transformation architecture, climate crisis adaptation buildings, European solidarity monuments, remote work spaces, European recovery construction",
    clothing: "Pandemic-era practical clothing, digital age fashion, climate-conscious sustainable fashion, European solidarity symbols in dress, remote work attire, European recovery fashion",
    colors: "Pandemic blues and whites, digital age silver and black, climate crisis greens and earth tones, European Union solidarity colors, recovery brights",
    atmosphere: "Pandemic isolation and solidarity, digital acceleration, climate crisis urgency, European unity in crisis, recovery and hope",
    landscape: "Pandemic European cities, digital transformation sites, climate crisis adaptation, European solidarity monuments, recovery construction, sustainable European architecture",
    style: "Pandemic-era European photography, digital transformation documentation, climate crisis imagery, European solidarity art"
  },
  "2025": {
    scene: "Modern Europe, AI transformation, climate action leadership, European strategic autonomy, digital single market",
    architecture: "AI innovation centers, climate-neutral buildings, European digital infrastructure, strategic autonomy facilities, smart city developments, European green architecture",
    clothing: "Modern European fashion, sustainable tech wear, AI-influenced design, climate-conscious materials, European business innovation attire, smart fabric clothing",
    colors: "Modern European blues and greens, AI silver and white, climate action earth tones, European Union colors, sustainable fashion palette",
    atmosphere: "European technological leadership, climate action urgency, AI transformation, European strategic vision, sustainable future optimism",
    landscape: "Modern European AI hubs, climate-neutral cities, European digital infrastructure, strategic autonomy sites, smart European cities, green architecture",
    style: "Modern European photography, AI transformation documentation, climate action imagery, European strategic future art"
  }
};

// City-specific historical architecture references for more accurate prompts
const countryArch = {
  "Greece": {
    architecture: "Byzantine churches with golden mosaics, Ottoman-era mosques, neoclassical Athens buildings, whitewashed Cycladic houses, mountain stone villages",
    colors: "Mediterranean blues, white stucco, golden stone, azure sea, terracotta roofs",
    atmosphere: "Aegean sunlight, maritime trade, ancient ruins amid modern life, Mediterranean climate",
    landscape: "Aegean islands, mountainous terrain, coastal villages, olive groves, ancient Acropolis hill",
    visualStyle: "Greek island aesthetic, Byzantine golden mosaics, neoclassical architecture, Mediterranean light"
  },
  "Italy": {
    architecture: "Renaissance palazzos with frescoed facades, Baroque churches with gilded interiors, Roman aqueducts, Tuscan hill towns, Venetian Gothic palaces",
    colors: "warm ochre and sienna, terracotta reds, golden limestone, Mediterranean azure, Renaissance gold leaf",
    atmosphere: "Renaissance artistic heritage, papal grandeur, Mediterranean coastal life, Italian piazza culture",
    landscape: "Tuscan rolling hills, Roman countryside, Venetian lagoons, Amalfi coastline, Po valley",
    visualStyle: "Italian Renaissance painting tradition, Baroque theatricality, Mediterranean warmth, fresco textures"
  },
  "Spain": {
    architecture: "Moorish horseshoe arches, Mudéjar tilework, Gothic cathedrals with pointed spires, whitewashed Andalusian houses, Alcázar fortresses",
    colors: "vibrant azulejo blues and yellows, white stucco, terracotta, deep crimson, golden Mediterranean light",
    atmosphere: "Moorish-Christian cultural fusion, flamenco passion, Iberian heat, Inquisition shadows",
    landscape: "arid Meseta plateau, Andalusian white villages, Pyrenees mountains, Mediterranean coast",
    visualStyle: "Spanish Golden Age painting, Moorish geometric patterns, Iberian warmth, dramatic chiaroscuro"
  },
  "Portugal": {
    architecture: "Manueline maritime Gothic with rope carvings, azulejo-tiled facades, medieval Alfama narrow streets, Belém Tower, Baroque gold-leaf churches",
    colors: "azulejo cobalt blue and white, golden limestone, terracotta, Atlantic gray, Tagus river gold",
    atmosphere: "Age of Discovery legacy, maritime adventure, fado melancholy, Atlantic coastal life",
    landscape: "Atlantic coastline, Tagus river estuary, Sintra misty hills, Algarve cliffs, cork oak forests",
    visualStyle: "Portuguese azulejo tile art, Manueline maritime Gothic, Atlantic maritime painting, golden hour light"
  },
  "Turkey": {
    architecture: "Ottoman imperial mosques with slender minarets, Byzantine domed churches, grand bazaar vaulted ceilings, Bosphorus waterfront yalı houses, ancient Roman forums",
    colors: "Ottoman turquoise and cobalt, golden domes, Bosphorus blue, stone beige, garden pomegranate red",
    atmosphere: "East-meets-West crossroads, Ottoman imperial grandeur, Bosphorus strait breezes, minaret call to prayer",
    landscape: "Bosphorus strait dividing continents, Anatolian plateau, Istanbul hills, Aegean coastline",
    visualStyle: "Ottoman miniature painting, Byzantine mosaic art, Turkish Iznik tile patterns, Bosphorus maritime scene"
  },
  "France": {
    architecture: "Haussmannian limestone boulevards with mansard roofs, Gothic ribbed vaults, Baroque palace gardens, neoclassical columns, Parisian ironwork balconies",
    colors: "Parisian limestone gray-blue, Seine river silver, Haussmann cream, Baroque gold, Provençal lavender purple",
    atmosphere: "Belle Époque elegance, Enlightenment intellectualism, Parisian café culture, royal court grandeur",
    landscape: "Seine river winding through Paris, Loire Valley châteaux, Provençal lavender fields, Normandy cliffs",
    visualStyle: "French Impressionist painting, Haussmannian urbanism, Baroque theatricality, Parisian golden light"
  },
  "United Kingdom": {
    architecture: "Gothic pointed arches and flying buttresses, Georgian red-brick townhouses, Roman wall remnants, Scottish baronial towers, Thames stone bridges",
    colors: "London fog gray, Georgian red brick, Gothic stone, Scottish heather purple, Thames silver, British Museum white marble",
    atmosphere: "Industrial Revolution smoke, British Empire power, foggy London streets, parliamentary tradition",
    landscape: "Thames riverfront, Scottish Highlands mist, English countryside hedgerows, White Cliffs of Dover",
    visualStyle: "British watercolor painting tradition, Gothic Revival architecture, Victorian industrial realism, foggy atmospheric perspective"
  },
  "Netherlands": {
    architecture: "canal gabled houses with stepped and neck gables, Dutch Renaissance symmetry, brick Gothic churches, wooden windmill towers, polder dikes",
    colors: "Dutch canal water gray-green, brick red, windmill wood brown, overcast sky silver, tulip field rainbow",
    atmosphere: "Dutch Golden Age merchant wealth, canal ring urbanism, windmill landscape, polder water management",
    landscape: "Amsterdam canal ring, flat polder fields, windmill-dotted countryside, North Sea dykes",
    visualStyle: "Dutch Golden Age painting, Vermeer interior light, canal perspective, flat landscape realism"
  },
  "Belgium": {
    architecture: "Gothic flamboyant guildhalls with ornate facades, Art Nouveau ironwork staircases, medieval stone walls, Baroque church interiors, cobblestone market squares",
    colors: "Brugse Zotte brick red, Gothic stone gray, Art Nouveau wrought iron green, Belgian chocolate brown, Flemish tapestry gold",
    atmosphere: "Flemish medieval merchant wealth, Art Nouveau innovation, cobblestone charm, European capital bureaucracy",
    landscape: "Brussels Grand-Place, Brugse canals, Flemish countryside, Ardennes forest, Belgian coal mining regions",
    visualStyle: "Flemish Primitives painting, Art Nouveau organic forms, Gothic detail, medieval urban atmosphere"
  },
  "Switzerland": {
    architecture: "Alpine chalet wooden architecture, medieval fortified churches, neoclassical federal buildings, stone bridges over mountain streams, timber balconies",
    colors: "Swiss white stone, Alpine green meadows, timber brown, sky blue, snow white, church gold crosses",
    atmosphere: "Alpine serenity, Swiss neutrality, mountain pastoral life, confederate independence, precision craftsmanship",
    landscape: "Alpine peaks and valleys, glacial lakes, mountain meadows, Swiss Plateau, Rhine Gorge",
    visualStyle: "Alpine landscape painting, Swiss folk art, mountain realism, pastoral tranquility, crisp mountain light"
  },
  "Germany": {
    architecture: "Gothic brick churches with pointed spires, Baroque palace gardens, Prussian neoclassical colonnades, half-timbered Fachwerk houses, Rhine castle ruins",
    colors: "Prussian blue, brick red, Baroque gold, forest green, Rhine stone gray, timber brown",
    atmosphere: "Prussian military discipline, German Enlightenment philosophy, Romantic movement, industrial progress",
    landscape: "Rhine river valley, Black Forest, Bavarian Alps, Brandenburg plains, Berlin urban sprawl",
    visualStyle: "German Romantic painting, Caspar David Friedrich atmospheric mood, Gothic brick architecture, Baroque grandeur"
  },
  "Austria": {
    architecture: "Habsburg Baroque palaces with golden interiors, Gothic St. Stephen's spire, Ringstraße neoclassical boulevards, Vienna coffee house architecture, Alpine fortress churches",
    colors: "Habsburg imperial gold, Baroque cream, Gothic stone, Alpine green, Danube blue, coffee house mahogany",
    atmosphere: "Imperial Habsburg grandeur, Viennese musical culture, coffee house intellectualism, Alpine serenity",
    landscape: "Vienna Ringstraße, Danube river, Alpine mountains, Bohemian forest, Austrian lakes",
    visualStyle: "Vienna Secession art, Baroque theatricality, Imperial court painting, Alpine landscape tradition"
  },
  "Czechia": {
    architecture: "Gothic Prague Castle spires, Charles Bridge stone towers, Baroque church domes, Art Nouveau Secession building, Old Town astronomical clock, medieval narrow streets",
    colors: "Prague golden stone, Charles Bridge gray, Baroque white, Vltava river blue, Bohemian garnet red, golden sunset",
    atmosphere: "Bohemian Gothic majesty, Habsburg imperial presence, Golden Prague legend, beer culture, intellectual tradition",
    landscape: "Vltava river winding, Prague Castle hill, Bohemian Switzerland sandstone, Czech karst, Šumava forest",
    visualStyle: "Bohemian Gothic art, Prague Golden Age painting, Art Nouveau elegance, Central European atmospheric mood"
  },
  "Poland": {
    architecture: "Gothic brick churches with terracotta ornament, medieval market squares with Renaissance arcades, Baroque royal palaces, wooden Tatar architecture, Wawel Castle Gothic towers",
    colors: "Polish brick red, Baroque gold, Vistula silver, Warsaw stone gray, golden wheat fields, forest green",
    atmosphere: "Polish noble tradition, Catholic devotion, medieval merchant wealth, wartime resilience, Royal route grandeur",
    landscape: "Vistula river valley, Warsaw Old Town, Kraków Wawel Hill, Baltic coast, Tatra mountain foothills",
    visualStyle: "Polish Romantic painting, Gothic brick tradition, Baroque Polish magnificence, Central European solemnity"
  },
  "Hungary": {
    architecture: "Gothic Matthias Church with colorful roof tiles, Art Nouveau Parliament Building with spires, Ottoman-era mosques with minarets, thermal bath domes, Buda Castle terraces",
    colors: "Hungarian red-green-white, thermal bath stone beige, Ottoman turquoise, Parliament golden stone, Danube blue, paprika red",
    atmosphere: "Hungarian Parliament grandeur, Ottoman architectural legacy, thermal bath culture, Hungarian national revival",
    landscape: "Danube bend at Buda, Hungarian Puszta plains, thermal springs, Lake Balaton, Mátra mountains",
    visualStyle: "Hungarian Art Nouveau, Ottoman-Hungarian fusion, Parliament Gothic revival, Central European romanticism"
  },
  "Russia": {
    architecture: "onion-domed Orthodox cathedrals with colorful patterns, Kremlin fortress walls, neoclassical St. Petersburg palaces, wooden peasant izbas, Orthodox cross-topped churches",
    colors: "Russian Orthodox gold domes, Kremlin red brick, St. Petersburg blue-green domes, white stone, winter snow, Orthodox blue",
    atmosphere: "Russian Orthodox spirituality, Imperial grandeur, vast northern landscape, tsarist power, winter harshness",
    landscape: "Moscow Kremlin hill, Volga river, Siberian taiga, St. Petersburg canals, Ural mountains",
    visualStyle: "Russian Orthodox icon painting tradition, Imperial court painting, vast northern landscape, golden dome luminosity"
  },
  "Ukraine": {
    architecture: "Byzantine golden-domed Orthodox churches, Ukrainian Baroque spires, Kyiv Pechersk Lavra caves, wooden Tatar architecture, Cossack church fortifications",
    colors: "Ukrainian blue and yellow, Orthodox gold domes, Kyiv stone beige, steppe wheat gold, Dnieper blue, wooden brown",
    atmosphere: "Cossack warrior tradition, Orthodox spiritual depth, Ukrainian Baroque exuberance, steppe vastness, Kyiv ancient heritage",
    landscape: "Dnieper river gorge, Ukrainian steppe, Carpathian foothills, Kyiv hilltops, Black Sea coast",
    visualStyle: "Ukrainian Baroque painting, Byzantine Orthodox icon tradition, Cossack folk art, steppe landscape realism"
  },
  "Romania": {
    architecture: "Romanian Orthodox churches with colorful exterior frescoes, Ottoman-influenced boyar houses, Carol I neoclassical buildings, Bran Castle Gothic towers, wooden peasant churches",
    colors: "Romanian blue and yellow, Orthodox fresco reds and blues, Carpathian green, Bucharest stone beige, Dâmbovița river blue",
    atmosphere: "Carpathian mountain mystique, Orthodox spiritual tradition, Wallachian boyar culture, Dracula legend shadows",
    landscape: "Carpathian mountain curves, Transylvanian hills, Bucharest boulevards, Danube Delta, Prahova valley",
    visualStyle: "Romanian Orthodox icon painting, Carpathian folk art, Byzantine-Romanian fusion, Transylvanian Gothic"
  },
  "Bulgaria": {
    architecture: "Byzantine Boyana Church medieval frescoes, Roman Serdica amphitheater ruins, Bulgarian Orthodox round churches, Ottoman mosques with tiled domes, Rila Monastery fortresses",
    colors: "Bulgarian Orthodox gold, Byzantine fresco reds, Ottoman turquoise, Rila mountain green, Balkan stone gray",
    atmosphere: "First Bulgarian Empire heritage, Orthodox spiritual depth, Ottoman architectural legacy, Rila mountain monasticism",
    landscape: "Rila mountain peaks, Balkan ridge, Danube plain, Black Sea coast, Thracian valley",
    visualStyle: "Bulgarian medieval fresco painting, Byzantine mosaic tradition, Ottoman-Bulgarian fusion, Balkan mountain realism"
  },
  "Serbia": {
    architecture: "Serbian medieval monastery frescoes, Belgrade Fortress stone walls, Ottoman Kalemegdan towers, Orthodox church golden domes, traditional wooden houses",
    colors: "Serbian red-blue-white, Belgrade stone beige, Orthodox gold domes, Sava river gray, Kalemegdan brick red",
    atmosphere: "Serbian medieval spiritual heritage, Ottoman military architecture, Belgrade confluence power, Orthodox faith endurance",
    landscape: "Sava-Danube confluence, Belgrade hilltop fortress, Serbian mountain ranges, Morava valley, Fruška Gora",
    visualStyle: "Serbian medieval fresco tradition, Orthodox icon painting, Ottoman military architecture, Balkan fortress realism"
  },
  "Bosnia": {
    architecture: "Ottoman sebilj fountains with tiled domes, Latin Bridge stone arches, Gazi Husrev-beg Mosque with minaret, Austro-Hungarian buildings with ornate facades, narrow Baščaršija cobblestone streets",
    colors: "Ottoman turquoise domes, Austro-Hungarian cream, Bosnian stone gray, Dinaric green, Baščaršija copper orange",
    atmosphere: "Ottoman-Islamic cultural fusion, Austro-Hungarian European influence, Bosnian mountain heritage, Sarajevo crossroads",
    landscape: "Vratnik gorge, Dinaric Alps, Miljacka river, Sarajevo valley, Bosnian highlands",
    visualStyle: "Bosnian Ottoman miniature, Austro-Hungarian academic architecture, Balkan cultural fusion, Sarajevo urban atmosphere"
  },
  "Sweden": {
    architecture: "medieval Gamla Stan narrow streets with cobblestones, Swedish wooden architecture with red paint, Baltic Sea harbor fortifications, Gothic brick churches, Nordic Baroque palaces",
    colors: "Swedish red Falu red, Baltic Sea gray-blue, church gold crosses, Gamla Stan stone beige, forest green, winter white",
    atmosphere: "Swedish medieval merchant tradition, Baltic naval power, Nordic simplicity, Lutheran austerity, Golden Age cultural flowering",
    landscape: "Stockholm archipelago, Swedish forest lakes, Baltic Sea coast, Gamla Stan island, Swedish highland plateau",
    visualStyle: "Swedish Golden Age painting, Nordic medieval art, Baltic maritime tradition, Swedish folk art simplicity"
  },
  "Norway": {
    architecture: "medieval wooden stave churches with dragon-head roof ornaments, Norwegian longhouse timber architecture, fjord-side wooden houses, Viking-age boat building sites, Norwegian Romantic architecture",
    colors: "Norwegian fjord blue, stave church wood brown, Norse red, mountain green, snow white, Norwegian gold crosses",
    atmosphere: "Viking heritage, Norwegian fjord majesty, Norse pagan spirituality, maritime seafaring, mountain isolation",
    landscape: "Norwegian fjord cliffs, Arctic landscape, mountain passes, coastal archipelago, glacial valleys",
    visualStyle: "Norwegian Romantic painting, Norse art motifs, fjord landscape realism, Viking Age reconstruction, Nordic melancholy"
  },
  "Denmark": {
    architecture: "medieval brick Gothic churches with pointed spires, Nyhavn colorful gabled waterfront houses, Danish Renaissance castles with manicured gardens, Viking longship harbor sites, Baroque royal palaces",
    colors: "Nyhavn reds and yellows, Danish brick red, Baltic blue, castle white, church gold crosses, Danish green meadows",
    atmosphere: "Danish Viking maritime heritage, Nyhavn merchant prosperity, Danish Golden Age painting, royal court elegance",
    landscape: "Copenhagen harbor and canals, Danish island archipelago, Jutland peninsula, Baltic Sea coast, Danish flat countryside",
    visualStyle: "Danish Golden Age painting, Nyhavn harbor scene, Danish coastal realism, Viking Age maritime art"
  },
  "Finland": {
    architecture: "neoclassical white stone Senate Square buildings, Helsinki Cathedral with green copper domes, Finnish National Romantic architecture with stone facades, white wooden Orthodox churches, Baltic Sea harbor fortifications",
    colors: "Helsinki white stone, cathedral green copper, Baltic Sea blue, forest pine green, winter snow white, Orthodox gold domes",
    atmosphere: "Finnish national awakening, Nordic neoclassical elegance, Baltic maritime tradition, Orthodox cultural heritage, winter landscape mystique",
    landscape: "Helsinki harbor, Finnish lakeland archipelago, Baltic Sea coast, Finnish forest, archipelago islands",
    visualStyle: "Finnish National Romantic painting, Nordic neoclassical architecture, Baltic maritime tradition, Finnish winter landscape"
  },
  "Latvia": {
    architecture: "medieval Riga Old Town Gothic brick churches, Art Nouveau architecture district with ornate facades, Daugava river port fortifications, Hanseatic League merchant houses, Latvian wooden architecture",
    colors: "Riga brick red, Art Nouveau wrought iron green, Daugava river blue, Old Town stone gray, Latvian amber gold, church gold crosses",
    atmosphere: "Hanseatic League merchant heritage, Art Nouveau architectural innovation, Latvian national revival, Baltic maritime trade",
    landscape: "Riga Old Town canals, Daugava river, Latvian coastal plain, Baltic Sea shore, Riga湾",
    visualStyle: "Latvian Art Nouveau painting, Hanseatic medieval art, Baltic maritime tradition, Riga urban atmosphere"
  },
  "Ireland": {
    architecture: "medieval Dublin Castle Norman towers, Viking longphort stone ruins, Georgian red-brick townhouses with fanlights, Liffey stone bridges, Irish round tower churches, Celtic stone crosses",
    colors: "Irish emerald green, Georgian red brick, Dublin stone gray, Liffey river silver, Celtic gold, Atlantic blue",
    atmosphere: "Irish Celtic heritage, Georgian elegance, Viking maritime history, Irish literary tradition, Atlantic coastal mist",
    landscape: "Dublin Bay, Liffey river, Irish green countryside, Cliffs of Moher, Irish lake districts",
    visualStyle: "Irish Celtic art tradition, Georgian architectural painting, Irish landscape realism, Celtic illuminated manuscript influence"
  },
  "Georgia": {
    architecture: "medieval Tbilisi Old Town stone houses with wooden balconies, Sioni Cathedral domes, Narikala fortress stone walls, Georgian Orthodox churches with cross-topped domes, Mtkvari river bridges",
    colors: "Georgian stone beige, Orthodox gold domes, Mtkvari river blue, Tbilisi sunset orange, Caucasian green, church red",
    atmosphere: "Georgian Orthodox spiritual heritage, Caucasus mountain culture, ancient Silk Road crossroads, Georgian wine culture",
    landscape: "Tbilisi Old Town hillside, Mtkvari river gorge, Caucasus mountain backdrop, Georgian wine country, Abkhazian coast",
    visualStyle: "Georgian Orthodox icon painting, Caucasus mountain realism, Silk Road cultural fusion, Georgian medieval art"
  },
  "Armenia": {
    architecture: "ancient Armenian churches carved from tuff stone, Etchmiadzin Cathedral with conical dome, medieval fortress ruins with khachkar cross-stones, Armenian monastic complexes on mountains, ancient Garni temple columns",
    colors: "Armenian pink tuff stone, Orthodox gold domes, Armenian red, Caucasian mountain green, ancient stone beige, church blue",
    atmosphere: "Ancient Armenian Christian heritage, Caucasus mountain spirituality, medieval monastic scholarship, Armenian genocide memory, ancient civilization",
    landscape: "Armenian highlands, Mount Ararat backdrop, Yerevan valley, ancient monastic mountain sites, Lake Sevan",
    visualStyle: "Armenian medieval manuscript illumination, Orthodox icon tradition, Caucasus mountain realism, ancient Armenian architectural reconstruction"
  },
};

// Country-specific year modifiers for distinctive AI image generation
const countryYearModifiers = {
  "France": {
    "Modern era": {
      architecture: "Haussmannian Parisian boulevards with mansard roofs, blackout-covered buildings, fortified military headquarters in historic palaces, Parisian metro entrances, resistance hideouts in Montmartre cellars, fortified coastal bunkers along Normandy",
      people: "French Resistance fighters in civilian clothes with armbands, French Army blue-horizon uniforms, German Wehrmacht occupation uniforms, Parisian women in practical wartime clothing, French women factory workers with headscarves",
      landscape: "occupied Paris with German military patrols, blackout-covered Haussmannian boulevards, French Resistance countryside hideouts, Normandy coastal fortifications, Vichy France provincial towns",
      colors: "French wartime desaturated tones, Haussmannian stone grays, military blue-horizon, blackout black, French tricolor red-white-blue hidden in resistance symbols",
      atmosphere: "German occupation of Paris, French Resistance underground activity, Vichy regime collaboration, Parisian blackout life, resistance hope amid oppression"
    }
  },
  "Germany": {
    "Modern era": {
      architecture: "Prussian neoclassical government buildings, Berlin military headquarters in historic palaces, Nazi party rally grounds with monumental architecture, Luftwaffe airfield installations, fortified coastal batteries along North Sea, German military barracks with swastika banners",
      people: "German Wehrmacht field gray uniforms, Nazi party functionary brown shirts, German women in practical wartime clothing, Hitler Youth members, German military officers with Iron Cross medals, Blitzschutz wardens",
      landscape: "Berlin with Nazi monumental architecture, German military parades on wide boulevards, Luftwaffe airfields, fortified Atlantic Wall coastlines, German military supply depots, Berlin government district",
      colors: "German military field gray, Nazi brown and red, Prussian blue, Berlin stone beige, wartime desaturated tones, Iron Cross black and silver",
      atmosphere: "Nazi military power, German wartime mobilization, Berlin government district, Luftwaffe presence, German home front rationing, military parade culture"
    }
  },
  "United Kingdom": {
    "Modern era": {
      architecture: "London Underground bomb shelters, Churchill War Rooms underground headquarters, blackout-covered Georgian townhouses, British military headquarters in historic manors, coastal anti-invasion fortifications along southern England, St Paul's Cathedral amid Luftwaffe bomb damage",
      people: "British Army khaki uniforms, Women's Auxiliary Corps female soldiers, London Blitz civilians with gas masks, British resistance Home Guard in civilian clothes with makeshift weapons, Winston Churchill in dark suit and bow tie, British women factory workers",
      landscape: "blackout-covered London with St Paul's silhouetted, British coastal anti-invasion defenses, Churchill War Rooms entrance, British countryside with anti-invasion obstacles, London Underground shelter crowds",
      colors: "British wartime khaki and olive drab, London blackout grays and blacks, St Paul's stone beige, British red-white-blue resistance symbols, Churchillian dark tones",
      atmosphere: "Blitz protection and resilience, Churchillian wartime leadership, British home front determination, anti-invasion preparation, London Underground shelter life, British defiance under bombardment"
    }
  },
  "Italy": {
    "Modern era": {
      architecture: "Mussolini-era fascist monumental architecture, Roman fascist regime buildings with imperial columns, Italian coastal fortifications along Mediterranean, Italian military barracks in historic palazzos, Italian resistance hideouts in Tuscan hill villages, bombed Italian city centers",
      people: "Italian Royal Army olive drab uniforms, Fascist Black Shirt party members, Italian women in practical wartime dress, Italian partisans in civilian clothes with red armbands, Mussoli-era military officers with medals, Italian resistance fighters with makeshift weapons",
      landscape: "fascist Rome with Mussolini-era monuments, Italian coastal fortifications, Tuscan hill village resistance hideouts, bombed Italian city centers, Italian military supply routes through Alps",
      colors: "Italian fascist brown and black, Italian military olive drab, Tuscan hill stone beige, Mediterranean blue, Italian resistance red, wartime desaturated tones",
      atmosphere: "Italian fascist regime, Italian military collapse, Italian resistance movement, Mediterranean coastal defense, Tuscan countryside resistance, Italian home front hardship"
    }
  },
  "Spain": {
    "Modern era": {
      architecture: "Franco-era authoritarian architecture, Madrid government buildings with nationalist symbolism, Spanish coastal fortifications, Spanish military barracks in historic buildings, Spanish resistance hideouts in Pyrenean mountain villages, Spanish Civil War memorial architecture",
      people: "Spanish Nationalist army uniforms in dark blue, Franco government officials in formal attire, Spanish women in practical wartime clothing, Spanish resistance fighters in Pyrenean mountain villages, Spanish civilians in traditional regional dress, Spanish military officers with Franco-era medals",
      landscape: "Franco-era Madrid with authoritarian architecture, Spanish Pyrenean mountain resistance hideouts, Spanish coastal fortifications along Mediterranean, Spanish Civil War memorial sites, Spanish military supply routes through Iberian peninsula",
      colors: "Spanish Nationalist dark blue and red, Franco-era black and gold, Pyrenean mountain green, Mediterranean blue, Spanish regional colors, wartime desaturated tones",
      atmosphere: "Franco authoritarian rule, Spanish neutrality in WWII, Spanish Civil War legacy, Pyrenean resistance networks, Spanish home front isolation, Spanish military presence"
    }
  },
  "Netherlands": {
    "Modern era": {
      architecture: "Amsterdam canal houses under German occupation, Dutch resistance hideouts in historic brownstone buildings, German military headquarters in Dutch palaces, Dutch coastal anti-invasion fortifications along North Sea, Dutch resistance radio transmission sites in hidden rooms, bombed Dutch city centers",
      people: "Dutch civilians in practical wartime clothing, German occupation forces in field gray uniforms, Dutch resistance fighters in civilian clothes with orange armbands, Dutch women in traditional Dutch dress, Dutch military officers in exile, Dutch Jewish citizens in hiding",
      landscape: "occupied Amsterdam with German patrols, Dutch canal ring under blackout, Dutch coastal anti-invasion fortifications, Dutch countryside resistance hideouts, Dutch resistance radio sites in hidden rooms, Dutch military supply depots",
      colors: "Dutch wartime desaturated tones, Amsterdam canal stone grays, German military field gray, Dutch orange resistance symbols, Dutch brick red, blackout black",
      atmosphere: "German occupation of Netherlands, Dutch resistance underground, Dutch canal life under blackout, Dutch coastal defense, Dutch Jewish persecution, Dutch home front resilience"
    }
  },
  "Belgium": {
    "Modern era": {
      architecture: "Brussels government buildings under German occupation, Belgian resistance hideouts in Art Nouveau buildings, German military headquarters in Belgian châteaux, Belgian coastal fortifications along Channel, Belgian resistance radio sites in hidden rooms, bombed Belgian city centers",
      people: "Belgian civilians in practical wartime clothing, German occupation forces in field gray uniforms, Belgian resistance fighters in civilian clothes with red-yellow armbands, Belgian royal family in exile, Belgian women in traditional dress, Belgian military officers in hiding",
      landscape: "occupied Brussels with German military presence, Belgian Art Nouveau resistance hideouts, Belgian Channel coast fortifications, Belgian countryside resistance networks, Belgian resistance radio transmission sites, Belgian military supply routes",
      colors: "Belgian wartime desaturated tones, Brussels stone gray, German military field gray, Belgian red-yellow resistance symbols, Belgian brick red, blackout black",
      atmosphere: "German occupation of Belgium, Belgian resistance underground, Brussels government district under control, Belgian coastal defense, Belgian home front hardship, Belgian royal exile"
    }
  },
  "Greece": {
    "Modern era": {
      architecture: "Greek mountain monastery fortifications, German-Italian military headquarters in neoclassical buildings, Greek coastal defense batteries along Aegean, Greek resistance hideouts in mountain monasteries, bombed Greek city centers, Greek partisan communication towers on mountain peaks",
      people: "Greek EAM resistance fighters in mountain clothing, Italian occupation forces in white uniforms, German Wehrmacht in field gray, Greek civilians in traditional regional dress, Greek women in practical wartime clothing, Greek mountain resistance fighters with homemade weapons",
      landscape: "Greek mountain monastery resistance hideouts, Aegean coastal defense batteries, Greek partisan mountain communication networks, bombed Greek city centers, Greek mountain resistance supply routes, Greek coastal fortifications",
      colors: "Greek mountain stone gray, Greek military olive drab, Italian white uniforms, Greek blue and white resistance symbols, Greek monastery gold domes, wartime desaturated tones",
      atmosphere: "Greek mountain resistance movement, Italian-German occupation, Greek monastery resistance networks, Aegean coastal defense, Greek home front starvation, Greek partisan mountain warfare"
    }
  },
  "Turkey": {
    "Modern era": {
      architecture: "Turkish government buildings in Ankara, Turkish coastal fortifications along Bosphorus, Turkish military barracks in historic Ottoman buildings, Turkish resistance supply routes through Anatolian highlands, Turkish diplomatic buildings in neutral status, Turkish military observation posts along straits",
      people: "Turkish military in olive drab uniforms, Turkish diplomats in formal attire, Turkish civilians in traditional Anatolian dress, Turkish women in practical wartime clothing, Turkish resistance supply network participants, Turkish military officers at Bosphorus fortifications",
      landscape: "Ankara government district, Bosphorus strait fortifications, Turkish Anatolian highland resistance routes, Turkish coastal defense positions, Turkish diplomatic neutral zone, Turkish military supply depots in Anatolia",
      colors: "Turkish military olive drab, Ankara stone beige, Bosphorus blue, Turkish red and white, Anatolian earth tones, Turkish diplomatic white",
      atmosphere: "Turkish neutrality in WWII, Bosphorus strategic importance, Turkish military preparedness, Anatolian resistance supply routes, Turkish diplomatic balancing, Turkish coastal defense"
    }
  },
  "Russia": {
    "Modern era": {
      architecture: "Soviet Red Army military headquarters in Moscow Kremlin, Soviet partisan hideouts in Belarusian forests, Soviet coastal defense fortifications along Baltic, Soviet military supply depots in Urals, Soviet resistance radio towers in hidden forests, Soviet military hospitals in converted monasteries",
      people: "Soviet Red Army soldiers in olive drab uniforms with red star insignia, Soviet partisans in civilian clothes with red armbands, Soviet women in practical wartime clothing, Soviet military officers with medals, Soviet civilians in traditional Russian dress, Soviet resistance fighters with homemade weapons",
      landscape: "Moscow Kremlin military headquarters, Soviet partisan Belarusian forest networks, Soviet Baltic coast fortifications, Soviet Urals military supply depots, Soviet resistance communication towers, Soviet military hospital conversions",
      colors: "Soviet military olive drab, Red Army red, Moscow Kremlin red brick, Soviet gold stars, Belarusian forest green, wartime desaturated tones",
      atmosphere: "Soviet Red Army mobilization, Soviet partisan resistance networks, Moscow military command, Soviet Baltic coastal defense, Soviet home front hardship, Soviet military industrial mobilization"
    }
  },
  "Ukraine": {
    "Modern era": {
      architecture: "Soviet Ukrainian military barracks in Kyiv, Ukrainian Insurgent Army hideouts in Carpathian mountain villages, Ukrainian coastal fortifications along Black Sea, Ukrainian resistance radio sites in hidden forests, Ukrainian military supply depots in Carpathian foothills, Ukrainian partisan communication towers",
      people: "Ukrainian Insurgent Army fighters in mountain clothing, Soviet Red Army soldiers in olive drab, Ukrainian civilians in traditional Ukrainian dress, Ukrainian women in practical wartime clothing, Ukrainian resistance fighters with red armbands, Ukrainian military officers in hiding",
      landscape: "Carpathian mountain Ukrainian resistance hideouts, Ukrainian coastal Black Sea fortifications, Ukrainian forest partisan networks, Ukrainian military supply routes through Carpathians, Ukrainian resistance radio sites, Ukrainian partisan communication towers",
      colors: "Ukrainian blue and yellow resistance symbols, Soviet military olive drab, Carpathian mountain green, Ukrainian stone beige, Ukrainian red resistance symbols, wartime desaturated tones",
      atmosphere: "Ukrainian Insurgent Army resistance, Carpathian mountain partisan warfare, Soviet Ukrainian military presence, Black Sea coastal defense, Ukrainian home front hardship, Ukrainian resistance communication networks"
    }
  },
  "Poland": {
    "Modern era": {
      architecture: "Warsaw Uprising barricades in historic city center, Polish Home Army resistance hideouts in Warsaw cellars, German military headquarters in Polish palaces, Polish coastal fortifications along Baltic, Polish resistance communication towers in hidden forests, Polish military supply depots in Carpathian foothills",
      people: "Polish Home Army (Armia Krajowa) resistance fighters in civilian clothes with red-white armbands, German occupation forces in field gray, Polish civilians in traditional regional dress, Polish women in practical wartime clothing, Polish military officers in exile, Polish resistance fighters with homemade weapons",
      landscape: "Warsaw Uprising barricades in historic city center, Polish Home Army resistance hideouts in Warsaw cellars, Polish Baltic coast fortifications, Polish Carpathian mountain resistance networks, Polish resistance communication towers, Polish military supply depots",
      colors: "Polish red-white resistance symbols, German military field gray, Warsaw stone beige, Polish military olive drab, Carpathian mountain green, wartime desaturated tones",
      atmosphere: "Polish Home Army resistance, Warsaw Uprising barricades, German occupation of Poland, Polish Baltic coastal defense, Polish home front hardship, Polish resistance communication networks"
    }
  },
  "Hungary": {
    "Modern era": {
      architecture: "Hungarian Parliament Building under military control, Hungarian military headquarters in historic buildings, Hungarian coastal fortifications along Danube, Hungarian resistance hideouts in Budapest cellars, Hungarian military supply depots in Carpathian foothills, Hungarian resistance radio sites in hidden rooms",
      people: "Hungarian military in green uniforms, German occupation forces in field gray, Hungarian resistance fighters in civilian clothes with red-white armbands, Hungarian civilians in traditional regional dress, Hungarian women in practical wartime clothing, Hungarian military officers in hiding",
      landscape: "Hungarian Parliament Building under military control, Hungarian Danube fortifications, Hungarian Carpathian resistance hideouts, Hungarian resistance communication networks, Hungarian military supply depots, Hungarian resistance radio sites",
      colors: "Hungarian red-white-green resistance symbols, German military field gray, Hungarian Parliament golden stone, Hungarian military green, Danube blue, wartime desaturated tones",
      atmosphere: "Hungarian military presence, German occupation influence, Hungarian resistance networks, Danube fortifications, Hungarian home front hardship, Hungarian resistance communication"
    }
  },
  "Romania": {
    "Modern era": {
      architecture: "Romanian military headquarters in Bucharest palaces, Romanian coastal fortifications along Black Sea, Romanian resistance hideouts in Carpathian mountain villages, Romanian military supply depots in Transylvanian foothills, Romanian resistance communication towers in Carpathian peaks, Romanian military hospitals in converted buildings",
      people: "Romanian military in olive drab uniforms, Romanian resistance fighters in mountain clothing, Romanian civilians in traditional regional dress, Romanian women in practical wartime clothing, Romanian military officers with medals, Romanian resistance fighters with red-white armbands",
      landscape: "Bucharest military headquarters, Romanian Black Sea coastal fortifications, Carpathian mountain resistance hideouts, Romanian Transylvanian military supply depots, Romanian resistance communication towers, Romanian military hospital conversions",
      colors: "Romanian blue-yellow-red resistance symbols, Romanian military olive drab, Carpathian mountain green, Romanian stone beige, Black Sea blue, wartime desaturated tones",
      atmosphere: "Romanian military mobilization, Black Sea coastal defense, Carpathian resistance networks, Romanian Transylvanian military presence, Romanian home front hardship, Romanian resistance communication"
    }
  },
  "Bulgaria": {
    "Modern era": {
      architecture: "Bulgarian military headquarters in Sofia buildings, Bulgarian coastal fortifications along Black Sea, Bulgarian resistance hideouts in Rila mountain monasteries, Bulgarian military supply depots in Balkan foothills, Bulgarian resistance communication towers in Rila peaks, Bulgarian military hospitals in converted monasteries",
      people: "Bulgarian military in olive drab uniforms, Bulgarian resistance fighters in mountain clothing, Bulgarian civilians in traditional regional dress, Bulgarian women in practical wartime clothing, Bulgarian military officers with medals, Bulgarian resistance fighters with red-white armbands",
      landscape: "Sofia military headquarters, Bulgarian Black Sea coastal fortifications, Rila mountain resistance hideouts, Bulgarian Balkan foothill military depots, Bulgarian resistance communication towers, Bulgarian monastery hospital conversions",
      colors: "Bulgarian white-green-red resistance symbols, Bulgarian military olive drab, Rila mountain green, Bulgarian stone beige, Black Sea blue, wartime desaturated tones",
      atmosphere: "Bulgarian military mobilization, Black Sea coastal defense, Rila mountain resistance networks, Bulgarian Balkan foothill military presence, Bulgarian home front hardship, Bulgarian resistance communication"
    }
  },
  "Serbia": {
    "Modern era": {
      architecture: "Serbian military headquarters in Belgrade Fortress, Serbian resistance hideouts in Serbian mountain villages, Serbian coastal fortifications along Danube, Serbian resistance communication towers in mountain peaks, Serbian military supply depots in Serbian foothills, Serbian resistance radio sites in hidden rooms",
      people: "Serbian Chetnik resistance fighters in mountain clothing, Serbian military in olive drab uniforms, Serbian civilians in traditional regional dress, Serbian women in practical wartime clothing, Serbian resistance fighters with red-white armbands, Serbian military officers in hiding",
      landscape: "Belgrade Fortress military headquarters, Serbian mountain resistance hideouts, Serbian Danube fortifications, Serbian mountain resistance communication networks, Serbian military supply depots, Serbian resistance radio sites",
      colors: "Serbian red-blue-white resistance symbols, Serbian military olive drab, Belgrade stone beige, Serbian mountain green, Danube blue, wartime desaturated tones",
      atmosphere: "Serbian Chetnik resistance, Belgrade Fortress military presence, Serbian mountain resistance networks, Serbian Danube fortifications, Serbian home front hardship, Serbian resistance communication"
    }
  },
  "Bosnia": {
    "Modern era": {
      architecture: "Bosnian mountain monastery fortifications, Bosnian resistance hideouts in Dinaric Alps villages, Bosnian military supply depots in mountain foothills, Bosnian resistance communication towers in Dinaric peaks, Bosnian military hospitals in converted buildings, Bosnian resistance radio sites in hidden rooms",
      people: "Bosnian Partisan resistance fighters in mountain clothing, Bosnian military in olive drab uniforms, Bosnian civilians in traditional Ottoman and Austro-Hungarian dress, Bosnian women in practical wartime clothing, Bosnian resistance fighters with red armbands, Bosnian military officers in hiding",
      landscape: "Dinaric Alps Bosnian mountain resistance hideouts, Bosnian military supply depots in foothills, Bosnian resistance communication towers, Bosnian monastery hospital conversions, Bosnian resistance radio sites, Bosnian military headquarters",
      colors: "Bosnian red-white-green resistance symbols, Bosnian military olive drab, Dinaric mountain green, Bosnian stone beige, Ottoman turquoise domes, wartime desaturated tones",
      atmosphere: "Bosnian Partisan resistance, Dinaric mountain warfare, Bosnian military presence, Bosnian home front hardship, Bosnian resistance networks, Bosnian monastery resistance"
    }
  },
  "Sweden": {
    "Modern era": {
      architecture: "Swedish military headquarters in Stockholm palaces, Swedish coastal fortifications along Baltic Sea, Swedish military supply depots in Swedish forest regions, Swedish resistance communication towers in hidden forests, Swedish military hospitals in converted manor houses, Swedish neutral zone diplomatic buildings",
      people: "Swedish military in dark blue uniforms, Swedish civilians in traditional regional dress, Swedish women in practical wartime clothing, Swedish military officers with medals, Swedish diplomatic personnel in formal attire, Swedish resistance sympathizers with red-white armbands",
      landscape: "Stockholm military headquarters, Swedish Baltic coastal fortifications, Swedish forest military supply depots, Swedish resistance communication networks, Swedish manor hospital conversions, Swedish neutral diplomatic zone",
      colors: "Swedish dark blue military, Swedish red-white resistance symbols, Stockholm stone beige, Swedish forest green, Baltic Sea blue, Swedish diplomatic white",
      atmosphere: "Swedish neutrality in WWII, Swedish Baltic coastal defense, Swedish military preparedness, Swedish diplomatic balancing, Swedish home front resilience, Swedish resistance sympathies"
    }
  },
  "Norway": {
    "Modern era": {
      architecture: "Norwegian coastal fortifications along Atlantic coast, Norwegian resistance hideouts in fjord-side mountain villages, Norwegian military supply depots in Norwegian foothills, Norwegian resistance communication towers in fjord peaks, Norwegian military hospitals in converted mountain lodges, Norwegian resistance radio sites in hidden fjord caves",
      people: "Norwegian Milorg resistance fighters in mountain clothing, Norwegian military in olive drab uniforms, Norwegian civilians in traditional bunad dress, Norwegian women in practical wartime clothing, Norwegian resistance fighters with red-white armbands, Norwegian military officers in exile",
      landscape: "Norwegian Atlantic coastal fortifications, Norwegian fjord-side resistance hideouts, Norwegian mountain military supply depots, Norwegian resistance communication towers, Norwegian fjord cave radio sites, Norwegian military headquarters",
      colors: "Norwegian red-white resistance symbols, Norwegian military olive drab, Norwegian fjord blue, Norwegian mountain green, Norwegian stone beige, wartime desaturated tones",
      atmosphere: "Norwegian Milorg resistance, Norwegian coastal fortifications, Norwegian fjord resistance networks, Norwegian home front hardship, Norwegian resistance communication, Norwegian military exile"
    }
  },
  "Denmark": {
    "Modern era": {
      architecture: "Danish coastal fortifications along Kattegat, Danish resistance hideouts in Danish countryside farms, Danish military supply depots in Jutland foothills, Danish resistance communication towers in hidden forests, Danish military hospitals in converted manor houses, Danish resistance radio sites in hidden rooms",
      people: "Danish resistance fighters in civilian clothes with red-white armbands, Danish military in dark blue uniforms, Danish civilians in traditional regional dress, Danish women in practical wartime clothing, Danish military officers in hiding, Danish resistance sympathizers with homemade weapons",
      landscape: "Danish Kattegat coastal fortifications, Danish countryside resistance hideouts, Danish Jutland military supply depots, Danish resistance communication networks, Danish manor hospital conversions, Danish resistance radio sites",
      colors: "Danish red-white resistance symbols, Danish military dark blue, Danish stone beige, Danish forest green, Kattegat blue, wartime desaturated tones",
      atmosphere: "Danish resistance movement, Danish coastal fortifications, Danish countryside resistance networks, Danish home front hardship, Danish resistance communication, Danish military preparedness"
    }
  },
  "Finland": {
    "Modern era": {
      architecture: "Finnish military headquarters in Helsinki buildings, Finnish coastal fortifications along Gulf of Finland, Finnish resistance hideouts in Finnish forest villages, Finnish military supply depots in Finnish foothills, Finnish resistance communication towers in hidden forests, Finnish military hospitals in converted wooden churches",
      people: "Finnish military in gray-green uniforms, Finnish resistance fighters in forest clothing, Finnish civilians in traditional regional dress, Finnish women in practical wartime clothing, Finnish military officers with medals, Finnish resistance fighters with red-white armbands",
      landscape: "Helsinki military headquarters, Finnish Gulf of Finland coastal fortifications, Finnish forest resistance hideouts, Finnish foothill military supply depots, Finnish resistance communication networks, Finnish wooden church hospital conversions",
      colors: "Finnish gray-green military, Finnish red-white resistance symbols, Finnish stone beige, Finnish forest green, Gulf of Finland blue, wartime desaturated tones",
      atmosphere: "Finnish military mobilization, Finnish Gulf of Finland coastal defense, Finnish forest resistance networks, Finnish home front hardship, Finnish resistance communication, Finnish military preparedness"
    }
  },
  "Ireland": {
    "Modern era": {
      architecture: "Irish military headquarters in Dublin buildings, Irish coastal fortifications along Atlantic, Irish resistance hideouts in Irish countryside farms, Irish military supply depots in Irish foothills, Irish resistance communication towers in hidden hills, Irish military hospitals in converted Georgian buildings",
      people: "Irish military in green uniforms, Irish resistance fighters in civilian clothes, Irish civilians in traditional regional dress, Irish women in practical wartime clothing, Irish military officers with medals, Irish resistance sympathizers with red-white armbands",
      landscape: "Dublin military headquarters, Irish Atlantic coastal fortifications, Irish countryside resistance hideouts, Irish foothill military supply depots, Irish resistance communication networks, Irish Georgian hospital conversions",
      colors: "Irish green military, Irish red-white resistance symbols, Irish stone beige, Irish forest green, Atlantic blue, wartime desaturated tones",
      atmosphere: "Irish neutrality in WWII, Irish Atlantic coastal defense, Irish countryside resistance networks, Irish home front resilience, Irish resistance sympathies, Irish military preparedness"
    }
  },
  "Switzerland": {
    "Modern era": {
      architecture: "Swiss military headquarters in Alpine fortress buildings, Swiss coastal fortifications along Alpine passes, Swiss resistance hideouts in Swiss mountain villages, Swiss military supply depots in Alpine foothills, Swiss resistance communication towers in Alpine peaks, Swiss military hospitals in converted Alpine lodges",
      people: "Swiss military in gray-green uniforms, Swiss resistance fighters in mountain clothing, Swiss civilians in traditional regional dress, Swiss women in practical wartime clothing, Swiss military officers with medals, Swiss resistance sympathizers with red-white armbands",
      landscape: "Alpine fortress military headquarters, Swiss Alpine pass fortifications, Swiss mountain resistance hideouts, Swiss Alpine foothill military depots, Swiss resistance communication networks, Swiss Alpine lodge hospital conversions",
      colors: "Swiss red-white resistance symbols, Swiss military gray-green, Swiss stone beige, Swiss Alpine green, Swiss mountain white, wartime desaturated tones",
      atmosphere: "Swiss neutrality in WWII, Swiss Alpine fortifications, Swiss mountain resistance networks, Swiss home front resilience, Swiss resistance communication, Swiss military preparedness"
    }
  },
  "Austria": {
    "Modern era": {
      architecture: "Austrian military headquarters in Vienna buildings, Austrian coastal fortifications along Danube, Austrian resistance hideouts in Austrian mountain villages, Austrian military supply depots in Austrian foothills, Austrian resistance communication towers in Alpine peaks, Austrian military hospitals in converted buildings",
      people: "Austrian military in olive drab uniforms, Austrian resistance fighters in mountain clothing, Austrian civilians in traditional regional dress, Austrian women in practical wartime clothing, Austrian military officers with medals, Austrian resistance sympathizers with red-white armbands",
      landscape: "Vienna military headquarters, Austrian Danube fortifications, Austrian mountain resistance hideouts, Austrian foothill military supply depots, Austrian resistance communication networks, Austrian hospital conversions",
      colors: "Austrian red-white resistance symbols, Austrian military olive drab, Austrian stone beige, Austrian Alpine green, Danube blue, wartime desaturated tones",
      atmosphere: "Austrian military presence, Austrian Danube fortifications, Austrian mountain resistance networks, Austrian home front hardship, Austrian resistance communication, Austrian military preparedness"
    }
  },
  "Czechia": {
    "Modern era": {
      architecture: "Czech military headquarters in Prague buildings, Czech resistance hideouts in Bohemian mountain villages, Czech military supply depots in Czech foothills, Czech resistance communication towers in Bohemian peaks, Czech military hospitals in converted buildings, Czech resistance radio sites in hidden rooms",
      people: "Czech resistance fighters in civilian clothes with red-white armbands, Czech military in olive drab uniforms, Czech civilians in traditional regional dress, Czech women in practical wartime clothing, Czech military officers in hiding, Czech resistance sympathizers with homemade weapons",
      landscape: "Prague military headquarters, Czech Bohemian mountain resistance hideouts, Czech foothill military supply depots, Czech resistance communication networks, Czech hospital conversions, Czech resistance radio sites",
      colors: "Czech red-white resistance symbols, Czech military olive drab, Czech stone beige, Czech Bohemian green, Czech mountain white, wartime desaturated tones",
      atmosphere: "Czech resistance movement, Czech Bohemian mountain resistance networks, Czech home front hardship, Czech resistance communication, Czech military preparedness, Czech resistance networks"
    }
  },
  "Latvia": {
    "Modern era": {
      architecture: "Latvian military headquarters in Riga buildings, Latvian coastal fortifications along Baltic Sea, Latvian resistance hideouts in Latvian forest villages, Latvian military supply depots in Latvian foothills, Latvian resistance communication towers in hidden forests, Latvian military hospitals in converted buildings",
      people: "Latvian resistance fighters in civilian clothes with red-white armbands, Latvian military in olive drab uniforms, Latvian civilians in traditional regional dress, Latvian women in practical wartime clothing, Latvian military officers in hiding, Latvian resistance sympathizers with homemade weapons",
      landscape: "Riga military headquarters, Latvian Baltic coastal fortifications, Latvian forest resistance hideouts, Latvian foothill military supply depots, Latvian resistance communication networks, Latvian hospital conversions",
      colors: "Latvian red-white resistance symbols, Latvian military olive drab, Latvian stone beige, Latvian forest green, Baltic blue, wartime desaturated tones",
      atmosphere: "Latvian resistance movement, Latvian Baltic coastal defense, Latvian forest resistance networks, Latvian home front hardship, Latvian resistance communication, Latvian military preparedness"
    }
  },
  "Portugal": {
    "Modern era": {
      architecture: "Portuguese military headquarters in Lisbon buildings, Portuguese coastal fortifications along Atlantic, Portuguese resistance hideouts in Portuguese countryside farms, Portuguese military supply depots in Portuguese foothills, Portuguese resistance communication towers in hidden hills, Portuguese military hospitals in converted buildings",
      people: "Portuguese military in olive drab uniforms, Portuguese resistance fighters in civilian clothes, Portuguese civilians in traditional regional dress, Portuguese women in practical wartime clothing, Portuguese military officers with medals, Portuguese resistance sympathizers with red-white armbands",
      landscape: "Lisbon military headquarters, Portuguese Atlantic coastal fortifications, Portuguese countryside resistance hideouts, Portuguese foothill military supply depots, Portuguese resistance communication networks, Portuguese hospital conversions",
      colors: "Portuguese green-red military, Portuguese resistance symbols, Portuguese stone beige, Portuguese forest green, Atlantic blue, wartime desaturated tones",
      atmosphere: "Portuguese neutrality in WWII, Portuguese Atlantic coastal defense, Portuguese countryside resistance networks, Portuguese home front resilience, Portuguese resistance sympathies, Portuguese military preparedness"
    }
  },
  "Georgia": {
    "Modern era": {
      architecture: "Georgian military headquarters in Tbilisi buildings, Georgian coastal fortifications along Black Sea, Georgian resistance hideouts in Caucasus mountain villages, Georgian military supply depots in Georgian foothills, Georgian resistance communication towers in Caucasus peaks, Georgian military hospitals in converted buildings",
      people: "Georgian military in olive drab uniforms, Georgian resistance fighters in mountain clothing, Georgian civilians in traditional regional dress, Georgian women in practical wartime clothing, Georgian military officers with medals, Georgian resistance fighters with red-white armbands",
      landscape: "Tbilisi military headquarters, Georgian Black Sea coastal fortifications, Caucasus mountain resistance hideouts, Georgian foothill military supply depots, Georgian resistance communication networks, Georgian hospital conversions",
      colors: "Georgian red-white military, Georgian resistance symbols, Georgian stone beige, Caucasus mountain green, Black Sea blue, wartime desaturated tones",
      atmosphere: "Georgian military mobilization, Black Sea coastal defense, Caucasus mountain resistance networks, Georgian home front hardship, Georgian resistance communication, Georgian military preparedness"
    }
  },
  "Armenia": {
    "Modern era": {
      architecture: "Armenian military headquarters in Yerevan buildings, Armenian coastal fortifications along Caucasus, Armenian resistance hideouts in Armenian mountain villages, Armenian military supply depots in Armenian foothills, Armenian resistance communication towers in Armenian peaks, Armenian military hospitals in converted buildings",
      people: "Armenian military in olive drab uniforms, Armenian resistance fighters in mountain clothing, Armenian civilians in traditional regional dress, Armenian women in practical wartime clothing, Armenian military officers with medals, Armenian resistance fighters with red-white armbands",
      landscape: "Yerevan military headquarters, Armenian Caucasus coastal fortifications, Armenian mountain resistance hideouts, Armenian foothill military supply depots, Armenian resistance communication networks, Armenian hospital conversions",
      colors: "Armenian red-blue-orange military, Armenian resistance symbols, Armenian stone beige, Armenian mountain green, Caucasus blue, wartime desaturated tones",
      atmosphere: "Armenian military mobilization, Caucasus coastal defense, Armenian mountain resistance networks, Armenian home front hardship, Armenian resistance communication, Armenian military preparedness"
    }
  }
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
  try {
    if (typeof d3 === 'undefined') {
      throw new Error('D3.js library not loaded — check CDN connection');
    }

    if (!europeData || !europeData.features) {
      throw new Error('Map data not available or missing features array');
    }

    const svgEl = document.getElementById('map');
    if (!svgEl) {
      throw new Error('Map SVG element not found in DOM');
    }

    // --- Map setup ---
    const svg = d3.select(svgEl);
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

    const countryGroups = svg.selectAll("g.country-group")
      .data(countries)
      .join("g")
      .attr("class", "country-group")
      .attr("transform", d => {
        const [x, y] = projection([d.lon, d.lat]);
        return `translate(${x}, ${y})`;
      })
      .style("cursor", "pointer")
      .on("click", (event, d) => openModal(d))
      .on("mouseover", () => {})
      .attr("role", "button")
      .attr("tabindex", "0")
      .attr("aria-label", d => `View ${d.name} through time`);

    countryGroups.append("circle")
      .attr("class", "country-dot")
      .attr("r", 5);

    countryGroups.append("text")
      .attr("class", "country-label")
      .attr("x", 9)
      .attr("y", 4)
      .text(d => d.name);

    console.log('Map initialized successfully with', europeData.features.length, 'features');

  } catch (err) {
    console.error('Error initializing map:', err);
    const mapWrap = document.querySelector('.map-wrap');
    if (mapWrap) {
      mapWrap.innerHTML = `<p style="text-align:center;padding:40px;color:#8A7457;font-family:sans-serif;font-size:14px;">
        <strong>Map error:</strong><br>${err.message}<br><br>Please refresh the page.
      </p>`;
    }
  }
}

// --- Slider / year display ---
const slider = document.getElementById("yearSlider");
const yearNumber = document.getElementById("yearNumber");
const eraLabel = document.getElementById("eraLabel");

if (!slider) {
  console.error('Year slider element not found');
} else {
  // Add bounds checking
  const minYear = -3000;
  const maxYear = 2026;
  
  slider.addEventListener("input", (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minYear && value <= maxYear) {
      debouncedSliderUpdate(value);
    }
  });
}

function updateYearDisplay(year) {
  yearNumber.textContent = formatYear(year);
  eraLabel.textContent = getEraLabelForYear(year);
  updateActiveEraButton(year);
}

// Debounce for performance
let sliderDebounceTimer = null;

function debouncedSliderUpdate(value) {
  if (sliderDebounceTimer) {
    clearTimeout(sliderDebounceTimer);
  }
  sliderDebounceTimer = setTimeout(() => {
    updateYearDisplay(value);
  }, 50);
}

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

// --- Era visual styles for historically accurate images ---
const eraStyles = {
  "Stone Age": {
    architecture: "Neolithic longhouses with timber frames and wattle-and-daub walls, megalithic tombs (cromlechs, passage graves), cave dwellings, pit-houses, early granaries",
    clothing: "Neolithic woven linen and wool garments, animal hide cloaks, bone needles and thimbles, shell necklaces, antler pins",
    colors: "earthy ochre reds, burnt sienna, charcoal black, pale limestone whites, natural clay browns, flint gray",
    atmosphere: "dawn of settled farming life, communal labor, ritual gatherings at megalithic sites, fire-lit interiors",
    landscape: "broadleaf forests clearing for fields, river valleys with early villages, chalk downlands with causewayed enclosures, glacial moraines",
    style: "archaeological reconstruction painting, Neolithic pottery patterns, realistic prehistoric scene, earthy pigment palette"
  },
  "Bronze Age": {
    architecture: "Minoan palace complexes with frescoes and storage magazines, Mycenaean citadels with cyclopean walls, Nordic Bronze Age timber halls, fortified hillforts, bronze smelting furnaces, Aegean harbor settlements",
    clothing: "Minoan flounced skirts and kilts with elaborate belts, Mycenaean bronze-fitted armor, Nordic woolen tunics with bronze fibulae, Minoan men's loincloths, Aegean linen robes with dyed borders",
    colors: "Minoan fresco blues and reds, bronze patina green, Aegean deep azure, Nordic amber gold, Mycenaean crimson dyes, terracotta",
    atmosphere: "Mediterranean trade networks flourishing, palace economies, bronze metallurgy workshops, Aegean maritime power, ritual bronze votive offerings",
    landscape: "Aegean archipelago with fortified harbors, Cretan palace courtyards, Nordic Bronze Age burial mounds, Mycenaean citadel hilltops, fertile Thessalian plains",
    style: "Minoan-Mycenaean fresco style blended with archaeological realism, Bronze Age metalwork detail, Aegean maritime painting"
  },
  "Iron Age": {
    architecture: "Celtic oppida hillforts with timber gateways and palisades, Hallstatt salt mines, La Tène metalworking sites, Greek colonial fortified harbors (Massalia, Emporion), Etruscan temple complexes with terracotta decorations, Roman Republican fortifications",
    clothing: "Celtic tartan and striped wool cloaks with bronze fibulae, La Tène torcs and arm rings, Greek hoplite linen cuirasses and bronze helmets, Etruscan silk-bordered togas, Roman Republican tunics with purple stripes for magistrates",
    colors: "Celtic forest greens and woad blues, La Tène bronze gold, Etruscan terracotta reds, Roman military crimson, Greek marble whites, iron gray",
    atmosphere: "clash between Celtic tribal confederations and expanding Roman Republic, Greek colonial prosperity, Etruscan cultural flourishing, Iron Age warfare and trade",
    landscape: "Celtic oppida on hilltops overlooking river valleys, Etruscan temple sanctuaries, Greek colonial harbors with triremes, Roman military camps along frontier, Hallstatt salt mining operations",
    style: "Classical Greek and Roman painting traditions, Celtic La Tène knotwork influences, archaeological reconstruction of Iron Age warfare and daily life"
  },
  "Antiquity": {
    architecture: "Roman imperial architecture: marble temples with Corinthian columns, triumphal arches, imperial forums with basilicas, Roman aqueducts, thermae bath complexes, amphitheaters, Roman villas with mosaic floors, Greek Hellenistic temples, Egyptian-style sanctuaries in Mediterranean",
    clothing: "Roman senatorial togas with wide purple latus clavus stripes, equestrian narrow purple stripes, imperial purple-dyed togas, Greek himations and chitons, Roman military lorica segmentata armor, Roman women's stola and palla with jewelry, freedman dress conventions",
    colors: "Roman marble whites and creams, imperial Tyrian purple, Mediterranean azure and cerulean, terracotta roof reds, gold leaf highlights, Punic crimson, Egyptian gold",
    atmosphere: "Pax Romana prosperity, Mediterranean trade dominance, Roman civic grandeur, Hellenistic scholarly culture, imperial religious syncretism, gladiatorial spectacles",
    landscape: "Roman road networks stretching between provinces, Mediterranean harbors with grain ships, Roman provincial cities with forums and baths, Greek island sanctuaries, Egyptian Nile delta trade routes, Alpine passes connecting provinces",
    style: "Roman imperial painting tradition, Hellenistic realism, archaeological accuracy of Roman architecture and urban planning, classical perspective, marble and gold textures"
  },
  "Middle Ages": {
    architecture: "stone castles with towers, Gothic cathedrals with pointed arches, timber-framed houses, market squares",
    clothing: "medieval tunics, chainmail armor, knight plate armor, monk robes, noble velvet",
    colors: "stone gray, deep forest green, muted medieval palette, candlelit warm interior tones",
    atmosphere: "medieval Gothic atmosphere, misty castle courtyards, monastic scholarship, feudal life",
    landscape: "fortified hilltop castles, Gothic cathedral spires, medieval villages, misty European countryside",
    style: "medieval manuscript illumination style, Gothic architectural accuracy, historical tapestry aesthetic"
  },
  "Renaissance": {
    architecture: "Renaissance palaces with classical columns, frescoed buildings, ornate town halls, grand piazzas",
    clothing: "Renaissance silks and velvets, merchant doublets, scholarly robes, ornate noble attire",
    colors: "warm Renaissance palette, golden Mediterranean light, rich crimson, deep blue, marble white",
    atmosphere: "Renaissance humanist enlightenment, scholarly workshops, artistic flourishing, merchant prosperity",
    landscape: "Italianate hilltop towns, Renaissance gardens, classical architecture, Mediterranean coast",
    style: "Renaissance oil painting style, accurate classical architecture, warm golden light, perspective mastery"
  },
  "Enlightenment": {
    architecture: "Baroque and neoclassical buildings, grand boulevards, scientific academies, ornate theaters",
    clothing: "Enlightenment era formal wear, powdered wigs, elegant coats, scholarly attire, refined dresses",
    colors: "Enlightenment elegance, cream and gold, deep burgundy, sophisticated pastels, candlelight warmth",
    atmosphere: "Enlightenment salons, scientific discovery, intellectual discourse, refined European society",
    landscape: "grand European capitals, botanical gardens, scientific laboratories, elegant public squares",
    style: "Enlightenment era painting style, precise architectural detail, sophisticated European aesthetic"
  },
  "Industrial Age": {
    architecture: "brick factories with smokestacks, iron bridges, railway stations, Victorian townhouses, grand museums",
    clothing: "Victorian era clothing, top hats, long dresses, worker overalls, industrial era uniforms",
    colors: "industrial sepia tones, soot and brick red, gaslight amber, steam white, coal black",
    atmosphere: "Industrial Revolution energy, steam-powered progress, bustling factories, urban transformation",
    landscape: "smoky industrial cities, railway networks, factories with smoke, urban expansion, coal mines",
    style: "Industrial era painting style, accurate Victorian architecture, atmospheric industrial scene, dramatic lighting"
  },
  "Modern era": {
    architecture: "modernist buildings, Art Deco structures, post-war reconstruction, glass and steel skyscrapers",
    clothing: "20th century fashion, post-war clothing, modern business attire, contemporary European styles",
    colors: "modern color palette, urban grays, vibrant modern colors, photographic realism, contemporary lighting",
    atmosphere: "modern European vitality, post-war reconstruction, technological progress, cultural renaissance",
    landscape: "modern European cities, post-war rebuilding, emerging skylines, contemporary infrastructure",
    style: "modern European photographic style, accurate 20th century architecture, realistic lighting, historical documentary feel"
  },
  "Present day": {
    architecture: "contemporary European architecture, glass facades, sustainable buildings, modern urban design",
    clothing: "contemporary European fashion, diverse modern clothing, business casual, street style",
    colors: "contemporary digital photography colors, natural daylight, modern urban palette, vibrant city life",
    atmosphere: "modern European energy, digital age connectivity, multicultural society, sustainable future",
    landscape: "modern European cities, green urban spaces, digital infrastructure, contemporary European life",
    style: "contemporary European photography style, accurate modern architecture, realistic digital photography"
  }
};

function getPromptForEra(countryName, year, eraLabel) {
  try {
    const style = eraStyles[eraLabel] || eraStyles["Modern era"];
    const modifier = yearModifiers[String(year)];
    const countryRef = countryArch[countryName];
    
    // Check for country-specific year modifiers (highest priority)
    const countryYearData = countryYearModifiers?.[countryName]?.[String(year)];
    // Check for country-specific era modifiers (second priority)
    const countryEraData = countryYearModifiers?.[countryName]?.[eraLabel];
    
    // Priority: country+year > country+era > year > country > era
    let sceneDetail, architectureDetail, clothingDetail, colorDetail, atmosphereDetail, landscapeDetail, styleDetail;
    
    if (countryYearData) {
      // Country-specific year data — most specific, use entirely
      sceneDetail = `scene: ${countryYearData.scene}`;
      architectureDetail = `architecture: ${countryYearData.architecture}`;
      clothingDetail = `people wearing ${countryYearData.people}`;
      colorDetail = `rendered in ${countryYearData.colors}`;
      atmosphereDetail = `atmosphere: ${countryYearData.atmosphere}`;
      landscapeDetail = `landscape: ${countryYearData.landscape}`;
      styleDetail = `in ${countryYearData.style || 'historically accurate photography'}`;
    } else if (countryEraData) {
      // Country-specific era data overrides generic era style
      sceneDetail = `featuring ${countryRef?.architecture || 'historically accurate European architecture'}`;
      architectureDetail = `architecture: ${countryEraData.architecture}`;
      clothingDetail = `people wearing ${countryEraData.people}`;
      colorDetail = `rendered in ${countryEraData.colors || style.colors}`;
      atmosphereDetail = `atmosphere: ${countryEraData.atmosphere || style.atmosphere}`;
      landscapeDetail = `landscape: ${countryEraData.landscape}`;
      styleDetail = `in ${countryEraData.style || style.style}`;
    } else if (modifier && countryRef && typeof countryRef === 'object') {
      // Year modifier exists but enhance with country-specific details
      const arch = countryRef.architecture || "";
      const colors = countryRef.colors || "";
      const atmos = countryRef.atmosphere || "";
      const land = countryRef.landscape || "";
      const vstyle = countryRef.visualStyle || "";
      
      // Blend year scene with country landscape
      const blendedScene = modifier.scene.includes(',') 
        ? `${modifier.scene}, ${land}` 
        : `${modifier.scene}, featuring ${land}`;
      
      sceneDetail = `scene: ${blendedScene}`;
      architectureDetail = `architecture: ${modifier.architecture}, ${arch.split(',').slice(0, 2).join(',').trim()}`;
      clothingDetail = `people wearing ${modifier.clothing}`;
      colorDetail = `rendered in ${modifier.colors}, ${colors}`;
      atmosphereDetail = `atmosphere: ${modifier.atmosphere}, ${atmos}`;
      landscapeDetail = `landscape: ${land}, ${modifier.landscape}`;
      styleDetail = `in ${vstyle}, ${modifier.style}`;
    } else if (modifier) {
      sceneDetail = `scene: ${modifier.scene}`;
      architectureDetail = `architecture: ${modifier.architecture}`;
      clothingDetail = `people wearing ${modifier.clothing}`;
      colorDetail = `rendered in ${modifier.colors}`;
      atmosphereDetail = `atmosphere: ${modifier.atmosphere}`;
      landscapeDetail = `landscape: ${modifier.landscape}`;
      styleDetail = `in ${modifier.style}`;
    } else if (countryRef && typeof countryRef === 'object') {
      // Use country-specific visual data for distinctive prompts
      const arch = countryRef.architecture || "";
      const colors = countryRef.colors || "";
      const atmos = countryRef.atmosphere || "";
      const land = countryRef.landscape || "";
      const vstyle = countryRef.visualStyle || "";
      
      sceneDetail = `featuring ${arch}`;
      architectureDetail = `with ${arch.split(',').slice(0, 3).join(',').trim()}`;
      clothingDetail = `people in period-appropriate attire`;
      colorDetail = `rendered in ${colors}`;
      atmosphereDetail = `atmosphere: ${atmos}`;
      landscapeDetail = `set against ${land}`;
      styleDetail = `in ${vstyle}`;
    } else {
      sceneDetail = `featuring historically accurate European architecture`;
      architectureDetail = `with ${style.architecture}`;
      clothingDetail = `people wearing ${style.clothing}`;
      colorDetail = `rendered in ${style.colors}`;
      atmosphereDetail = `atmosphere: ${style.atmosphere}`;
      landscapeDetail = `set against ${style.landscape}`;
      styleDetail = `in ${style.style}`;
    }
    
    const yearStr = formatYear(year);
    // Sanitize country name to prevent prompt injection
    const safeCountryName = countryName.replace(/[<>{}]/g, '');
    const basePrompt = `Historical realistic scene of ${safeCountryName}`;
    
    return `${basePrompt}, year ${yearStr}, ${eraLabel} period, ${sceneDetail}, ${architectureDetail}, ${clothingDetail}, ${colorDetail}, ${atmosphereDetail}, ${landscapeDetail}, ${styleDetail}, historically accurate, detailed, cinematic composition`;
  } catch (err) {
    console.error('Error generating prompt:', err);
    // Return safe fallback prompt
    return `Historical realistic scene of ${countryName}, ${eraLabel} period, historically accurate architecture and clothing, detailed, cinematic composition`;
  }
}

// --- Modal ---
const overlay = document.getElementById("overlay");
const modalClose = document.getElementById("modalClose");
const modalCity = document.getElementById("modalCity");
const modalYear = document.getElementById("modalYear");
const modalDesc = document.getElementById("modalDesc");
const modalImage = document.getElementById("modalImage");

// State management for image loading
let currentLoadingState = {
  country: null,
  year: null,
  imageUrl: null,
  imgElement: null,
  abortController: null
};

function clearLoadingState() {
  if (currentLoadingState.abortController) {
    currentLoadingState.abortController.abort();
    currentLoadingState.abortController = null;
  }
  currentLoadingState.country = null;
  currentLoadingState.year = null;
  currentLoadingState.imageUrl = null;
  currentLoadingState.imgElement = null;
}

function isSameRequest(country, year) {
  return currentLoadingState.country === country.name && 
         currentLoadingState.year === year;
}

async function openModal(country) {
  if (!mapInitialized) {
    console.warn('Map not initialized yet');
    return;
  }

  const year = parseInt(slider.value, 10);
  if (isNaN(year)) {
    console.error('Invalid year value');
    return;
  }

  // Check if same request is already loading
  if (isSameRequest(country, year)) {
    return;
  }

  // Cancel previous loading state
  clearLoadingState();

  const eraLabelText = getEraLabelForYear(year);
  const eraKey = getEraLabel(year);
  
  // Sanitize country name for display
  const safeCountryName = country.name.replace(/[<>]/g, '');
  modalCity.textContent = safeCountryName;
  modalYear.textContent = formatYear(year) + " — " + eraLabelText;
  modalDesc.textContent = `This is where an AI-generated image would show what ${safeCountryName} looked like around ${formatYear(year)}.`;

  const prompt = getPromptForEra(country.name, year, eraKey);
  // Fixed seed per location+year for browser cache reuse
  let seed = 0;
  for (let i = 0; i < country.name.length; i++) seed = ((seed << 5) - seed) + country.name.charCodeAt(i);
  seed = (seed + year * 31) & 0x7fffffff;
  
  // Build URL with proper encoding and timeout
  const controller = new AbortController();
  currentLoadingState.abortController = controller;
  currentLoadingState.country = country.name;
  currentLoadingState.year = year;
  
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&nologo=true&seed=${seed}&tf=ebs`;
  currentLoadingState.imageUrl = imageUrl;

  modalImage.innerHTML = '<div class="spinner"></div><p style="position:absolute;bottom:16px;width:100%;text-align:center;font-size:12px;color:#8A7457;margin:0;">Generating historical image...</p>';

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.referrerPolicy = 'no-referrer';
  
  const loadTimeout = setTimeout(() => {
    if (currentLoadingState.imgElement === img) {
      img.onerror && img.onerror();
    }
  }, 30000); // 30 second timeout

  img.onload = () => {
    clearTimeout(loadTimeout);
    if (currentLoadingState.imgElement !== img) {
      return; // Request changed, ignore this load
    }
    clearLoadingState();
    modalImage.innerHTML = '';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    modalImage.appendChild(img);
  };
  
  img.onerror = () => {
    clearTimeout(loadTimeout);
    clearLoadingState();
    modalImage.innerHTML = '<span style="padding:20px;display:block;text-align:center;color:#8A7457;">Failed to load image — click again to retry</span>';
  };
  
  img.src = imageUrl;

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");

  // mark active dot
  d3.selectAll(".country-group").classed("active", d => d.name === country.name);
}

function closeModal() {
  clearLoadingState();
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  d3.selectAll(".country-group").classed("active", false);
  // Return focus to trigger element
  const activeElement = document.activeElement;
  if (activeElement && activeElement !== document.body) {
    activeElement.focus();
  }
}

modalClose.addEventListener("click", closeModal);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (imageFullscreen.classList.contains("open")) {
      closeFullscreen();
    } else if (overlay.classList.contains("open")) {
      closeModal();
    }
  }
});

// --- Image zoom / fullscreen ---
const zoomBtn = document.getElementById("zoomBtn");
const imageFullscreen = document.getElementById("imageFullscreen");
const fullscreenImg = document.getElementById("fullscreenImg");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomResetBtn = document.getElementById("zoomResetBtn");
const zoomLevel = document.getElementById("zoomLevel");

let currentZoom = 1;
const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 8;

function updateZoom(newZoom) {
  currentZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom));
  fullscreenImg.style.transform = `scale(${currentZoom})`;
  zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
}

function zoomImage() {
  const img = modalImage.querySelector("img");
  if (img && img.src) {
    fullscreenImg.src = img.src;
    imageFullscreen.classList.add("open");
    imageFullscreen.setAttribute("aria-hidden", "false");
    updateZoom(1);
  }
}

function closeFullscreen() {
  imageFullscreen.classList.remove("open");
  imageFullscreen.setAttribute("aria-hidden", "true");
  updateZoom(1);
  // Return focus to zoom button
  if (zoomBtn) {
    zoomBtn.focus();
  }
}

zoomBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  zoomImage();
});

imageFullscreen.addEventListener("click", (e) => {
  if (!e.target.closest(".zoom-controls")) {
    closeFullscreen();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && imageFullscreen.classList.contains("open")) {
    closeFullscreen();
  }
});

zoomInBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  updateZoom(currentZoom + ZOOM_STEP);
});

zoomOutBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  updateZoom(currentZoom - ZOOM_STEP);
});

zoomResetBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  updateZoom(1);
});

// Scroll-wheel zoom
imageFullscreen.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    updateZoom(currentZoom + ZOOM_STEP);
  } else {
    updateZoom(currentZoom - ZOOM_STEP);
  }
});
