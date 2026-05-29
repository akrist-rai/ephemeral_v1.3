// Maps arc IDs and episode IDs to actual images present in /public/one_piece/
// Updated to use all available images from the expanded collection.

export const DEFAULT_ARC_COVERS: Record<number, string> = {
  1: '/one_piece/Korean Edition Manga [phantom Busters] 팬텀 버스터즈 (jmanga227).jpeg',
  2: '/one_piece/ONE PIECE.jpeg',
  3: '/one_piece/Shugen jikka Kiyomaru.jpeg',
  4: '/one_piece/_ - 2026-05-28T234730.748.jpeg',
  5: '/one_piece/Mob psycho 100.jpeg',
  6: '/one_piece/Portada del primer número de One punch man_ Es veu al seu protagonista.jpeg',
  7: '/one_piece/チェンソーマン ＃１.jpeg',
  8: '/one_piece/One Piece Magazines.jpeg',
};

export const getArcCover = (arcId: number): string =>
  DEFAULT_ARC_COVERS[arcId] || '/one_piece/Straw Hat Pirates.jpeg';

export const getEpisodeImage = (epId: string): string => {
  const ep: Record<string, string> = {
    // Arc 1 — Algorithms
    'S1E1_A1': '/one_piece/Korean Edition Manga [phantom Busters] 팬텀 버스터즈 (jmanga227).jpeg',
    'S1E2_A1': '/one_piece/Poster - Veil.jpeg',
    'S1E3_A1': '/one_piece/SONS OF THE DEVIL Covers 1-5 - toni infante.jpeg',
    'S1E4_A1': '/one_piece/SUBWAY DIMENSIONS.jpeg',
    'S1E5_A1': '/one_piece/_ (70).jpeg',
    'S1E6_A1': '/one_piece/_ (71).jpeg',
    'S1E7_A1': '/one_piece/_ (75).jpeg',
    'S1E8_A1': '/one_piece/_ (76).jpeg',

    // Arc 2 — Cybersecurity (One Piece)
    'S1E1_A2': '/one_piece/ONE PIECE.jpeg',
    'S1E2_A2': '/one_piece/One piece wano x Gta.jpeg',
    'S1E3_A2': '/one_piece/One Piece - Straw Hat Pirates, John Riddle.jpeg',
    'S1E4_A2': '/one_piece/God Valley.jpeg',
    'S1E5_A2': '/one_piece/Soul King Brook.jpeg',
    'S1E6_A2': '/one_piece/Straw Hat Pirates.jpeg',
    'S1E7_A2': '/one_piece/one piece.jpeg',
    'S1E8_A2': '/one_piece/𝑊𝑎𝑙𝑙𝑝𝑎𝑝𝑒𝑟 _ 𝐿𝑜𝑐𝑘𝑠𝑐𝑟𝑒𝑒𝑛 _ One piece tattoos, One piece wallpaper iphone, One piece pictures.jpeg',

    // Arc 3 — Machine Learning
    'S1E1_A3': '/one_piece/_ (69).jpeg',
    'S1E2_A3': '/one_piece/_ (84).jpeg',
    'S1E3_A3': '/one_piece/_ (94).jpeg',
    'S1E4_A3': '/one_piece/_ (72).jpeg',
    'S1E5_A3': '/one_piece/_ (73).jpeg',
    'S1E6_A3': '/one_piece/_ (74).jpeg',
    'S1E7_A3': '/one_piece/_ (77).jpeg',
    'S1E8_A3': '/one_piece/_ (78).jpeg',
    // legacy IDs
    'S1E1': '/one_piece/_ (69).jpeg',
    'S1E2': '/one_piece/_ (84).jpeg',
    'S1E3': '/one_piece/_ (94).jpeg',
    'S2E1': '/one_piece/_ (72).jpeg',
    'S2E2': '/one_piece/_ (73).jpeg',
    'S2E3': '/one_piece/_ (74).jpeg',

    // Arc 4 — Networks
    'S1E1_A4': '/one_piece/_ - 2026-05-28T234730.748.jpeg',
    'S1E2_A4': '/one_piece/_ - 2026-05-28T234740.487.jpeg',
    'S1E3_A4': '/one_piece/_ - 2026-05-28T234749.500.jpeg',
    'S1E4_A4': '/one_piece/_ - 2026-05-28T234756.088.jpeg',
    'S1E5_A4': '/one_piece/_ - 2026-05-28T234828.372.jpeg',
    'S1E6_A4': '/one_piece/_ - 2026-05-28T234849.394.jpeg',
    'S1E7_A4': '/one_piece/_ - 2026-05-28T234900.142.jpeg',
    'S1E8_A4': '/one_piece/_ - 2026-05-28T234910.002.jpeg',

    // Arc 5 — Data Structures
    'S1E1_A5': '/one_piece/Mob psycho 100.jpeg',
    'S1E2_A5': '/one_piece/mob psycho 100.jpeg',
    'S1E3_A5': '/one_piece/move! move! just like mob!💥.jpeg',
    'S1E4_A5': '/one_piece/_ (99).jpeg',
    'S1E5_A5': '/one_piece/_ (98).jpeg',
    'S1E6_A5': '/one_piece/_ (97).jpeg',
    'S1E7_A5': '/one_piece/_ (96).jpeg',
    'S1E8_A5': '/one_piece/_ (95).jpeg',

    // Arc 6 — Competitive Programming (OPM)
    'S1E1_A6': '/one_piece/Portada del primer número de One punch man_ Es veu al seu protagonista.jpeg',
    'S1E2_A6': '/one_piece/_ (85).jpeg',
    'S1E3_A6': '/one_piece/_ (86).jpeg',
    'S1E4_A6': '/one_piece/_ (87).jpeg',
    'S1E5_A6': '/one_piece/_ (88).jpeg',
    'S1E6_A6': '/one_piece/_ (89).jpeg',
    'S1E7_A6': '/one_piece/_ (90).jpeg',
    'S1E8_A6': '/one_piece/_ (91).jpeg',

    // Arc 7 — Mathematics / Chainsaw Man
    'S1E1_A7': '/one_piece/チェンソーマン ＃１.jpeg',
    'S1E2_A7': '/one_piece/Shugen jikka Kiyomaru.jpeg',
    'S1E3_A7': '/one_piece/_ (93).jpeg',
    'S1E4_A7': '/one_piece/_ (92).jpeg',
    'S1E5_A7': '/one_piece/Guts.jpeg',
    'S1E6_A7': '/one_piece/Hunter × Hunter Volume 11 Cover.jpeg',
    'S1E7_A7': '/one_piece/Slam Dunk Manga New Edition Cover Art – All 20 Covers.jpeg',
    'S1E8_A7': '/one_piece/Dandadan _ @lihaolow • tw ☆.jpeg',

    // Arc 8 — Probability
    'S1E1_A8': '/one_piece/One Piece Magazines.jpeg',
    'S1E2_A8': '/one_piece/_ (79).jpeg',
    'S1E3_A8': '/one_piece/_ (80).jpeg',
    'S1E4_A8': '/one_piece/_ (81).jpeg',
    'S1E5_A8': '/one_piece/_ (82).jpeg',
    'S1E6_A8': '/one_piece/_ (83).jpeg',
    'S1E7_A8': '/one_piece/_ (100).jpeg',
    'S1E8_A8': '/one_piece/One piece "NAKAMAS".jpeg',
  };
  return ep[epId] || '';
};

// Avatar options for the profile selector
export const HERO_IMAGES = {
  luffy:        '/avatar/Monkey D Luffy (1).jpeg',
  zoro:         '/avatar/Roronoa Zoro.jpeg',
  sanji:        '/avatar/Sanji (1).jpeg',
  nami:         '/avatar/Nami_.jpeg',
  brook:        '/avatar/Brook.jpeg',
  franky:       '/avatar/Franky.jpeg',
  usopp:        '/avatar/Usopp.jpeg',
  doflamingo:   '/avatar/Doflamingo.jpeg',
  itachi:       '/avatar/Itachi.jpeg',
  ichigo:       '/avatar/Ichigo Kurosaki.jpeg',
  saitama:      '/avatar/saitama.jpeg',
  dandadan:     '/avatar/Dandadan.jpeg',
  sakura:       '/avatar/sakuraharuno.jpeg',
  kizaru:       '/avatar/one piece_ borsalino kizaru.jpeg',
  okkarun:      '/avatar/˙⊹ ੈ✰┆𝑶𝒌𝒂𝒓𝒖𝒏.jpeg',
  yuta:         '/avatar/˙⊹ ੈ✰┆𝒚𝒖𝒕𝒂 𝒐𝒌𝒌𝒐𝒕𝒔𝒖.jpeg',
};

// Background images used across the app
export const BG_IMAGES = {
  heroDefault:   '/one_piece/ONE PIECE.jpeg',
  bountyBg:      '/one_piece/One piece "NAKAMAS".jpeg',
  leaderboardBg: '/one_piece/Straw Hat Pirates.jpeg',
  profileBg:     '/one_piece/one piece.jpeg',
  seriesBg:      '/one_piece/One Piece - Straw Hat Pirates, John Riddle.jpeg',
};
