// City-specific historical modifiers for accurate image generation
// Each city has per-era data with: architecture, landscape, people_clothing
const cityYearModifiers = {
  "Athens": {
    "Stone Age": {
      architecture: "Stone Age cave dwellings on Acropolis slopes, primitive stone huts, natural rock formations",
      landscape: "Wild Attica countryside, olive groves just being cultivated, Aegean Sea coastline, Acropolis rock formation",
      people_clothing: "Stone Age hunter-gatherers, animal fur clothing, bone jewelry, ochre body paint"
    },
    "Bronze Age": {
      architecture: "Early Mycenaean citadel foundations, megaron-style palaces, fortified hilltop settlements, bronze workshops",
      landscape: "Mycenaean trade routes, Attic countryside, Bronze Age harbors, early Greek agricultural terraces",
      people_clothing: "Mycenaean nobility in linen tunics, bronze belts, warriors in leather armor, Minoan-influenced dress"
    },
    "Iron Age": {
      architecture: "Archaic period temples under construction, stone fortification walls, agora marketplace beginnings, Greek sanctuary precincts",
      landscape: "Archaic Greek countryside, olive groves, vineyards, sacred groves, early Greek harbors",
      people_clothing: "Archaic Greeks in chiton and himaton, wool cloaks, bronze helmets, citizen warriors, priestly robes"
    },
    "Antiquity": {
      architecture: "Classical Parthenon with marble columns, Propylaea gateway, Temple of Athena Nike, classical Greek agora, stoas",
      landscape: "Acropolis hill dominating Athens, classical Greek countryside, olive groves, Laurion silver mines, Piraeus harbor",
      people_clothing: "Greek citizens in white chiton and purple-bordered himation, philosophers in cloaks, women in colorful dresses, soldiers in hoplite armor"
    },
    "Middle Ages": {
      architecture: "Byzantine churches with domes and mosaics, Frankish castle on Acropolis, fortified monasteries, medieval town walls",
      landscape: "Byzantine Athens under Frankish rule, fortified Acropolis as castle, monastic communities, Attic countryside",
      people_clothing: "Byzantine Greeks in layered robes, Frankish knights in chainmail, Orthodox monks in black habits, peasant farmers in wool"
    },
    "Renaissance": {
      architecture: "Frankish and Ottoman fortifications on Acropolis, Ottoman mosques with minarets, Venetian-era buildings, medieval narrow streets",
      landscape: "Ottoman Athens under Turkish rule, Acropolis with Parthenon as mosque, Attic countryside, Ottoman marketplaces",
      people_clothing: "Ottoman Greeks in fustanella and vest, Turkish officials in kaftans, women in colorful dresses and headscarves, Orthodox priests"
    },
    "Enlightenment": {
      architecture: "Ottoman Athens with mosques and fountains, Frankish remnants, Turkish bathhouses, classical ruins being explored by Europeans",
      landscape: "Ottoman-period Attica, classical ruins attracting European travelers, Turkish agricultural settlements, Acropolis with minaret",
      people_clothing: "Greek merchants in traditional dress, Ottoman officials, European philhellenes, women in Ottoman-style clothing, Orthodox clergy"
    },
    "Industrial Age": {
      architecture: "Neoclassical buildings by King Otto, new Greek capital city, archaeological excavations, first modern Athens buildings, University of Athens",
      landscape: "Growing modern Athens, neoclassical city center, classical ruins integrated into urban fabric, Piraeus port expansion",
      people_clothing: "Greek citizens in Western-style dress mixed with traditional fustanella, European archaeologists, Ottoman officials still present, women in neoclassical fashion"
    },
    "Modern era": {
      architecture: "Modern Athens with neoclassical and modern buildings, Acropolis illuminated at night, metropolitan expansion, 2004 Olympic venues",
      landscape: "Metropolitan Athens sprawling across Attica, Acropolis as symbol, modern boulevards, Piraeus port, Mount Lycabettus",
      people_clothing: "Modern European citizens, tourists in casual wear, Greek traditional dress for festivals, business attire, students in contemporary fashion"
    },
    "Present day": {
      architecture: "Contemporary Athens with modern architecture, restored Acropolis monuments, metro stations with archaeological finds, Syntagma Square, Lycabettus Tower",
      landscape: "Modern Athens urban landscape, Acropolis at sunset, Saronic Gulf coastline, Mount Parnitha backdrop, pedestrianized Plaka district",
      people_clothing: "Contemporary European fashion, diverse international tourists, Greek youth in street style, business professionals, traditional dress at cultural events"
    }
  },
  "Thessaloniki": {
    "Stone Age": {
      architecture: "Stone Age lakeside settlements, primitive huts near Thermaic Gulf, natural cave dwellings in surrounding hills",
      landscape: "Wild Thermaic Gulf coastline, lake settlements, pine forests of Mount Olympus nearby, fertile Thessalian plain",
      people_clothing: "Stone Age lakeside communities, animal fur clothing, bone tools, fishing nets, hunter-gatherer groups"
    },
    "Bronze Age": {
      architecture: "Bronze Age coastal settlements, early Macedonian fortifications, timber-frame houses, Bronze Age harbors",
      landscape: "Thermaic Gulf harbors, Macedonian countryside, trade routes to inland Macedonia, coastal fishing villages",
      people_clothing: "Early Macedonians in wool tunics, bronze belts, fishermen in simple garments, traders in woven cloaks"
    },
    "Iron Age": {
      architecture: "Ancient Greek colony of Thessaloniki founded by Macedonians, fortified harbor, Greek temple precincts, agora",
      landscape: "Ancient Greek harbor city, Thermaic Gulf coastline, Macedonian kingdom expansion, fertile plains",
      people_clothing: "Ancient Greek settlers in chiton and himation, Macedonian warriors in bronze armor, merchants, sailors"
    },
    "Antiquity": {
      architecture: "Roman city of Thessaloniki with forum, basilicas, triumphal arches, Roman baths, Hippodamian grid plan, fortified harbor",
      landscape: "Roman provincial capital, Via Egnatia crossing, Thermaic Gulf harbor, Macedonian plains, Mount Olympus in distance",
      people_clothing: "Roman citizens in togas, Greek merchants in colorful garments, soldiers in Roman military dress, sailors, provincial officials"
    },
    "Middle Ages": {
      architecture: "Byzantine churches with golden mosaics (Hagia Sophia, rotunda), fortified city walls, Byzantine palaces, monastic complexes",
      landscape: "Byzantine second city of empire, Thermaic Gulf harbor, fortified walls protecting city, monastic communities on Mount Athos nearby",
      people_clothing: "Byzantine citizens in silk robes, Orthodox clergy in vestments, Varangian guards, merchants in Eastern dress, soldiers in Byzantine armor"
    },
    "Renaissance": {
      architecture: "Ottoman mosques with minarets (Ezine Ali Pasha), Byzantine churches converted to mosques, Ottoman baths, bazaar districts",
      landscape: "Ottoman Salonica as major Mediterranean port, Jewish quarter (Judea), Ottoman harbors, diverse ethnic neighborhoods",
      people_clothing: "Sephardic Jewish merchants in distinctive dress, Ottoman Turks in kaftans, Greek Orthodox in traditional garb, women in colorful headscarves"
    },
    "Enlightenment": {
      architecture: "Ottoman Salonica with mosques and churches, Jewish synagogues, European consulates, Ottoman fortifications, growing European quarter",
      landscape: "Cosmopolitan Ottoman port city, Jewish and Greek neighborhoods, European trading posts, Thermaic Gulf coastline",
      people_clothing: "Sephardic Jews in traditional dress, Ottoman officials, Greek merchants, European consular staff, diverse merchant communities"
    },
    "Industrial Age": {
      architecture: "Ottoman and European architectural mix, railway station, modern European-style buildings, Jewish quarter expansion, port facilities",
      landscape: "Expanding port city, Ottoman and European quarters, Jewish neighborhoods, railway connecting to Europe, tobacco markets",
      people_clothing: "Diverse population: Ottoman Turks, Sephardic Jews in Western dress, Greek merchants in European fashion, women in mixed styles"
    },
    "Modern era": {
      architecture: "Greek Thessaloniki with neoclassical buildings, White Tower restoration, Byzantine heritage sites, modern urban expansion, 2004 Olympic facilities",
      landscape: "Modern Greek city on Thermaic Gulf, White Tower landmark, Byzantine and Ottoman heritage sites, urban parks",
      people_clothing: "Modern Greek citizens in European fashion, tourists, Orthodox clergy, business professionals, students"
    },
    "Present day": {
      architecture: "Contemporary Thessaloniki with Byzantine monuments, Ottoman heritage, modern buildings, White Tower, Rotunda, Aristotelous Square",
      landscape: "Modern Greek metropolitan area, Thermaic Gulf coastline, Byzantine and Ottoman heritage sites, pedestrianized city center",
      people_clothing: "Contemporary Greek and international fashion, diverse population, business attire, students, tourists"
    }
  },
  "Sparta": {
    "Stone Age": {
      architecture: "Stone Age settlements in Eurotas valley, primitive huts, natural rock shelters in Taygetos mountains",
      landscape: "Wild Eurotas valley, Taygetos mountains, Eurotas river, Spartan plain, Mediterranean coastline",
      people_clothing: "Stone Age hunter-gatherers in animal skins, bone tools, primitive agriculture"
    },
    "Bronze Age": {
      architecture: "Mycenaean palace complex at Sparta (East Sparta), fortified citadel, bronze workshops, Mycenaean tombs",
      landscape: "Mycenaean Laconia, fertile Eurotas plain, coastal settlements, sacred sites at Taygetos",
      people_clothing: "Mycenaean nobility in linen, warriors in bronze armor, farmers in wool, Mycenaean merchants"
    },
    "Iron Age": {
      architecture: "Classical Spartan agoge training grounds, Temple of Artemis Orthia, sanctuary of Athena Chalkioikos, Spartan agora",
      landscape: "Spartan military training grounds, Eurotas valley, Taygetos mountains, sacred groves, Laconian countryside",
      people_clothing: "Spartan warriors in red cloaks and bronze helmets, agoge youths in minimal clothing, Spartan women in simple dresses, helots in rags"
    },
    "Antiquity": {
      architecture: "Classical Sparta with temples, theater, gymnasium, Laconian fortifications, Sanctuary of Artemis Orthia, Roman baths",
      landscape: "Spartan military state territory, Eurotas valley, Laconian coast, Taygetos mountains, Spartan training grounds",
      people_clothing: "Spartan citizens in red cloaks, warriors in bronze armor, Spartan women in athletic dress, helots in simple garments, Roman officials"
    },
    "Middle Ages": {
      architecture: "Byzantine fortifications in Laconia, Frankish castle at Mystras, Orthodox monasteries, medieval Spartan settlements",
      landscape: "Frankish-controlled Laconia, Byzantine monastic communities, Mystras fortress, Taygetos mountain monasteries",
      people_clothing: "Frankish knights in chainmail, Byzantine Greeks in robes, Orthodox monks, peasant farmers, Byzantine soldiers"
    },
    "Renaissance": {
      architecture: "Ottoman control of Laconia, Frankish ruins at Mystras, Ottoman fortifications, Byzantine monasteries in Taygetos",
      landscape: "Ottoman Laconia, Mystras as Byzantine cultural center, Taygetos monasteries, Spartan plain under Turkish rule",
      people_clothing: "Greek Orthodox Christians in traditional dress, Ottoman garrison, Frankish descendants, monastic communities"
    },
    "Enlightenment": {
      architecture: "Ottoman Laconia with Byzantine ruins, Frankish castles in decay, Orthodox monasteries, sparse settlements in Spartan plain",
      landscape: "Rural Ottoman Laconia, Mystras as archaeological site, Taygetos monastic heritage, abandoned classical sites",
      people_clothing: "Greek rural population in traditional dress, Ottoman officials, Orthodox clergy, European travelers exploring ruins"
    },
    "Industrial Age": {
      architecture: "Greek Laconia with neoclassical influences, restored Byzantine monasteries, archaeological excavations at ancient Sparta",
      landscape: "Greek rural Laconia, ancient Sparta excavations, Mystras as heritage site, Taygetos mountains, Eurotas valley",
      people_clothing: "Greek peasants in traditional folk dress, archaeologists, Orthodox priests, Greek military officers"
    },
    "Modern era": {
      architecture: "Modern Sparta with neoclassical buildings, archaeological museum, restored ancient monuments, Laconian agricultural infrastructure",
      landscape: "Modern Laconia, ancient Sparta archaeological site, Taygetos mountains, Eurotas valley, Spartan plain",
      people_clothing: "Modern Greek citizens, tourists at archaeological sites, farmers in traditional dress, students"
    },
    "Present day": {
      architecture: "Contemporary Sparta with archaeological sites, museum, modern buildings, ancient theater, Taygetos mountain access",
      landscape: "Modern Laconia, ancient Sparta ruins, Taygetos National Park, Eurotas valley, Mediterranean agriculture",
      people_clothing: "Modern Greek and international visitors, tourists, farmers, students, business professionals"
    }
  },
  "Rome": {
    "Stone Age": {
      architecture: "Stone Age cave dwellings on Palatine Hill, primitive huts along Tiber river, natural rock formations",
      landscape: "Wild Tiber river valley, Palatine and Capitoline hills, Roman countryside, marshy Forum area, Mediterranean coastline",
      people_clothing: "Stone Age hunter-gatherers, animal fur clothing, bone tools, early pastoral communities"
    },
    "Bronze Age": {
      architecture: "Bronze Age palafitte settlements on Tiber islands, fortified hilltop villages, bronze workshops, timber-frame houses",
      landscape: "Bronze Age Latium, Tiber river crossings, volcanic hills, early Roman agricultural settlements, Mediterranean coast",
      people_clothing: "Latian peoples in wool garments, bronze belts, early Italian farmers, traders in woven clothing"
    },
    "Iron Age": {
      architecture: "Early Roman kingdom with wooden temples, Roman Forum beginnings, Servian Wall fortifications, royal palace on Palatine",
      landscape: "Kingdom of Rome, seven hills, Tiber river, early Roman agricultural territory, Etruscan influence",
      people_clothing: "Early Romans in toga praetexta, Etruscan-influenced dress, warriors in bronze armor, priests in ritual garments"
    },
    "Antiquity": {
      architecture: "Roman Colosseum, Pantheon, Roman forums with marble temples, aqueducts, triumphal arches, baths, Senate House, imperial palaces on Palatine",
      landscape: "Imperial Rome with marble forums, Tiber river with bridges, Roman roads radiating outward, Mediterranean harbors, villa countryside",
      people_clothing: "Roman senators in purple-bordered togas, citizens in white togas, legionaries in lorica segmentata, women in stola and palla, slaves in simple tunics"
    },
    "Middle Ages": {
      architecture: "Medieval Rome with papal palaces, converted Roman monuments (Pantheon as church), fortified churches, Castel Sant'Angelo, medieval towers",
      landscape: "Shrinking medieval Rome, papal territories, ruined classical monuments overgrown, Tiber flooding, abandoned Roman aqueducts",
      people_clothing: "Papal officials in ceremonial robes, Catholic clergy in vestments, medieval Romans in wool, pilgrims in simple dress, Norman knights"
    },
    "Renaissance": {
      architecture: "Renaissance papal Rome with St. Peter's Basilica construction, Sistine Chapel, Vatican palaces, Renaissance piazzas, restored aqueducts",
      landscape: "Papal Rome with Renaissance rebuilding, Vatican complex, classical ruins integrated into city, Tiber river, Roman countryside",
      people_clothing: "Renaissance popes and cardinals in elaborate vestments, noble families in rich silks, artists and scholars, Roman citizens in Renaissance dress, pilgrims"
    },
    "Enlightenment": {
      architecture: "Baroque Rome with Bernini and Borromini works, fountains (Trevi), papal palaces, classical archaeological sites, papal administration buildings",
      landscape: "Baroque papal Rome, grand piazzas and fountains, classical ruins as tourist destinations, papal territories, Roman Campagna",
      people_clothing: "Papal court in Baroque dress, nobility in elaborate costumes, clergy in vestments, Grand Tour tourists, Roman citizens in traditional dress"
    },
    "Industrial Age": {
      architecture: "Italian capital Rome with neoclassical buildings, Vittorio Emanuele II monument, modern infrastructure, papal state transformation, archaeological museums",
      landscape: "Modern Italian Rome, unified Italian capital, ancient ruins alongside new buildings, Tiber embankments, Roman countryside",
      people_clothing: "Italian citizens in Western dress, papal officials, Italian soldiers, tourists on Grand Tour, women in late 19th-century fashion"
    },
    "Modern era": {
      architecture: "Modern Rome with fascist-era buildings, Vatican City, restored ancient monuments, modern boulevards, metro system, contemporary museums",
      landscape: "Metropolitan Rome, ancient ruins integrated into urban fabric, Vatican City, Tiber river, Roman countryside, Appian Way",
      people_clothing: "Modern Italian citizens in European fashion, Vatican clergy, tourists, business professionals, students, traditional dress at festivals"
    },
    "Present day": {
      architecture: "Contemporary Rome with ancient ruins (Colosseum, Forum), Vatican City, modern buildings, Trevi Fountain, Spanish Steps, metro stations",
      landscape: "Modern Rome urban landscape, ancient monuments, Vatican City, Tiber river, Roman countryside, Colosseum at sunset",
      people_clothing: "Contemporary Italian and international fashion, diverse tourists, Vatican officials, business professionals, students"
    }
  },
  "Venice": {
    "Stone Age": {
      architecture: "Stone Age lakeside settlements in Venetian lagoon, primitive huts on shallow islands, natural marshland",
      landscape: "Wild Venetian lagoon, shallow islands, migratory bird habitats, Adriatic Sea coastline, marshland",
      people_clothing: "Stone Age lakeside communities, animal fur clothing, fishing tools, hunter-gatherer groups"
    },
    "Bronze Age": {
      architecture: "Bronze Age pile-dwelling settlements in lagoon, early Venetian trading posts, timber-frame structures on islands",
      landscape: "Bronze Age Venetian lagoon, early Adriatic trade routes, lagoon islands, Adriatic Sea, Po delta",
      people_clothing: "Early Venetians in wool garments, fishermen in simple clothing, traders, lagoon communities"
    },
    "Iron Age": {
      architecture: "Venetic settlements in lagoon, early trading posts, timber fortifications, Venetic pottery workshops",
      landscape: "Venetic Adriatic coast, lagoon settlements, early trade routes, Adriatic maritime culture",
      people_clothing: "Venetic people in wool and linen, traders in woven clothing, fishermen, early maritime communities"
    },
    "Antiquity": {
      architecture: "Roman control of Venetian lagoon, Roman settlements on islands, Roman roads to Padua, early Christian basilicas",
      landscape: "Roman Venetia, Adriatic trade routes, lagoon islands, Roman military presence, early Christian communities",
      people_clothing: "Roman officials and soldiers, Venetian fishermen, early Christian clergy, traders in Roman dress"
    },
    "Middle Ages": {
      architecture: "Venetian Gothic palaces along Grand Canal, Doge's Palace, St. Mark's Basilica with golden mosaics, Rialto Bridge, Venetian shipyards (Arsenal)",
      landscape: "Venetian lagoon city, Grand Canal with gondolas and galleys, salt flats, Adriatic Sea, Venetian Republic maritime empire",
      people_clothing: "Venetian nobility in rich silks and velvets, Doge in ceremonial dress, merchants in elaborate garments, sailors, women in distinctive headdresses"
    },
    "Renaissance": {
      architecture: "High Renaissance Venetian palaces, Palladian villas in Veneto, St. Mark's Square completion, Venetian school of painting workshops",
      landscape: "Prosperous Venetian Republic, Grand Canal with Renaissance palaces, Adriatic fleet, Venetian trade routes to East, lagoon islands",
      people_clothing: "Venetian nobility in lavish Renaissance dress, merchants in rich fabrics, artists like Titian and Veronese, sailors, women in ornate dress"
    },
    "Enlightenment": {
      architecture: "Baroque and Rococo Venice, Ca' Rezzonico, Teatro La Fenice, Venetian carnival venues, declining but still elegant palaces",
      landscape: "Carnival Venice, Grand Canal with ornate barges, Adriatic trade still active, Venetian lagoon, European Grand Tour destination",
      people_clothing: "Venetian nobility in Rococo dress, carnival masks and costumes, European Grand Tour tourists, merchants, artists"
    },
    "Industrial Age": {
      architecture: "Venetian Renaissance and Baroque heritage, Teatro La Fenice, Accademia Gallery, Lido seawall, modern Venice infrastructure",
      landscape: "Tourist Venice, Grand Canal with steamboats, lagoon environment, Venice-Milan railway, Adriatic port",
      people_clothing: "Venetian citizens in late 19th-century dress, European tourists, gondoliers in traditional attire, merchants"
    },
    "Modern era": {
      architecture: "Modern Venice with restored monuments, Biennale venues, St. Mark's Square, Grand Canal palaces, Lido beach resorts, rising water challenges",
      landscape: "Venetian lagoon city, Grand Canal, historic center islands, Adriatic Sea, lagoon ecosystem, Venice-Mestre connection",
      people_clothing: "Modern Italian and international citizens, tourists in casual wear, gondoliers, business professionals, students"
    },
    "Present day": {
      architecture: "Contemporary Venice with UNESCO heritage sites, St. Mark's Basilica, Doge's Palace, Grand Canal bridges, Biennale pavilions, MOCA museum",
      landscape: "Modern Venetian lagoon, Grand Canal at golden hour, historic center, Adriatic Sea, lagoon islands (Burano, Murano), acqua alta flooding",
      people_clothing: "Contemporary Italian and international fashion, diverse tourists, gondoliers in traditional dress, business professionals"
    }
  },
  "Florence": {
    "Stone Age": {
      architecture: "Stone Age settlements in Arno valley, primitive huts on Tuscan hills, natural rock shelters",
      landscape: "Wild Tuscan countryside, Arno river valley, Etruscan hills, Mediterranean agriculture beginnings",
      people_clothing: "Stone Age communities in animal skins, early Etruscan farmers, bone tools"
    },
    "Bronze Age": {
      architecture: "Bronze Age Etruscan settlements in Tuscany, fortified hilltop villages, bronze metallurgy workshops",
      landscape: "Etruscan Tuscany, Arno valley, Bronze Age trade routes, Tuscan hills, Mediterranean coast",
      people_clothing: "Etruscan people in wool and linen, warriors in bronze armor, merchants in colorful garments"
    },
    "Iron Age": {
      architecture: "Etruscan Fiesole and Florence, Etruscan temples, fortified settlements, Etruscan metalwork workshops",
      landscape: "Etruscan Tuscany, Arno valley, Etruscan trade routes, Tuscan countryside, Mediterranean coast",
      people_clothing: "Etruscan nobility in rich dress, warriors in bronze armor, priests in ritual garments, farmers"
    },
    "Antiquity": {
      architecture: "Roman Florentia with forum, temples, Roman walls, Roman roads, thermal baths, Roman villas in Tuscan countryside",
      landscape: "Roman Tuscany, Arno river, Roman roads, Etruscan ruins, Tuscan agricultural territory, Mediterranean coast",
      people_clothing: "Roman citizens in togas, Etruscan descendants, merchants, soldiers, farmers in Roman dress"
    },
    "Middle Ages": {
      architecture: "Medieval Florence with Baptistery of St. John, early Romanesque churches, medieval palaces, fortified towers, medieval city walls",
      landscape: "Medieval Tuscan countryside, Florentine agricultural terraces, Arno river, medieval trade routes, Etruscan hilltop towns",
      people_clothing: "Medieval Florentines in wool garments, merchants in rich fabrics, guild members in distinctive dress, women in modest dress, clergy"
    },
    "Renaissance": {
      architecture: "Renaissance Florence with Brunelleschi's Duomo, Uffizi Gallery, Palazzo Vecchio, Ponte Vecchio, Medici palaces, Baptistery",
      landscape: "Renaissance Tuscan countryside, Florentine hills, Arno river, Renaissance villas, Mediterranean agriculture",
      people_clothing: "Renaissance Florentine nobility in rich silks and velvets, Medici family in elaborate dress, artists like Leonardo and Michelangelo, merchants, scholars"
    },
    "Enlightenment": {
      architecture: "Grand Ducal Florence with Medici collections, Uffizi Gallery expansion, Renaissance churches, Palazzo Pitti, Tuscan agricultural estates",
      landscape: "Tuscan Grand Duchy, Renaissance gardens, Florentine hills, Arno valley, Medici villas, Tuscan countryside",
      people_clothing: "Tuscan nobility in Enlightenment dress, Grand Duke's court, scholars and artists, merchants, women in refined fashion"
    },
    "Industrial Age": {
      architecture: "Unified Italian Florence with neoclassical buildings, Uffizi expansion, Renaissance heritage preservation, Italian capital brief period",
      landscape: "Tuscan countryside with Renaissance villas, Arno river, Florentine hills, Italian agricultural modernization",
      people_clothing: "Italian citizens in Western dress, Renaissance tourists, Florentine nobility, merchants, workers in early industrial dress"
    },
    "Modern era": {
      architecture: "Modern Florence with Renaissance heritage, Uffizi Gallery, Ponte Vecchio, Duomo, Boboli Gardens, modern infrastructure",
      landscape: "Metropolitan Florence, Tuscan hills, Arno river, Renaissance villas, wine country, medieval center",
      people_clothing: "Modern Italian citizens, tourists in casual wear, art students, business professionals, traditional dress at festivals"
    },
    "Present day": {
      architecture: "Contemporary Florence with UNESCO Renaissance heritage, Duomo cathedral, Uffizi Gallery, Ponte Vecchio, Palazzo Pitti, Boboli Gardens",
      landscape: "Modern Florentine landscape, Tuscan hills at sunset, Arno river, Renaissance villas, wine country, pedestrianized historic center",
      people_clothing: "Contemporary Italian and international fashion, art students, tourists, business professionals, traditional dress at cultural events"
    }
  }
};
