// Maps arc IDs and episode IDs to actual images present in /public/one_piece/
// Updated to use all available images from the expanded collection.

export const DEFAULT_ARC_COVERS: Record<number, string> = {
  1: '/one_piece/1.jpeg',
  2: '/one_piece/2.jpeg',
  3: '/one_piece/3.jpeg',
  4: '/one_piece/4.jpeg',
  5: '/one_piece/5.jpeg',
  6: '/one_piece/6.jpeg',
  7: '/one_piece/7.jpeg',
  8: '/one_piece/8.jpeg',
};

export const getArcCover = (arcId: number): string =>
  DEFAULT_ARC_COVERS[arcId] || '/one_piece/1.jpeg';

export const getEpisodeImage = (epId: string): string => {
  const ep: Record<string, string> = {
    // Arc 1 — Algorithms
    'S1E1_A1': '/one_piece/9.jpeg',
    'S1E2_A1': '/one_piece/10.jpeg',
    'S1E3_A1': '/one_piece/11.jpeg',
    'S1E4_A1': '/one_piece/12.jpeg',
    'S1E5_A1': '/one_piece/13.jpeg',
    'S1E6_A1': '/one_piece/14.jpeg',
    'S1E7_A1': '/one_piece/15.jpeg',
    'S1E8_A1': '/one_piece/16.jpeg',

    // Arc 2 — Cybersecurity
    'S1E1_A2': '/one_piece/17.jpeg',
    'S1E2_A2': '/one_piece/18.jpeg',
    'S1E3_A2': '/one_piece/19.jpeg',
    'S1E4_A2': '/one_piece/20.jpeg',
    'S1E5_A2': '/one_piece/21.jpeg',
    'S1E6_A2': '/one_piece/22.jpeg',
    'S1E7_A2': '/one_piece/23.jpeg',
    'S1E8_A2': '/one_piece/24.jpeg',

    // Arc 3 — Machine Learning
    'S1E1_A3': '/one_piece/25.jpeg',
    'S1E2_A3': '/one_piece/26.jpeg',
    'S1E3_A3': '/one_piece/27.jpeg',
    'S1E4_A3': '/one_piece/28.jpeg',
    'S1E5_A3': '/one_piece/29.jpeg',
    'S1E6_A3': '/one_piece/30.jpeg',
    'S1E7_A3': '/one_piece/31.jpeg',
    'S1E8_A3': '/one_piece/32.jpeg',
    // Legacy IDs
    'S1E1': '/one_piece/73.jpeg',
    'S1E2': '/one_piece/74.jpeg',
    'S1E3': '/one_piece/75.jpeg',
    'S2E1': '/one_piece/76.jpeg',
    'S2E2': '/one_piece/77.jpeg',
    'S2E3': '/one_piece/78.jpeg',

    // Arc 4 — Networks
    'S1E1_A4': '/one_piece/33.jpeg',
    'S1E2_A4': '/one_piece/34.jpeg',
    'S1E3_A4': '/one_piece/35.jpeg',
    'S1E4_A4': '/one_piece/36.jpeg',
    'S1E5_A4': '/one_piece/37.jpeg',
    'S1E6_A4': '/one_piece/38.jpeg',
    'S1E7_A4': '/one_piece/39.jpeg',
    'S1E8_A4': '/one_piece/40.jpeg',

    // Arc 5 — Data Structures
    'S1E1_A5': '/one_piece/41.jpeg',
    'S1E2_A5': '/one_piece/42.jpeg',
    'S1E3_A5': '/one_piece/43.jpeg',
    'S1E4_A5': '/one_piece/44.jpeg',
    'S1E5_A5': '/one_piece/45.jpeg',
    'S1E6_A5': '/one_piece/46.jpeg',
    'S1E7_A5': '/one_piece/47.jpeg',
    'S1E8_A5': '/one_piece/48.jpeg',

    // Arc 6 — Competitive Programming
    'S1E1_A6': '/one_piece/49.jpeg',
    'S1E2_A6': '/one_piece/50.jpeg',
    'S1E3_A6': '/one_piece/51.jpeg',
    'S1E4_A6': '/one_piece/52.jpeg',
    'S1E5_A6': '/one_piece/53.jpeg',
    'S1E6_A6': '/one_piece/54.jpeg',
    'S1E7_A6': '/one_piece/55.jpeg',
    'S1E8_A6': '/one_piece/56.jpeg',

    // Arc 7 — Mathematics
    'S1E1_A7': '/one_piece/57.jpeg',
    'S1E2_A7': '/one_piece/58.jpeg',
    'S1E3_A7': '/one_piece/59.jpeg',
    'S1E4_A7': '/one_piece/60.jpeg',
    'S1E5_A7': '/one_piece/61.jpeg',
    'S1E6_A7': '/one_piece/62.jpeg',
    'S1E7_A7': '/one_piece/63.jpeg',
    'S1E8_A7': '/one_piece/64.jpeg',

    // Arc 8 — Probability
    'S1E1_A8': '/one_piece/65.jpeg',
    'S1E2_A8': '/one_piece/66.jpeg',
    'S1E3_A8': '/one_piece/67.jpeg',
    'S1E4_A8': '/one_piece/68.jpeg',
    'S1E5_A8': '/one_piece/69.jpeg',
    'S1E6_A8': '/one_piece/70.jpeg',
    'S1E7_A8': '/one_piece/71.jpeg',
    'S1E8_A8': '/one_piece/72.jpeg',
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
  heroDefault:   '/one_piece/79.jpeg',
  bountyBg:      '/one_piece/80.jpeg',
  leaderboardBg: '/one_piece/81.jpeg',
  profileBg:     '/one_piece/82.jpeg',
  seriesBg:      '/one_piece/83.jpeg',
};
