// Maps arc IDs and episode IDs to actual images present in /public/one_piece/
// Only filenames that physically exist in that folder are used here.

export const DEFAULT_ARC_COVERS: Record<number, string> = {
  // Arc 1 — GOLDEN AGE ARC (Berserk / Algorithms)
  1: '/one_piece/Korean Edition Manga [phantom Busters] 팬텀 버스터즈 (jmanga227).jpeg',
  // Arc 2 — MARINEFORD ARC (One Piece / Cybersecurity)
  2: '/one_piece/One Piece - Straw Hat Pirates, John Riddle.jpeg',
  // Arc 3 — MONSTER W/O NAME ARC (Monster / ML)
  3: '/one_piece/Poster - Veil.jpeg',
  // Arc 4 — 1953 CYCLE ARC (Dark / Networks)
  4: '/one_piece/Credit_ Twitter @avenoirn.jpeg',
  // Arc 5 — THE FRIEND ARC (20th Century Boys / Data Structures)
  5: '/one_piece/Straw Hat Pirates.jpeg',
  // Arc 6 — MONSTER ASSOC ARC (OPM / Comp Prog)
  6: '/one_piece/Portada del primer número de One punch man_ Es veu al seu protagonista.jpeg',
  // Arc 7 — INSTRUMENTALITY ARC (Evangelion / Mathematics)
  7: '/one_piece/Shugen jikka Kiyomaru.jpeg',
  // Arc 8 — DIVERGENCE ARC (Steins;Gate / Probability)
  8: '/one_piece/ONE PIECE.jpeg',
};

export const getArcCover = (arcId: number): string => {
  return DEFAULT_ARC_COVERS[arcId] || '/one_piece/Straw Hat Pirates.jpeg';
};

export const getEpisodeImage = (epId: string): string => {
  const defaults: Record<string, string> = {
    // Arc 1 — Algorithms (Berserk)
    'S1E1_A1': '/one_piece/Korean Edition Manga [phantom Busters] 팬텀 버스터즈 (jmanga227).jpeg',
    'S1E2_A1': '/one_piece/Best _GOODNIGHT PUNPUN_ Fan Graphic Cover _ Poster💪.jpeg',
    'S1E3_A1': '/one_piece/𝒱𝑒il  #_𝑎𝑟𝑡_ 𝑠𝑎𝑠ℎ𝑖𝑜𝑠 𝑜𝑛 𝑖𝑛𝑠𝑡𝑎.jpeg',
    'S1E4_A1': '/one_piece/COMICリュエル&COMICジャルダン｜実業之日本社のwebコミックサイト -COMICリュエルVeil-.jpeg',

    // Arc 2 — Cybersecurity (One Piece)
    'S1E1_A2': '/one_piece/ONE PIECE.jpeg',
    'S1E2_A2': '/one_piece/One piece wano x Gta.jpeg',
    'S1E3_A2': '/one_piece/One Piece - Straw Hat Pirates, John Riddle.jpeg',
    'S1E4_A2': '/one_piece/Straw Hat Pirates.jpeg',

    // Arc 3 — Machine Learning (Monster)
    'S1E1': '/one_piece/_ (69).jpeg',
    'S1E2': '/one_piece/_ (70).jpeg',
    'S1E3': '/one_piece/_ (71).jpeg',
    'S2E1': '/one_piece/_ (72).jpeg',
    'S2E2': '/one_piece/_ (73).jpeg',
    'S2E3': '/one_piece/_ (74).jpeg',

    // Arc 4 — Networks (Dark)
    'S1E1_A4': '/one_piece/Credit_ Twitter @avenoirn.jpeg',
    'S1E2_A4': '/one_piece/AdriGold 🍊 (@GoldDAdri_) on X.jpeg',
    'S1E3_A4': '/one_piece/_ (84).jpeg',

    // Arc 5 — Data Structures (20th Century Boys)
    'S1E1_A5': '/one_piece/Anime Posters Online - Shop Unique Metal Prints, Pictures, Paintings _ Displate.jpeg',
    'S1E2_A5': '/one_piece/_ (75).jpeg',
    'S1E3_A5': '/one_piece/_ (76).jpeg',

    // Arc 6 — Competitive Programming (OPM)
    'S1E1_A6': '/one_piece/Anime Posters Online - Shop Unique Metal Prints, Pictures, Paintings _ Displate.jpeg',
    'S1E2_A6': '/one_piece/6.jpeg',
    'S1E3_A6': '/one_piece/3.jpeg',

    // Arc 7 — Mathematics (Evangelion)
    'S1E1_A7': '/one_piece/Shugen jikka Kiyomaru.jpeg',
    'S1E2_A7': '/one_piece/_ (77).jpeg',
    'S1E3_A7': '/one_piece/3.jpeg',

    // Arc 8 — Probability (Steins;Gate)
    'S1E1_A8': '/one_piece/_ (78).jpeg',
    'S1E2_A8': '/one_piece/_ (79).jpeg',
    'S1E3_A8': '/one_piece/_ (80).jpeg',
  };
  return defaults[epId] || '';
};
