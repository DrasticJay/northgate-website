NORTHGATE STUDIOS WEBSITE
=========================
Your own store site. Products, prices and images load live from your Tebex account, so when you
change something on Tebex (price, description, image) the site updates by itself.
Customers fill their basket here, sign in with Cfx.re at checkout, then pay on Tebex.

PUT IT ONLINE (free, about 5 minutes) - Cloudflare Pages
1. Go to dash.cloudflare.com, sign up / log in.
2. Workers & Pages -> Create -> Pages -> "Upload assets".
3. Name it northgate-studios, then drag this whole folder (the one with index.html in it) onto the page.
4. Deploy. You get a link like https://northgate-studios.pages.dev
5. Optional: Custom domains -> add your own domain (e.g. northgatestudios.co.uk).

Netlify works the same way: app.netlify.com -> "Add new site" -> "Deploy manually" -> drag the folder.

CHANGING THINGS
- data.js: everything the site says about each script (features, commands, settings, compatibility,
  install steps, FAQ, roadmap). Add a block here when you release a new script.
- config.js: the hero hotbar order, Discord link, which scripts are featured on the home page, the NEW badge, store groups, card taglines.
- assets/tiles: the pictures on the home page tiles.
- A new script appears on the site automatically when you add it on Tebex.
  Add its id to a group in config.js so it shows under Jobs / Crime / Vehicles / Server tools.

COMPLETE PACK
- config.js -> bundle.id is the Tebex package id of "Northgate Complete Pack". With 0 the site offers
  "Add all 8 to cart" at the normal price instead. The cart offers a swap to the pack when it saves money.

UPDATES PAGE
- data.js -> changelog: one line per release, newest first: [date, Tebex package id, version, [what changed]].
  Cards and product pages show "Updated <date>" from it. Also bump "version" in that script's block.

GAMEPLAY VIDEOS (optional, makes the site look much better)
1. Record 10-20 seconds per script on your server with OBS or Medal, 1920x1080, no HUD clutter, no sound needed.
   Good clips: police cuffing and opening the MDT, a thermite or drill robbery, walking into a furnished house,
   a mechanic repairing a car. Slow, smooth camera movement looks best.
2. Make them small: in HandBrake pick "Web > Creator 1080p30", tick "Web Optimized", turn audio off.
   Aim for under 8 MB each.
3. Put them in assets/video/ (for example police.mp4) and add them in config.js:
     heroVideo: 'assets/video/hero.mp4',
     videos: { 7822914: 'assets/video/police.mp4', 7822915: 'assets/video/robberies.mp4', 7822918: 'assets/video/housing.mp4' },
   Visitors who turn off motion in their system settings see the screenshots instead.
- In-game screenshots (F12 in FiveM or Steam) can go in assets/scenes/ and config.js -> scenes. They show faded
  behind the tablet in that script's section.

NOTES
- config.js holds your Tebex PUBLIC token. That one is meant to be public. Never put the Private Key in any file here.
- Checkout needs the site to be on a real web address (https). Opening index.html from your computer shows the
  store but checkout won't come back to it.

