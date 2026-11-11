// mobile/src/utils/format.js
const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

// 5000 -> "5 000 FCFA" ; 0 -> "Gratuit"
export function formatPrice(amount) {
  if (amount === 0) return 'Gratuit';
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
}

// "2026-12-31T20:00:00" -> "31 décembre 2026 à 20:00"
export function formatDate(isoString) {
  const d = new Date(isoString);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} à ${hh}:${mm}`;
}
