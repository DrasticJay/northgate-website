// Northgate Studios website settings. Safe to edit.
window.NG_CONFIG = {
  // Tebex public token (Creator panel -> Developers -> API Keys -> "Public Token").
  // This one is meant to be public. Never put the Private Key here.
  token: '15byo-8eb64a6d658e12fc368fe8e36f7cc35f4164baa0',
  discord: 'https://discord.gg/2m69UZSduy',
  currency: 'GBP',

  // Which products show on the home page tiles (Tebex package ids). The first one is the big tile.
  featured: [7822914, 7822918, 7822519, 7817100, 7822917],
  // Pictures for the home page tiles (UI shots without text). Falls back to the Tebex image.
  tiles: {
    7822914: 'assets/tiles/police.jpg', 7822918: 'assets/tiles/housing.jpg', 7822519: 'assets/tiles/staff.jpg',
    7817100: 'assets/tiles/garages.jpg', 7822917: 'assets/tiles/mechanic.jpg', 7822915: 'assets/tiles/robberies.jpg',
    7822916: 'assets/tiles/keys.jpg', 7814841: 'assets/tiles/hud.jpg', 7822475: 'assets/tiles/vehicleshop.jpg',
  },
  // The big "spotlight" product on the home page
  spotlight: 7822914,
  // Text under each store group's title
  groupText: {
    jobs: 'Jobs that run like real departments and businesses: police and mechanics, with management, funds and staff.',
    crime: 'Robberies across the whole map, built so police get a fair chance and nobody can cheat the payout.',
    vehicles: 'Everything to do with cars: buying them, parking them, and locking (or stealing) them.',
    server: 'Tools that run your server: the staff panel, the free HUD and housing.',
  },
  // The "NEW" badge in the hero
  newest: { id: 7822918, text: 'Northgate Housing · no MLOs needed' },
  // Groups for the store filter
  groups: {
    jobs:     { label: 'Jobs',         ids: [7822914, 7822917] },
    crime:    { label: 'Crime',        ids: [7822915] },
    vehicles: { label: 'Vehicles',     ids: [7817100, 7822475, 7822916] },
    server:   { label: 'Server tools', ids: [7814841, 7822519, 7822918] },
  },
  // Short line under each product name on cards (falls back to the first sentence of the description)
  taglines: {
    7814841: 'Status icons, speedometers and a death screen',
    7817100: 'Live 3D preview, rentals and impound',
    7822475: 'Showroom, test drives and finance',
    7822519: 'Admin panel with anti-cheat and a staff website',
    7822914: 'Cuffs, fines and jail, evidence, radar, dispatch',
    7822915: 'Stores, Fleeca, jewellery, ATMs and burglaries',
    7822916: 'Locks, engine, hotwiring and lockpicking',
    7822917: 'Workshops, parts, invoices and towing',
    7822918: 'Buy and rent homes, furniture, no MLOs needed',
  },

  // The Complete Pack: one Tebex package that grants every paid script.
  // Put its Tebex package id in "id". With id 0 the site still offers "add all to cart" (no discount).
  bundle: { id: 7833152, ids: [7822914, 7822918, 7822917, 7822915, 7822916, 7822475, 7817100, 7822519] },

  // Gameplay videos (short, silent, looping .mp4 or .webm). Leave empty to show the screenshots instead.
  // heroVideo plays behind the top of the home page; videos[id] replaces that script's spotlight picture.
  heroVideo: 'assets/video/hero.mp4',
  videos: {
    7822914: 'assets/video/police.mp4',
    7822915: 'assets/video/robberies.mp4',
    7822918: 'assets/video/housing.mp4',
    7822917: 'assets/video/mechanic.mp4',
    7822916: 'assets/video/keys.mp4',
    7822475: 'assets/video/vehicleshop.mp4',
  },
  // In-game screenshots shown faded behind a script's tablet in its spotlight (optional).
  // Screenshots under assets/shots/<key>-1.jpg ... (how many each script has)
  shots: {7817100: ['garages', 2], 7822918: ['housing', 5], 7814841: ['hud', 4], 7822916: ['keys', 4], 7822917: ['mechanic', 4], 7822914: ['police', 4], 7822915: ['robberies', 4], 7822519: ['staffpanel', 5], 7822475: ['vehicleshop', 4]},
  scenes: {
    // 7822914: 'assets/scenes/police.jpg',
  },

  // Order of scripts in the hero hotbar
  hotbar: [7822914, 7822918, 7822917, 7822915, 7822916, 7822475, 7817100, 7822519, 7814841],
};
