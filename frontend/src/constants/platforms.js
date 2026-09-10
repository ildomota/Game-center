// Groups RAWG's many per-generation platform slugs into the families shown
// in the UI. Must stay in sync with PLATFORM_GROUPS in backend/src/routes/games.js.
// PlayStation has no glyph in the Tabler icon font, so it carries its real
// brand-mark SVG path instead (sourced from Simple Icons); every other
// platform uses a Tabler icon class.
const PLAYSTATION_SVG_PATH =
  'M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z'

export const PLATFORM_ITEMS = [
  { label: 'PC', slug: 'pc', icon: 'ti-brand-windows' },
  { label: 'PlayStation', slug: 'playstation', svgPath: PLAYSTATION_SVG_PATH },
  { label: 'Xbox', slug: 'xbox', icon: 'ti-brand-xbox' },
  { label: 'Nintendo Switch', slug: 'nintendo-switch', icon: 'ti-device-nintendo' },
  { label: 'iOS', slug: 'ios', icon: 'ti-brand-apple' },
  { label: 'Android', slug: 'android', icon: 'ti-brand-android' },
]

export const PLATFORM_LABELS = Object.fromEntries(PLATFORM_ITEMS.map((p) => [p.slug, p.label]))
