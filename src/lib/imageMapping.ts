// Maps arc IDs and episode IDs to actual images present in /public/one_piece/
// Only filenames that physically exist in that folder are used.

export const DEFAULT_ARC_COVERS: Record<number, string> = {
  1: '/one_piece/Korean Edition Manga [phantom Busters] 팬텀 버스터즈 (jmanga227).jpeg',
  2: '/one_piece/ONE PIECE.jpeg',
  3: '/one_piece/Shugen jikka Kiyomaru.jpeg',
  4: '/one_piece/Credit_ Twitter @avenoirn.jpeg',
  5: '/one_piece/Anime Posters Online - Shop Unique Metal Prints, Pictures, Paintings _ Displate.jpeg',
  6: '/one_piece/Portada del primer número de One punch man_ Es veu al seu protagonista.jpeg',
  7: '/one_piece/ANIME POSTERS - Sergey Zhikin.jpeg',
  8: '/one_piece/One Piece Magazines.jpeg',
};

export const getArcCover = (arcId: number): string =>
  DEFAULT_ARC_COVERS[arcId] || '/one_piece/Straw Hat Pirates.jpeg';

export const getEpisodeImage = (epId: string): string => {
  const ep: Record<string, string> = {
    // Arc 1 — Algorithms
    'S1E1_A1': '/one_piece/Korean Edition Manga [phantom Busters] 팬텀 버스터즈 (jmanga227).jpeg',
    'S1E2_A1': '/one_piece/Best _GOODNIGHT PUNPUN_ Fan Graphic Cover _ Poster💪.jpeg',
    'S1E3_A1': '/one_piece/Poster - Veil.jpeg',
    'S1E4_A1': '/one_piece/SONS OF THE DEVIL Covers 1-5 - toni infante.jpeg',

    // Arc 2 — Cybersecurity (One Piece)
    'S1E1_A2': '/one_piece/ONE PIECE.jpeg',
    'S1E2_A2': '/one_piece/One piece wano x Gta.jpeg',
    'S1E3_A2': '/one_piece/One Piece - Straw Hat Pirates, John Riddle.jpeg',
    'S1E4_A2': '/one_piece/God Valley.jpeg',

    // Arc 3 — Machine Learning (Monster)
    'S1E1':    '/one_piece/_ (69).jpeg',
    'S1E2':    '/one_piece/_ (84).jpeg',
    'S1E3':    '/one_piece/_ (94).jpeg',
    'S2E1':    '/one_piece/_ (72).jpeg',
    'S2E2':    '/one_piece/_ (73).jpeg',
    'S2E3':    '/one_piece/_ (74).jpeg',

    // Arc 4 — Networks (Dark)
    'S1E1_A4': '/one_piece/AdriGold 🍊 (@GoldDAdri_) on X.jpeg',
    'S1E2_A4': '/one_piece/Credit_ Twitter @avenoirn.jpeg',
    'S1E3_A4': '/one_piece/Mess🌿 (@Messcult) on X.jpeg',

    // Arc 5 — Data Structures
    'S1E1_A5': '/one_piece/Anime Posters Online - Shop Unique Metal Prints, Pictures, Paintings _ Displate.jpeg',
    'S1E2_A5': '/one_piece/One Piece Magazines.jpeg',
    'S1E3_A5': '/one_piece/_ (99).jpeg',

    // Arc 6 — Competitive Programming (OPM)
    'S1E1_A6': '/one_piece/Portada del primer número de One punch man_ Es veu al seu protagonista.jpeg',
    'S1E2_A6': '/one_piece/6.jpeg',
    'S1E3_A6': '/one_piece/3.jpeg',

    // Arc 7 — Mathematics
    'S1E1_A7': '/one_piece/ANIME POSTERS - Sergey Zhikin.jpeg',
    'S1E2_A7': '/one_piece/Shugen jikka Kiyomaru.jpeg',
    'S1E3_A7': '/one_piece/_ (93).jpeg',

    // Arc 8 — Probability (Steins;Gate)
    'S1E1_A8': '/one_piece/One Piece Magazines.jpeg',
    'S1E2_A8': '/one_piece/_ (79).jpeg',
    'S1E3_A8': '/one_piece/_ (80).jpeg',
  };
  return ep[epId] || '';
};

// Avatar options for the profile selector — these map character names to images
export const HERO_IMAGES = {
  luffy:     '/avatar/Monkey D Luffy (1).jpeg',
  zoro:      '/avatar/Roronoa Zoro.jpeg',
  sanji:     '/avatar/Sanji (1).jpeg',
  nami:      '/avatar/Nami_.jpeg',
  brook:     '/avatar/Brook.jpeg',
  franky:    '/avatar/Franky.jpeg',
  usopp:     '/avatar/Usopp.jpeg',
  doflamingo:'/avatar/Doflamingo.jpeg',
  itachi:    '/avatar/Itachi.jpeg',
  ichigo:    '/avatar/Ichigo Kurosaki.jpeg',
  saitama:   '/avatar/saitama.jpeg',
  dandadan:  '/avatar/Dandadan.jpeg',
};

// Background images used across the app
export const BG_IMAGES = {
  heroDefault:   '/one_piece/ONE PIECE.jpeg',
  bountyBg:      '/one_piece/One piece "NAKAMAS".jpeg',
  leaderboardBg: '/one_piece/Buggy, Sir Crocodile & Mihawk - One Piece.jpeg',
  profileBg:     '/one_piece/1997_ The start of an adventure ☠️🏝.jpeg',
};
