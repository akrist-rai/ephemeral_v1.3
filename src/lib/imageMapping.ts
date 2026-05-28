export const DEFAULT_ARC_COVERS: Record<number, string> = {
  1: '/one_piece/SONS OF THE DEVIL Covers 1-5 - toni infante.jpeg',
  2: '/one_piece/One Piece - Straw Hat Pirates, John Riddle.jpeg',
  3: '/one_piece/Poster - Veil.jpeg',
  4: '/one_piece/𝑊𝑎𝑙𝑙𝑝𝑎𝑝𝑒𝑟 _ 𝐿𝑜𝑐𝑘𝑠𝑐𝑟𝑒𝑒𝑛 _ One piece tattoos, One piece wallpaper iphone, One piece pictures.jpeg',
  5: '/one_piece/ONE PIECE NOVEL LAW_ CH_ 1.jpeg',
  6: '/one_piece/Portada del primer número de One punch man_ Es veu al seu protagonista.jpeg',
  7: '/one_piece/チェンソーマン ＃１.jpeg',
  8: '/one_piece/Buggy, Sir Crocodile & Mihawk - One Piece.jpeg'
};

export const getArcCover = (arcId: number): string => {
  return DEFAULT_ARC_COVERS[arcId] || '/one_piece/Straw Hat Pirates.jpeg';
};

export const getEpisodeImage = (epId: string): string => {
  const defaults: Record<string, string> = {
    // Arc 1 — Algorithms (Berserk)
    'S1E1_A1': '/one_piece/SONS OF THE DEVIL Covers 1-5 - toni infante.jpeg',
    'S1E2_A1': '/one_piece/Slam Dunk Manga New Edition Cover Art – All 20 Covers.jpeg',
    'S1E3_A1': '/one_piece/Korean Edition Manga [phantom Busters] 팬텀 버스터즈 (jmanga227).jpeg',
    'S1E4_A1': '/one_piece/COMICリュエル&COMICジャルダン｜実業之日本社のwebコミックサイト -COMICリュエルVeil-.jpeg',

    // Arc 2 — Cybersecurity (One Piece)
    'S1E1_A2': '/one_piece/One Piece Magazines.jpeg',
    'S1E2_A2': '/one_piece/One piece wano x Gta.jpeg',
    'S1E3_A2': '/one_piece/ONE PIECE.jpeg',
    'S1E4_A2': '/one_piece/Buggy, Sir Crocodile & Mihawk - One Piece.jpeg',

    // Arc 3 — Machine Learning (Monster)
    'S1E1': '/one_piece/_ (69).jpeg',
    'S1E2': '/one_piece/_ (70).jpeg',
    'S1E3': '/one_piece/_ (71).jpeg',
    'S2E1': '/one_piece/_ (72).jpeg',
    'S2E2': '/one_piece/_ (73).jpeg',
    'S2E3': '/one_piece/_ (74).jpeg',

    // Arc 4 — Networks (Dark)
    'S1E1_A4': '/one_piece/Credit_ Twitter @avenoirn.jpeg',
    'S1E2_A4': '/one_piece/X (1).jpeg',
    'S1E3_A4': '/one_piece/AdriGold 🍊 (@GoldDAdri_) on X.jpeg',

    // Arc 5 — Data Structures (20th Century Boys)
    'S1E1_A5': '/one_piece/God Valley.jpeg',
    'S1E2_A5': '/one_piece/One piece "NAKAMAS".jpeg',
    'S1E3_A5': '/one_piece/1997_ The start of an adventure ☠️🏝.jpeg',

    // Arc 6 — Competitive Programming (OPM)
    'S1E1_A6': '/one_piece/Anime Posters Online - Shop Unique Metal Prints, Pictures, Paintings _ Displate.jpeg',
    'S1E2_A6': '/one_piece/6.jpeg',
    'S1E3_A6': '/one_piece/2.jpeg',

    // Arc 7 — Mathematics (Evangelion)
    'S1E1_A7': '/one_piece/Shugen jikka Kiyomaru.jpeg',
    'S1E2_A7': '/one_piece/Hunter × Hunter Volume 11 Cover.jpeg',
    'S1E3_A7': '/one_piece/3.jpeg',

    // Arc 8 — Probability (Steins;Gate)
    'S1E1_A8': '/one_piece/kawaii_cute food – marker style drawing.jpeg',
    'S1E2_A8': '/one_piece/楽天ブックス_ onBLUE　vol．48 - 紀伊 カンナ - 9784396785086 _ 本.jpeg',
    'S1E3_A8': '/one_piece/one piece.jpeg'
  };
  return defaults[epId] || '';
};

