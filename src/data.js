const groups = [
  ['Rockets', '🚀', 9, 'High-altitude rocket with accelerating trajectory and celestial aerial bloom.'],
  ['Anar & Fountains', '🎇', 10, 'Majestic earthen flowerpot fountain spewing continuous showers of golden embers.'],
  ['Chakri', '🌀', 8, 'High-velocity ground spinning wheel forming dazzling concentric rings of fire.'],
  ['Phuljhari', '✨', 8, 'Handheld sparkling wand radiating stars, crackles, and warm festive glow.'],
  ['Bombs', '🧨', 10, 'Classic Indian thunder cracker with visceral bass rumble, shockwave, and flash.'],
  ['Ladi & Strings', '💥', 7, 'Traditional red firecracker garland bursting in continuous rapid-fire crescendo.'],
  ['Aerial Spinners & UFOs', '🛸', 6, 'Flying saucer and helicopter spinner lifting vertically into the sky with glowing wings.'],
  ['Novelty & Magic', '🔮', 6, 'Classic festive nostalgia including Black Cobra snakes, color smoke, and magic snappers.'],
  ['Ground Spinners', '💫', 6, 'Aerodynamic ground spinner tracing luminous high-speed spiral trails.'],
  ['Sky Shots', '🎆', 7, 'Multi-shot heavy mortar battery launching sequential celebratory aerial shells.'],
  ['Special & Finale', '🌟', 6, 'Grand finale celebration multi-cake with kaleidoscopic symphonic fireworks.']
];

const names = {
  'Rockets': [
    { name: 'Comet Rocket', tag: 'Best Seller', height: '45m', sound: 'High', color: '#ff4757', sec: '#fbbf24' },
    { name: 'Whistling Screamer', tag: 'High Whistle', height: '52m', sound: 'Very High', color: '#38bdf8', sec: '#f43f5e' },
    { name: 'Star Rocket', tag: 'Glitter Burst', height: '40m', sound: 'High', color: '#fbbf24', sec: '#a855f7' },
    { name: 'Golden Willow Rocket', tag: 'Royal Gold', height: '58m', sound: 'High', color: '#f59e0b', sec: '#ffffff' },
    { name: 'Red Ruby Flare', tag: 'Ruby Red', height: '42m', sound: 'High', color: '#ef4444', sec: '#fbbf24' },
    { name: 'Galaxy Cosmic Rocket', tag: 'Multi-Color', height: '48m', sound: 'High', color: '#c084fc', sec: '#34d399' },
    { name: 'Silver Rain Rocket', tag: 'Shimmering', height: '40m', sound: 'Medium', color: '#e2e8f0', sec: '#38bdf8' },
    { name: 'Parachute Flare Rocket', tag: 'Drifting Flare', height: '62m', sound: 'Medium', color: '#10b981', sec: '#fef08a' },
    { name: 'Meteor Rocket', tag: 'Long Tail', height: '52m', sound: 'High', color: '#f97316', sec: '#fef08a' }
  ],
  'Anar & Fountains': [
    { name: 'Golden Anar', tag: 'Traditional', height: '6m', sound: 'Gentle Sizzle', color: '#f59e0b', sec: '#fef08a' },
    { name: 'Silver Star Fountain', tag: 'Brilliant White', height: '7m', sound: 'Sizzle', color: '#e2e8f0', sec: '#38bdf8' },
    { name: 'Tri-Colour Deluxe Anar', tag: 'National Pride', height: '8m', sound: 'Hiss & Pop', color: '#ff7700', sec: '#10b981' },
    { name: 'Ashoka Giant Koti (12m)', tag: 'Colossal Height', height: '12m', sound: 'Roar & Crackle', color: '#fbbf24', sec: '#f59e0b' },
    { name: 'Emerald Green Fountain', tag: 'Vibrant Green', height: '5m', sound: 'Hiss', color: '#10b981', sec: '#fbbf24' },
    { name: 'Ruby Crimson Anar', tag: 'Crimson Shower', height: '6m', sound: 'Sizzle', color: '#f43f5e', sec: '#ffedd5' },
    { name: 'Crackling King Pot', tag: 'Pop & Flash', height: '8m', sound: 'Crackling', color: '#f97316', sec: '#a855f7' },
    { name: 'Diamond Crystal Fountain', tag: 'Ultra Bright', height: '7m', sound: 'Sizzle', color: '#38bdf8', sec: '#ffffff' },
    { name: 'Rainbow Symphony Anar', tag: 'Multi-Hue', height: '6m', sound: 'Gentle', color: '#a855f7', sec: '#f59e0b' },
    { name: 'Golden Waterfall Fountain', tag: 'Cascading Stream', height: '9m', sound: 'Continuous Hiss', color: '#f59e0b', sec: '#ffffff' }
  ],
  'Chakri': [
    { name: 'Classic Zamin Chakri', tag: 'All-Time Classic', height: 'Ground', sound: 'Whirring', color: '#3b82f6', sec: '#fbbf24' },
    { name: 'Disco Wheel Chakri', tag: 'Flashing Colors', height: 'Ground', sound: 'High Whir', color: '#ec4899', sec: '#10b981' },
    { name: 'Turbo Speed Chakri', tag: 'Super RPM', height: 'Ground', sound: 'High Whir', color: '#f43f5e', sec: '#38bdf8' },
    { name: 'Electric Blue Whirl', tag: 'Neon Blue', height: 'Ground', sound: 'Whirring', color: '#06b6d4', sec: '#f59e0b' },
    { name: 'Solar Golden Wheel', tag: 'Sunburst Ring', height: 'Ground', sound: 'Smooth Whir', color: '#eab308', sec: '#f97316' },
    { name: 'Rainbow Spinner', tag: 'Kaleidoscope', height: 'Ground', sound: 'Whirring', color: '#8b5cf6', sec: '#f43f5e' },
    { name: 'Whirlwind King', tag: 'Vortex Glow', height: 'Ground', sound: 'High Whir', color: '#f97316', sec: '#38bdf8' },
    { name: 'Giant Red Chakri', tag: 'Long Spinning', height: 'Ground', sound: 'Deep Whir', color: '#ef4444', sec: '#fbbf24' }
  ],
  'Phuljhari': [
    { name: 'Gold Sparkler (15cm)', tag: 'Golden Star', height: 'Handheld', sound: 'Whispering', color: '#f59e0b', sec: '#ffffff' },
    { name: 'Silver Sparkler (15cm)', tag: 'Pure White', height: 'Handheld', sound: 'Whispering', color: '#cbd5e1', sec: '#38bdf8' },
    { name: 'Giant Deluxe Sparkler (50cm)', tag: 'Extra Long', height: 'Handheld', sound: 'Crackling', color: '#fbbf24', sec: '#f59e0b' },
    { name: 'Star Sparkler', tag: 'Twinkling', height: 'Handheld', sound: 'Crackling', color: '#fbbf24', sec: '#f43f5e' },
    { name: 'Mini Pencil Sparkler', tag: 'Kids Safe', height: 'Handheld', sound: 'Soft Sizzle', color: '#34d399', sec: '#fef08a' },
    { name: 'Electric Ruby Sparkler', tag: 'Crimson Glow', height: 'Handheld', sound: 'Gentle', color: '#f43f5e', sec: '#fbbf24' },
    { name: 'Rainbow Sparkler', tag: 'Multi-Spark', height: 'Handheld', sound: 'Crackling', color: '#c084fc', sec: '#10b981' },
    { name: 'Bengal Torch Sparkler', tag: 'Flaring Wand', height: 'Handheld', sound: 'Sizzle', color: '#38bdf8', sec: '#ffffff' }
  ],
  'Bombs': [
    { name: 'Classic Sutli Bomb', tag: 'Legendary Jute', height: 'Ground Flash', sound: 'Heavy Bass', color: '#22c55e', sec: '#ef4444' },
    { name: 'Hydro Bomb Extreme', tag: 'Water Safe', height: 'Ground Flash', sound: 'Visceral Bass', color: '#15803d', sec: '#fbbf24' },
    { name: 'Green Atom Bomb', tag: 'High Decibel', height: 'Ground Flash', sound: 'Loud Thud', color: '#16a34a', sec: '#fef08a' },
    { name: 'Classic Bullet Bomb', tag: 'Paper Bullet', height: 'Ground Flash', sound: 'Crisp Pop', color: '#dc2626', sec: '#f59e0b' },
    { name: 'Thunder King', tag: 'Royal Blast', height: 'Ground Flash', sound: 'Visceral Bass', color: '#b91c1c', sec: '#fef08a' },
    { name: 'Double Sound Boom', tag: 'Double Thud', height: 'Ground Flash', sound: 'Echo Blast', color: '#ea580c', sec: '#a855f7' },
    { name: 'Mega Crackle Bomb', tag: 'Multi-Crackle', height: 'Ground Flash', sound: 'Crackling', color: '#e11d48', sec: '#38bdf8' },
    { name: 'Thunder Pop Mini', tag: 'Virtual Safe', height: 'Ground Flash', sound: 'Loud Pop', color: '#ef4444', sec: '#fbbf24' },
    { name: 'Night Rumble Bomb', tag: 'Deep Sub', height: 'Ground Flash', sound: 'Sub Bass', color: '#7c3aed', sec: '#fbbf24' },
    { name: 'Mirchi Bullet Bomb', tag: 'Sharp Crack', height: 'Ground Flash', sound: 'Snapping', color: '#f43f5e', sec: '#ffffff' }
  ],
  'Ladi & Strings': [
    { name: '1000 Wala Red Ladi', tag: 'Festive Must', height: 'Ground Chain', sound: 'Rapid Fire', color: '#dc2626', sec: '#fbbf24' },
    { name: '5000 Wala Mega Garland', tag: 'Grand Celebration', height: 'Ground Chain', sound: 'Non-Stop Roar', color: '#b91c1c', sec: '#fef08a' },
    { name: 'Mirchi Ladi String (100)', tag: 'Fast Crackles', height: 'Ground Chain', sound: 'Snappy Pops', color: '#ef4444', sec: '#ffffff' },
    { name: 'Bijli Cracker Roll (500)', tag: 'Twinkling Flashes', height: 'Ground Chain', sound: 'Rapid Crackle', color: '#f97316', sec: '#fbbf24' },
    { name: 'Red Matka 250 Ladi', tag: 'Traditional Matka', height: 'Ground Chain', sound: 'Thumping Chain', color: '#d97706', sec: '#ef4444' },
    { name: 'Golden Crackle String', tag: 'Gold Spark String', height: 'Ground Chain', sound: 'Crisp Sizzle', color: '#f59e0b', sec: '#ffffff' },
    { name: 'Thunder Ladi Chain', tag: 'Bass Crackle', height: 'Ground Chain', sound: 'Heavy Chain', color: '#991b1b', sec: '#fbbf24' }
  ],
  'Aerial Spinners & UFOs': [
    { name: 'UFO Flying Saucer', tag: 'Sky Ascending', height: '18m', sound: 'High Whir', color: '#10b981', sec: '#fbbf24' },
    { name: 'Helicopter Starfire', tag: 'Twin Rotor', height: '22m', sound: 'Whistling Whir', color: '#38bdf8', sec: '#f43f5e' },
    { name: 'Butterfly Sky Spinner', tag: 'Fluttering Wings', height: '15m', sound: 'Soft Whir', color: '#ec4899', sec: '#fbbf24' },
    { name: 'Drone Firebird', tag: 'Neon Exhaust', height: '25m', sound: 'Electric Whir', color: '#8b5cf6', sec: '#34d399' },
    { name: 'Flying Pigeon Spinner', tag: 'Spiral Ascend', height: '16m', sound: 'Whir & Pop', color: '#06b6d4', sec: '#f59e0b' },
    { name: 'Parachute Night Drop', tag: 'Drifting Lantern', height: '28m', sound: 'Pop & Glow', color: '#f59e0b', sec: '#ffffff' }
  ],
  'Novelty & Magic': [
    { name: 'Black Cobra Magic Tablet', tag: 'Childhood Legend', height: 'Ground Ash', sound: 'Hissing Smoke', color: '#334155', sec: '#fbbf24' },
    { name: 'Tricolor Magic Smoke Torch', tag: 'Dense Fog', height: 'Ground Plume', sound: 'Continuous Hiss', color: '#ff7700', sec: '#10b981' },
    { name: 'Magic Pop-Pop Snappers', tag: 'Drop to Pop', height: 'Instant Ground', sound: 'Snapping Crack', color: '#f43f5e', sec: '#ffffff' },
    { name: 'Color Torch Bengal Light', tag: 'Crimson Flare', height: 'Handheld', sound: 'Silent Flame', color: '#ef4444', sec: '#38bdf8' },
    { name: 'Magic Whistling Siren', tag: 'Screaming Siren', height: 'Ground', sound: 'Continuous Siren', color: '#3b82f6', sec: '#fef08a' },
    { name: 'Color Smoke Grenade', tag: 'Vibrant Violet', height: 'Plume Smoke', sound: 'Gentle Hiss', color: '#a855f7', sec: '#38bdf8' }
  ],
  'Ground Spinners': [
    { name: 'Dancing Star Spinner', tag: 'Acrobatic', height: 'Ground', sound: 'Whir & Spark', color: '#38bdf8', sec: '#f43f5e' },
    { name: 'Firefly Ground Spinner', tag: 'Glittering Ring', height: 'Ground', sound: 'Sizzle Whir', color: '#a855f7', sec: '#fef08a' },
    { name: 'Neon Spiral Glow', tag: 'Electric Ring', height: 'Ground', sound: 'Whirring', color: '#10b981', sec: '#f59e0b' },
    { name: 'Comet Wheel Spinner', tag: 'Comet Tail', height: 'Ground', sound: 'High Whir', color: '#f97316', sec: '#38bdf8' },
    { name: 'Twister Ground Spinner', tag: 'Rapid Twist', height: 'Ground', sound: 'Whirring', color: '#ec4899', sec: '#fbbf24' },
    { name: 'Diamond Ring Spinner', tag: 'Silver Spark', height: 'Ground', sound: 'High Whir', color: '#e2e8f0', sec: '#38bdf8' }
  ],
  'Sky Shots': [
    { name: 'Peacock 12-Shot Shell', tag: 'Peacock Feathers', height: '60m', sound: 'Volley Boom', color: '#06b6d4', sec: '#10b981' },
    { name: '30-Shot Golden Palm Cake', tag: 'Heavy Battery', height: '65m', sound: 'Rapid Booms', color: '#f59e0b', sec: '#ffffff' },
    { name: '50-Shot Rainbow Matrix', tag: 'Grand Symphony', height: '70m', sound: 'Multi-Volley', color: '#ec4899', sec: '#38bdf8' },
    { name: 'Golden Willow Cake', tag: 'Weeping Willow', height: '70m', sound: 'Heavy Boom', color: '#eab308', sec: '#f97316' },
    { name: 'Starlight Volley Mortar', tag: '5-Shell Cascade', height: '65m', sound: 'Triple Boom', color: '#8b5cf6', sec: '#f43f5e' },
    { name: 'Titanium Salute Mortar', tag: 'Visceral Flash', height: '80m', sound: 'Thunder Salute', color: '#ffffff', sec: '#fbbf24' },
    { name: 'Galaxy Volley Battery', tag: 'Cosmic Sky', height: '75m', sound: 'Multi-Boom', color: '#38bdf8', sec: '#c084fc' }
  ],
  'Special & Finale': [
    { name: 'Diwali Crown Imperial', tag: 'Royal Edition', height: '80m', sound: 'Symphonic', color: '#fbbf24', sec: '#e11d48' },
    { name: '120-Shot Grand Finale', tag: 'Showstopper', height: '95m', sound: 'Epic Crescendo', color: '#f43f5e', sec: '#fef08a' },
    { name: 'Golden Celebration Shell', tag: 'Festival King', height: '85m', sound: 'Grand Boom', color: '#f59e0b', sec: '#ffffff' },
    { name: 'Aurora Borealis Multi-Burst', tag: 'Borealis Sky', height: '90m', sound: 'Multi-Boom', color: '#34d399', sec: '#c084fc' },
    { name: 'Brocade Crown Grand Finale', tag: 'Golden Kamuro', height: '88m', sound: 'Heavy Cascade', color: '#f59e0b', sec: '#fef08a' },
    { name: 'Maharaja Diwali Salute', tag: 'Imperial Salute', height: '100m', sound: 'Grand Salute', color: '#dc2626', sec: '#fbbf24' }
  ]
};

let crackerId = 0;
export const crackers = groups.flatMap(([category, icon, count, defaultDesc]) => {
  return names[category].slice(0, count).map((item) => {
    crackerId++;
    return {
      id: crackerId,
      name: item.name,
      category,
      icon,
      tag: item.tag,
      color: item.color,
      secondaryColor: item.sec,
      price: 25 + ((crackerId * 19) % 76),
      description: `${item.name} — ${defaultDesc}`,
      stats: {
        height: item.height,
        sound: item.sound,
        intensity: 70 + ((crackerId * 7) % 30),
        duration:
          category.includes('Ladi') || category.includes('Strings')
            ? '3.2s'
            : category.includes('Fountain') || category === 'Phuljhari'
            ? '2.8s'
            : category === 'Chakri' || category.includes('Spinners')
            ? '2.5s'
            : '2.0s',
        ecoFriendly: '100% Virtual • Zero Smoke',
      }
    };
  });
});

export const categories = ['All', ...groups.map((g) => g[0])];
