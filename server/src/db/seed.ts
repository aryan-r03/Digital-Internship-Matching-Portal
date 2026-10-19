import { db, initDatabase } from './index.js';
import { hashPassword } from '../middleware/auth.js';

export function runSeed() {
  console.log('[Seed] Initializing database schema...');
  initDatabase();

  console.log('[Seed] Purging existing seed data to ensure idempotency...');
  db.exec(`
    DELETE FROM reading_history;
    DELETE FROM chapter_comments;
    DELETE FROM reviews;
    DELETE FROM bookmarks;
    DELETE FROM chapters;
    DELETE FROM manga;
    DELETE FROM users;
  `);

  console.log('[Seed] Seeding users...');
  const defaultPassword = hashPassword('password123');

  const insertUser = db.prepare(`
    INSERT INTO users (username, email, password_hash, role, avatar_url, bio)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const adminResult = insertUser.run(
    'MangaEditor',
    'admin@nextgenmanga.io',
    defaultPassword,
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'Lead curator & editor-in-chief at NextGen Manga Studio.'
  );
  const adminId = Number(adminResult.lastInsertRowid);

  const creatorResult = insertUser.run(
    'KenshiArtisan',
    'kenshi@nextgenmanga.io',
    defaultPassword,
    'creator',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'Manga artist & writer specializing in dark atmospheric seinen and high-octane cyberpunk.'
  );
  const creatorId = Number(creatorResult.lastInsertRowid);

  const readerResult = insertUser.run(
    'YukiReader',
    'yuki@nextgenmanga.io',
    defaultPassword,
    'reader',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'Voracious manga connoisseur. Speed lines & ink textures are life.'
  );
  const readerId = Number(readerResult.lastInsertRowid);

  console.log('[Seed] Seeding manga series...');
  const insertManga = db.prepare(`
    INSERT INTO manga (
      title, japanese_title, slug, synopsis, cover_image, banner_image,
      author, artist, status, demographic, release_year, genres, is_featured,
      rating_avg, rating_count, views_count, bookmarks_count, creator_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mangaList = [
    {
      title: 'Chrono Blade: Eclipse',
      japanese_title: 'クロノ・ブレイド: 蝕',
      slug: 'chrono-blade-eclipse',
      synopsis: 'In an alternate Kamakura period shattered by temporal rifts, an outcast swordsman discovers a cursed obsidian nodachi capable of severing moments in time. As demonic entities known as the Umbra pour through the cosmic seams, he must forge a trail through blood and fractured memories to prevent the eternal eclipse.',
      cover_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      author: 'Renjiro Takahashi',
      artist: 'Sora Minato',
      status: 'Ongoing',
      demographic: 'Seinen',
      release_year: 2024,
      genres: ['Dark Fantasy', 'Action', 'Supernatural', 'Historical'],
      is_featured: 1,
      rating_avg: 4.9,
      rating_count: 342,
      views_count: 89450,
      bookmarks_count: 4210,
      creator_id: creatorId,
    },
    {
      title: 'Neon Ronin 2099',
      japanese_title: 'ネオン浪人 2099',
      slug: 'neon-ronin-2099',
      synopsis: 'Neo-Shinjuku is governed by omnipotent mega-corporations and neural surveillance grids. Jin, a decommissioned cyber-samurai with obsolete biomechanical augments, operates in the shadow alleys as a mercenary for hire. When an AI containing forbidden pre-collapse consciousness asks for sanctuary, all eight corporate zaibatsus mark him for eradication.',
      cover_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      author: 'Kaelen Vance',
      artist: 'Hoshiko Endo',
      status: 'Ongoing',
      demographic: 'Seinen',
      release_year: 2023,
      genres: ['Cyberpunk', 'Sci-Fi', 'Action', 'Psychological'],
      is_featured: 1,
      rating_avg: 4.8,
      rating_count: 289,
      views_count: 76320,
      bookmarks_count: 3890,
      creator_id: creatorId,
    },
    {
      title: 'Spirit Weaver: Tokyo Underworld',
      japanese_title: '綾織りの霊界',
      slug: 'spirit-weaver-tokyo-underworld',
      synopsis: 'Hidden beneath Tokyo’s labyrinthine subway terminals exists the Weave—a spiritual mirror dimension where ancestral spirits and malevolent curses clash. High school calligrapher Kaori discovers her ink brush can manipulate the strings of fate itself, pulling her into an arcane underworld civil war.',
      cover_image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      author: 'Ayumi Sawada',
      artist: 'Kenzo Murata',
      status: 'Ongoing',
      demographic: 'Shonen',
      release_year: 2024,
      genres: ['Supernatural', 'Mystery', 'Urban Fantasy', 'Action'],
      is_featured: 1,
      rating_avg: 4.7,
      rating_count: 198,
      views_count: 45200,
      bookmarks_count: 2850,
      creator_id: creatorId,
    },
    {
      title: 'Sovereign of the Abyss',
      japanese_title: '深淵の覇王',
      slug: 'sovereign-of-the-abyss',
      synopsis: 'Cast into the deepest subterranean trench known as the Sunken Hollow, young warrior Ray emerges twenty years later possessing abyssal leviathan blood. Armed with ancient sea-relics and relentless will, he ascends to reclaim his stolen kingdom from the celestial tyrants.',
      cover_image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      author: 'Daiki Fujimoto',
      artist: 'Daiki Fujimoto',
      status: 'Ongoing',
      demographic: 'Shonen',
      release_year: 2023,
      genres: ['Fantasy', 'Action', 'Adventure'],
      is_featured: 1,
      rating_avg: 4.6,
      rating_count: 145,
      views_count: 38900,
      bookmarks_count: 2100,
      creator_id: adminId,
    },
    {
      title: 'Echoes of the Cherry Blossom Court',
      japanese_title: '桜宮の残響',
      slug: 'echoes-of-cherry-blossom-court',
      synopsis: 'A mesmerizing tale of court intrigue, forbidden romance, and masked assassins set in the opulent Heian dynasty. When Lady Shiori is selected as imperial concubine, she secretly enters as an undercover agent of the Shadow Lotus clan.',
      cover_image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
      author: 'Michiko Sato',
      artist: 'Chiyo Hamasaki',
      status: 'Completed',
      demographic: 'Shojo',
      release_year: 2022,
      genres: ['Historical', 'Drama', 'Romance', 'Mystery'],
      is_featured: 0,
      rating_avg: 4.9,
      rating_count: 412,
      views_count: 62100,
      bookmarks_count: 5120,
      creator_id: adminId,
    },
    {
      title: 'Aegis Protocol: Zero',
      japanese_title: 'イージス計画: 零',
      slug: 'aegis-protocol-zero',
      synopsis: 'Colossal tectonic bio-titans emerge from oceanic fault lines. Humanity’s remaining survival hinges on the Aegis Strike Units—colossal neural-linked mecha piloted by genetically modified teenagers whose sanity deteriorates with every synchronization battle.',
      cover_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
      author: 'Toru Shinagawa',
      artist: 'Makoto Oki',
      status: 'Ongoing',
      demographic: 'Seinen',
      release_year: 2024,
      genres: ['Mecha', 'Sci-Fi', 'Psychological', 'Military'],
      is_featured: 0,
      rating_avg: 4.5,
      rating_count: 88,
      views_count: 24300,
      bookmarks_count: 1450,
      creator_id: creatorId,
    }
  ];

  const mangaIds: Record<string, number> = {};

  for (const m of mangaList) {
    const res = insertManga.run(
      m.title,
      m.japanese_title,
      m.slug,
      m.synopsis,
      m.cover_image,
      m.banner_image,
      m.author,
      m.artist,
      m.status,
      m.demographic,
      m.release_year,
      JSON.stringify(m.genres),
      m.is_featured,
      m.rating_avg,
      m.rating_count,
      m.views_count,
      m.bookmarks_count,
      m.creator_id
    );
    mangaIds[m.slug] = Number(res.lastInsertRowid);
  }

  console.log('[Seed] Seeding chapters with full manga pages...');
  const insertChapter = db.prepare(`
    INSERT INTO chapters (manga_id, chapter_number, title, pages)
    VALUES (?, ?, ?, ?)
  `);

  // Chapters for Chrono Blade: Eclipse
  const chronoBladeId = mangaIds['chrono-blade-eclipse'];
  const chronoPagesCh1 = [
    { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=90', caption: 'PROLOGUE // THE OBSIDIAN BLADE AWAKENS' },
    { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 1: Midnight rain over Kamakura sanctuary.' },
    { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 2: "The temporal seam has fractured."' },
    { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 3: Blade unsheathed — sound effect: ドドド (DODODO)' },
    { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 4: The first severed second.' }
  ];

  const chronoPagesCh2 = [
    { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1200&q=90', caption: 'CHAPTER 2 // VALLEY OF SHATTERED CLOCKS' },
    { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 1: The Umbra swarm gathers in the mist.' },
    { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 2: "Step back, priestess. This is no ordinary cut."' },
    { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 3: The eclipse deepens — sound effect: ゴゴゴ (GOGOGO)' }
  ];

  const ch1Result = insertChapter.run(chronoBladeId, 1, 'The Obsidian Severance', JSON.stringify(chronoPagesCh1));
  const ch2Result = insertChapter.run(chronoBladeId, 2, 'Fracture at Crimson Gate', JSON.stringify(chronoPagesCh2));
  insertChapter.run(chronoBladeId, 3, 'Dance of the Hundred Echoes', JSON.stringify(chronoPagesCh1));

  // Chapters for Neon Ronin 2099
  const neonRoninId = mangaIds['neon-ronin-2099'];
  const neonPagesCh1 = [
    { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=90', caption: 'CHAPTER 1 // CHROMIUM RAIN' },
    { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 1: Sector 9 rooftop overpass.' },
    { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 2: Neon glare reflecting across katana edge.' },
    { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=90', caption: 'PANEL 3: "Neural link connected. Target confirmed."' }
  ];
  insertChapter.run(neonRoninId, 1, 'Chromium Rain & Silicon Blood', JSON.stringify(neonPagesCh1));
  insertChapter.run(neonRoninId, 2, 'Ghost in the Zaibatsu Grid', JSON.stringify(neonPagesCh1));

  // Chapters for Spirit Weaver
  const spiritWeaverId = mangaIds['spirit-weaver-tokyo-underworld'];
  insertChapter.run(spiritWeaverId, 1, 'The Ink of Hundred Curses', JSON.stringify(chronoPagesCh1));
  insertChapter.run(spiritWeaverId, 2, 'Subway Station Phantom', JSON.stringify(chronoPagesCh2));

  // Chapters for Sovereign of the Abyss
  const sovereignId = mangaIds['sovereign-of-the-abyss'];
  insertChapter.run(sovereignId, 1, 'Depth Zero: The Fall', JSON.stringify(chronoPagesCh2));
  insertChapter.run(sovereignId, 2, 'The Leviathan Heartbeat', JSON.stringify(chronoPagesCh1));

  console.log('[Seed] Seeding bookmarks and reading history...');
  const insertBookmark = db.prepare(`
    INSERT INTO bookmarks (user_id, manga_id, status, last_read_chapter_id, last_read_page)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertBookmark.run(readerId, chronoBladeId, 'reading', Number(ch1Result.lastInsertRowid), 3);
  insertBookmark.run(readerId, neonRoninId, 'reading', null, 1);
  insertBookmark.run(readerId, spiritWeaverId, 'plan_to_read', null, 1);

  db.prepare(`
    INSERT INTO reading_history (user_id, chapter_id, manga_id, progress_percent, read_at)
    VALUES (?, ?, ?, 100, datetime('now'))
  `).run(readerId, Number(ch1Result.lastInsertRowid), chronoBladeId);

  console.log('[Seed] Seeding community reviews & chapter comments...');
  const insertReview = db.prepare(`
    INSERT INTO reviews (user_id, manga_id, rating_story, rating_art, rating_characters, rating_overall, title, content, likes_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReview.run(
    readerId,
    chronoBladeId,
    5, 5, 5, 5.0,
    'Masterpiece of ink, kinetic tension, and tempo.',
    'Chrono Blade sets a brand new gold standard for historical dark fantasy. The ink textures, screen tones, and panel pacing make every sword stroke feel lethal. Absolutely mesmerizing storytelling.',
    28
  );

  insertReview.run(
    adminId,
    neonRoninId,
    5, 5, 4, 4.7,
    'Blade Runner meets Lone Wolf and Cub in glorious cyberpunk.',
    'The visual worldbuilding of Neo-Shinjuku is staggering. Every single panel is drenched in neon atmosphere, gritty rain, and razor-sharp action lines. Essential reading for cyberpunk fans.',
    19
  );

  const insertComment = db.prepare(`
    INSERT INTO chapter_comments (chapter_id, user_id, content)
    VALUES (?, ?, ?)
  `);

  insertComment.run(Number(ch1Result.lastInsertRowid), readerId, 'THAT DOUBLE-SPREAD AT PAGE 4 GAVE ME CHILLS! 🗡️🔥');
  insertComment.run(Number(ch1Result.lastInsertRowid), adminId, 'Notice the temporal distortion in the background screentone pattern. Incredible attention to detail.');

  console.log('[Seed] Database seeding completed successfully!');
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
  process.exit(0);
}
