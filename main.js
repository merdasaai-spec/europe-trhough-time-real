fetch('/europe.geojson')
  .then(r => r.json())
  .then(data => { europeData = data; initMap(); })
  .catch(err => console.error('Failed to load map data:', err));

let europeData = null;

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
  // Ancient period
  "-3000": {
    scene: "Neolithic farming settlement with timber longhouses, megalithic tomb construction, early pottery production",
    architecture: "Linear Pottery Culture (LBK) longhouses with timber frames and wattle-and-daub walls, causewayed enclosures, passage tombs (Newgrange-style), pit-houses, granaries",
    clothing: "Neolithic woven linen tunics, woolen cloaks fastened with antler pins, shell necklaces, bone thimbles, leather aprons",
    colors: "ochre red, burnt sienna, charcoal black, limestone white, clay brown, flint gray, natural undyed wool",
    atmosphere: "communal farming life, ritual megalithic gatherings, dawn of settled agriculture, seasonal harvest festivals",
    landscape: "broadleaf forest clearing for fields, river valley villages, chalk downlands with causewayed enclosures, glacial moraines",
    style: "archaeological reconstruction painting, Neolithic pottery patterns, realistic prehistoric scene, earthy pigment palette"
  },
  "-2000": {
    scene: "Mediterranean Bronze Age trade network, Minoan palace economy, Nordic Bronze Age burial rituals",
    architecture: "Minoan palace at Knossos with frescoes and storage magazines, Mycenaean citadel foundations, Nordic Bronze Age timber halls with bronze fittings, Aegean fortified harbors, megalithic stone circles",
    clothing: "Minoan flounced skirts and kilts with elaborate belts, Mycenaean bronze-fitted cuirasses, Nordic woolen tunics with bronze fibulae, Minoan men's loincloths, Aegean linen robes with dyed borders, gold torcs",
    colors: "Minoan fresco blues and reds, bronze patina green, Aegean deep azure, Nordic amber gold, Mycenaean crimson dyes, terracotta",
    atmosphere: "Mediterranean trade networks flourishing, palace economies, bronze metallurgy workshops, Aegean maritime power, ritual bronze votive offerings",
    landscape: "Aegean archipelago with fortified harbors, Cretan palace courtyards, Nordic Bronze Age burial mounds, Mycenaean citadel hilltops, fertile Thessalian plains",
    style: "Minoan-Mycenaean fresco style blended with archaeological realism, Bronze Age metalwork detail, Aegean maritime painting"
  },
  "-1000": {
    scene: "Late Bronze Age collapse aftermath, early Iron Age Celtic hillfort construction, Greek Dark Ages, Phoenician maritime trade",
    architecture: "Celtic hillforts (oppida) with timber gateways, Hallstatt salt mine complexes, Greek Dark Age settlements, Phoenician colonial harbors (Carthage founding), Mycenaean citadel ruins being repurposed, early iron smelting furnaces",
    clothing: "Celtic tartan and striped wool cloaks with bronze fibulae, La Tène torcs and arm rings, Greek Dark Age simple wool garments, Phoenian Tyrian purple-dyed robes, early iron tools and weapons",
    colors: "Celtic forest greens and woad blues, La Tène bronze gold, Phoenician Tyrian purple, iron gray, Greek geometric pottery blacks and whites",
    atmosphere: "post-collapse recovery, Celtic tribal confederations rising, Phoenician maritime expansion, early iron technology spreading",
    landscape: "Celtic oppida on hilltops overlooking river valleys, Hallstatt salt mining operations, Phoenician colonial harbors, Mycenaean citadel ruins, Greek Dark Age settlements",
    style: "archaeological reconstruction of post-Bronze Age transition, Celtic tribal aesthetics, Phoenician maritime art"
  },
  "-500": {
    scene: "Celtic La Tène culture peak, Roman Republic expansion, Greek polis civilization, Etruscan golden age",
    architecture: "Celtic oppida hillforts with elaborate timber gateways, La Tène metalworking sites, Roman Republican temples with terracotta decorations, Etruscan temple complexes, Greek colonial fortified harbors (Massalia, Emporion), Roman Forum development",
    clothing: "Celtic tartan and striped wool cloaks with bronze fibulae, La Tène torcs and arm rings, Greek hoplite linen cuirasses and bronze helmets, Etruscan silk-bordered togas, Roman Republican tunics with purple stripes for magistrates, Greek chiton and himation",
    colors: "Celtic forest greens and woad blues, La Tène bronze gold, Etruscan terracotta reds, Roman military crimson, Greek marble whites, iron gray",
    atmosphere: "clash between Celtic tribal confederations and expanding Roman Republic, Greek colonial prosperity, Etruscan cultural flourishing, Iron Age warfare and trade",
    landscape: "Celtic oppida on hilltops overlooking river valleys, Etruscan temple sanctuaries, Greek colonial harbors with triremes, Roman military camps along frontier, Hallstatt salt mining operations",
    style: "Classical Greek and Roman painting traditions, Celtic La Tène knotwork influences, archaeological reconstruction of Iron Age warfare and daily life"
  },
  "0": {
    scene: "Augustan Rome at the dawn of the Pax Romana, Mediterranean world unified under Roman rule, Greek scholarly culture flourishing",
    architecture: "Augustan rebuilding of Rome: marble temples with Corinthian columns (Temple of Mars Ultor), triumphal arches (Arch of Augustus), imperial forums with basilicas, Roman aqueducts (Aquae Marcia), thermae bath complexes, Roman villas with mosaic floors, Greek Hellenistic temples in Asia Minor, Egyptian-style sanctuaries",
    clothing: "Roman senatorial togas with wide purple latus clavus stripes, equestrian narrow purple stripes, imperial purple-dyed togas, Greek himations and chitons, Roman military lorica segmentata armor, Roman women's stola and palla with jewelry, freedman dress conventions",
    colors: "Roman marble whites and creams, imperial Tyrian purple, Mediterranean azure and cerulean, terracotta roof reds, gold leaf highlights, Punic crimson, Egyptian gold",
    atmosphere: "Pax Romana prosperity, Mediterranean trade dominance, Roman civic grandeur, Hellenistic scholarly culture, imperial religious syncretism, gladiatorial spectacles",
    landscape: "Roman road networks stretching between provinces, Mediterranean harbors with grain ships, Roman provincial cities with forums and baths, Greek island sanctuaries, Egyptian Nile delta trade routes, Alpine passes connecting provinces",
    style: "Roman imperial painting tradition, Hellenistic realism, archaeological accuracy of Roman architecture and urban planning, classical perspective, marble and gold textures"
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
  }
};

// City-specific historical architecture references for more accurate prompts
const countryArch = {
  "Greece": "ancient Greek marble temples, Acropolis rock, Mediterranean stone houses, Byzantine churches, Ottoman mosques",
  "Italy": "Roman Colosseum, ancient forums, marble temples, aqueducts, Vatican basilicas, Renaissance palaces, Tuscan countryside",
  "Spain": "Moorish Alhambra palace, Gothic cathedrals, Spanish Baroque architecture, Mediterranean coastline, whitewashed villages",
  "Portugal": "Manueline Jerónimos Monastery, medieval Alfama quarter, Tagus riverfront, yellow tiled buildings, Atlantic coast",
  "Turkey": "Hagia Sophia massive dome, Ottoman mosques with minarets, Byzantine walls, Bosphorus strait, Anatolian plateau",
  "France": "Gothic Notre-Dame cathedral, Haussmannian boulevards, Louvre palace, Loire châteaux, Provençal countryside",
  "United Kingdom": "Tower of London, medieval Westminster, Thames riverfront, Gothic churches, Roman wall remnants, Scottish highlands",
  "Netherlands": "canal ring with gabled houses, Dutch Renaissance architecture, medieval churches, wooden bridges, flat polder landscape",
  "Belgium": "medieval Grand-Place Gothic guildhalls, Atomium modern structure, Belgian Gothic architecture, cobblestone streets",
  "Switzerland": "medieval Old Town Fraumünster church, Limmat river, Swiss Gothic architecture, Lake Zurich, Alpine backdrop",
  "Germany": "Brandenburg Gate, Berlin Wall remnants, Gothic brick churches, Prussian palaces, Spree river, Rhine castles",
  "Austria": "Baroque Habsburg palaces, Gothic St. Stephen's Cathedral, Ringstraße boulevards, Danube river, Alpine mountains",
  "Czechia": "Gothic Prague Castle, Charles Bridge, Old Town Square, Astronomical Clock, Czech Baroque churches, Vltava river",
  "Poland": "medieval Old Town market square, Royal Castle, Gothic brick churches, Vistula riverfront, Wawel Castle Krakow",
  "Hungary": "Danube riverfront, Buda Castle Hill, Gothic Matthias Church, Hungarian Parliament Building, thermal baths, Puszta",
  "Russia": "Kremlin onion-domed cathedrals, Red Square, Russian Orthodox churches, Moscow River, vast taiga landscape",
  "Ukraine": "Byzantine St. Sophia Cathedral golden domes, Kyiv Pechersk Lavra, Ukrainian Orthodox churches, Dnieper river, steppe",
  "Romania": "Romanian Orthodox churches colorful frescoes, Ottoman architecture, Carol I Neoclassical buildings, Carpathian mountains",
  "Bulgaria": "Byzantine Boyana Church medieval frescoes, Roman Serdica ruins, Bulgarian Orthodox architecture, Vitosha mountain",
  "Serbia": "Belgrade Fortress confluence Sava Danube, Ottoman Kalemegdan, Serbian medieval churches, Balkan mountains",
  "Bosnia": "Ottoman mosques minarets, Latin Bridge, Austro-Hungarian buildings, narrow cobblestone streets Baščaršija, Dinaric Alps",
  "Sweden": "medieval Gamla Stan Old Town, Viking-age sites, Baltic Sea archipelago, Swedish wooden architecture, Scandinavian forests",
  "Norway": "medieval wooden stave churches, Viking ship ruins, Norwegian fjord architecture, Harald Hardrada fortress sites, Arctic landscape",
  "Denmark": "medieval Old Town Gamle By, Viking harbor sites, Danish Renaissance castles, Nyhavn canal, Jutland peninsula",
  "Finland": "neoclassical Senate Square, white stone Lutheran cathedrals, Finnish National Romantic architecture, Baltic Sea coast, lakeland",
  "Latvia": "medieval Old Town Gothic brick churches, Art Nouveau architecture district, Daugava river, Hanseatic League buildings",
  "Ireland": "medieval Dublin Castle, Viking longphort ruins, Georgian architecture, Liffey river, Irish stone churches, Emerald countryside",
  "Georgia": "medieval Old Town stone houses, Sioni Cathedral, Narikala fortress, Mtkvari river, Georgian Orthodox architecture, Caucasus mountains",
  "Armenia": "ancient Armenian churches tuff stone, Etchmiadzin Cathedral, medieval fortress ruins, Armenian khachkar cross-stones, Armenian highlands",
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

countryGroups.append("circle")
  .attr("class", "country-dot")
  .attr("r", 5);

countryGroups.append("text")
  .attr("class", "country-label")
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
  const style = eraStyles[eraLabel] || eraStyles["Modern era"];
  const modifier = yearModifiers[String(year)];
  const countryRef = countryArch[countryName] || "historically accurate European architecture";
  
  // Check for country-specific era modifiers
  const countryEraData = countryYearModifiers?.[countryName]?.[eraLabel];
  
  // Build prompt components — year-specific modifiers override era defaults for key years
  let sceneDetail, architectureDetail, clothingDetail, colorDetail, atmosphereDetail, landscapeDetail, styleDetail;
  
  if (modifier) {
    sceneDetail = `scene: ${modifier.scene}`;
    architectureDetail = `architecture: ${modifier.architecture}`;
    clothingDetail = `people wearing ${modifier.clothing}`;
    colorDetail = `rendered in ${modifier.colors}`;
    atmosphereDetail = `atmosphere: ${modifier.atmosphere}`;
    landscapeDetail = `landscape: ${modifier.landscape}`;
    styleDetail = `in ${modifier.style}`;
  } else if (countryEraData) {
    // Country-specific era data overrides generic era style
    sceneDetail = `featuring ${countryRef}`;
    architectureDetail = `architecture: ${countryEraData.architecture}`;
    clothingDetail = `people wearing ${countryEraData.people}`;
    colorDetail = `rendered in ${style.colors}`;
    atmosphereDetail = `atmosphere: ${style.atmosphere}`;
    landscapeDetail = `landscape: ${countryEraData.landscape}`;
    styleDetail = `in ${style.style}`;
  } else {
    sceneDetail = `featuring ${countryRef}`;
    architectureDetail = `with ${style.architecture}`;
    clothingDetail = `people wearing ${style.clothing}`;
    colorDetail = `rendered in ${style.colors}`;
    atmosphereDetail = `atmosphere: ${style.atmosphere}`;
    landscapeDetail = `set against ${style.landscape}`;
    styleDetail = `in ${style.style}`;
  }
  
  const yearStr = formatYear(year);
  const basePrompt = `Historical realistic scene of ${countryName}`;
  
  return `${basePrompt}, year ${yearStr}, ${eraLabel} period, ${sceneDetail}, ${architectureDetail}, ${clothingDetail}, ${colorDetail}, ${atmosphereDetail}, ${landscapeDetail}, ${styleDetail}, historically accurate, detailed, cinematic composition`;
}

// --- Modal ---
const overlay = document.getElementById("overlay");
const modalClose = document.getElementById("modalClose");
const modalCity = document.getElementById("modalCity");
const modalYear = document.getElementById("modalYear");
const modalDesc = document.getElementById("modalDesc");
const modalImage = document.getElementById("modalImage");

async function openModal(country) {
  const year = parseInt(slider.value);
  const eraLabelText = getEraLabelForYear(year);
  const eraKey = getEraLabel(year);
  modalCity.textContent = country.name;
  modalYear.textContent = formatYear(year) + " — " + eraLabelText;
  modalDesc.textContent = `This is where an AI-generated image would show what ${country.name} looked like around ${formatYear(year)}.`;

  const prompt = getPromptForEra(country.name, year, eraKey);
  // Fixed seed per location+year for browser cache reuse
  let seed = 0;
  for (let i = 0; i < country.name.length; i++) seed = ((seed << 5) - seed) + country.name.charCodeAt(i);
  seed = (seed + year * 31) & 0x7fffffff;
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&nologo=true&seed=${seed}`;

  modalImage.innerHTML = '<div class="spinner"></div><p style="position:absolute;bottom:16px;width:100%;text-align:center;font-size:12px;color:#8A7457;margin:0;">Generating historical image...</p>';

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

  overlay.classList.add("open");

  // mark active dot
  d3.selectAll(".country-group").classed("active", d => d.name === country.name);
}

function closeModal() {
  overlay.classList.remove("open");
  d3.selectAll(".country-group").classed("active", false);
}

modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// --- Image zoom / fullscreen ---
const zoomBtn = document.getElementById("zoomBtn");
const imageFullscreen = document.getElementById("imageFullscreen");
const fullscreenImg = document.getElementById("fullscreenImg");

function zoomImage() {
  const img = modalImage.querySelector("img");
  if (img) {
    fullscreenImg.src = img.src;
    imageFullscreen.classList.add("open");
  }
}

function closeFullscreen() {
  imageFullscreen.classList.remove("open");
}

zoomBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  zoomImage();
});

imageFullscreen.addEventListener("click", closeFullscreen);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && imageFullscreen.classList.contains("open")) {
    closeFullscreen();
  }
});
