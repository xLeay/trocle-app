export const MATCH_ICEBREAKERS = [
    // --- Directes & Efficaces ---
    "Salut ! Trop content du match, ton article m'intéresse carrément. Toujours dispo pour un troc ? 🙌",
    "Hello {username} ! C'est un match parfait, ça te dirait qu'on s'organise l'échange ?",
    "Salut ! Je cherchais exactement ça, le timing est parfait ! ✨",
    "Hello {username} ! Trop ravi de ce match, on s'organise quand pour l'échange ?",
    "Salut ! Nos deux objets étaient faits pour se rencontrer 🤝 On valide ça ?",
    "Hello ! C'est le match parfait. Tu es dispo cette semaine pour le troc ?",
    "Hey {username} ! Prêt(e) à passer au troc ? Ton article me fait trop envie !",
    "Salut ! Super match, dis-moi comment tu veux procéder pour l'échange 👍",

    // --- Sympas & Engageantes ---
    "Hello {username} ! Je crois bien qu'on a tous les deux trouvé notre bonheur haha ! On en discute ?",
    "Salut ! Ton article a l'air en super état, dis-moi si tu veux qu'on cale le troc 🤝",
    "Hey ! Trop stylé ton article, on se fait ce troc ?",
    "Hello {username} ! Coup de cœur sur ton article 🎯 On finalise l'échange quand tu veux !",
    "Salut ! Deux pépites qui se croisent, ça ne se refuse pas. On se fixe un RDV ?",
    "Hey {username} ! Ravi de ce match, j'espère que mon objet te plaît tout autant !",
    "Hello ! Le troc parfait existe enfin haha 🚀 Dis-moi tes disponibilités !",
    "Salut {username} ! Trop hâte d'échanger nos objets, dis-moi ce qui t'arrange pour la suite.",

    // --- Rapides & Pragmatiques ---
    "Hello ! Dispo pour échanger et finaliser le troc ?",
    "Salut {username} ! Trop chaud pour ce troc, dis-moi quand tu es dispo !",
    "Hello {username} ! Option main propre ou envoi pour notre troc ?",
    "Salut ! Match validé de mon côté, dis-moi quand tu veux bloquer le troc 🎯",
    "Hey {username} ! On règle les détails de l'échange en deux minutes ?",
    "Hello ! Prêt(e) pour le troc de mon côté, dis-moi quand c'est bon pour toi !",
    "Salut {username} ! On bloque le créneau pour l'échange ?",

    // --- Second degré / Décontractées ---
    "Hello {username} ! Je crois que nos affaires viennent de trouver leur nouveau proprio 📦",
    "Salut ! Algorithme validé, objets validés. On passe à l'échange ?",
    "Hey {username} ! Fin du suspense, l'échange idéal est là ⚡️ On s'organise ?",
    "Salut ! Ton objet m'a fait de l'œil, ravi qu'on ait matché ! On peaufine le troc ?",
    "Hello {username} ! Moins de blabla, plus de troc : tu es plutôt main propre ou envoi ?"
];

/**
 * Pioche une phrase d'accroche au hasard et injecte le pseudo si besoin.
 */
let lastIndex = -1;

export function getRandomIcebreaker(username?: string): string {
    let randomIndex: number;

    // Évite de sortir exactement la même phrase deux clics de suite
    do {
        randomIndex = Math.floor(Math.random() * MATCH_ICEBREAKERS.length);
    } while (MATCH_ICEBREAKERS.length > 1 && randomIndex === lastIndex);

    lastIndex = randomIndex;
    const template = MATCH_ICEBREAKERS[randomIndex];

    return template.replace(/\{username\}/g, username ? `@${username}` : '');
}
