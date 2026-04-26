// ─── Deterministic hash from string ──────────────────────────────────────────
const strToNum = (str, max = 1000) => {
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) % max;
};

// ─── Category → Picsum seed pools ────────────────────────────────────────────
// Each category has 20 seeds so products within the same category look varied
const CATEGORY_SEEDS = {
  electronics:              [10,11,12,13,14,15,16,17,18,19,180,181,182,183,184,185,186,187,188,189],
  fashion:                  [20,21,22,23,24,25,26,27,28,29,200,201,202,203,204,205,206,207,208,209],
  'home & kitchen':         [30,31,32,33,34,35,36,37,38,39,300,301,302,303,304,305,306,307,308,309],
  home:                     [30,31,32,33,34,35,36,37,38,39,300,301,302,303,304,305,306,307,308,309],
  kitchen:                  [30,31,32,33,34,35,36,37,38,39,300,301,302,303,304,305,306,307,308,309],
  books:                    [40,41,42,43,44,45,46,47,48,49,400,401,402,403,404,405,406,407,408,409],
  beauty:                   [50,51,52,53,54,55,56,57,58,59,500,501,502,503,504,505,506,507,508,509],
  'beauty & personal care': [50,51,52,53,54,55,56,57,58,59,500,501,502,503,504,505,506,507,508,509],
  sports:                   [60,61,62,63,64,65,66,67,68,69,600,601,602,603,604,605,606,607,608,609],
  'sports & fitness':       [60,61,62,63,64,65,66,67,68,69,600,601,602,603,604,605,606,607,608,609],
  groceries:                [70,71,72,73,74,75,76,77,78,79,700,701,702,703,704,705,706,707,708,709],
  'groceries & food':       [70,71,72,73,74,75,76,77,78,79,700,701,702,703,704,705,706,707,708,709],
  toys:                     [80,81,82,83,84,85,86,87,88,89,800,801,802,803,804,805,806,807,808,809],
  'toys & baby':            [80,81,82,83,84,85,86,87,88,89,800,801,802,803,804,805,806,807,808,809],
  automotive:               [90,91,92,93,94,95,96,97,98,99,900,901,902,903,904,905,906,907,908,909],
  health:                   [100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],
  'health & wellness':      [100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],
  furniture:                [30,31,32,33,34,35,36,37,38,39,300,301,302,303,304,305,306,307,308,309],
};

// ─── Safely get first valid image URL from product ───────────────────────────
const getFirstValidImage = (product) => {
  const isDeadUrl = (url) =>
    !url ||
    typeof url !== 'string' ||
    url.includes('source.unsplash.com') ||
    url.includes('via.placeholder.com') ||
    url.includes('placeholder.com') ||
    url.trim() === '';

  // thumbnail
  if (product.thumbnail && !isDeadUrl(product.thumbnail)) return product.thumbnail;

  // images array — handle both Array and space-separated string (DB serialization quirk)
  let images = product.images;
  if (typeof images === 'string') {
    // space-separated URLs stored as a single string
    images = images.split(' ').filter(Boolean);
  }
  if (Array.isArray(images)) {
    const valid = images.find((u) => !isDeadUrl(u));
    if (valid) return valid;
  }

  return null;
};

// ─── Generate a Picsum URL for a product ─────────────────────────────────────
const getPicsumUrl = (product, w = 400, h = 400) => {
  const category = (
    product?.categoryName ||
    product?.category?.name ||
    ''
  ).toLowerCase().trim();

  const seeds = CATEGORY_SEEDS[category];
  const id    = String(product?._id || product?.title || 'trendzz');

  if (seeds) {
    const seed = seeds[strToNum(id, seeds.length)];
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
  }

  // Fallback: deterministic seed from product id
  const numericSeed = strToNum(id, 800) + 100;
  return `https://picsum.photos/seed/${numericSeed}/${w}/${h}`;
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const getProductImage = (product, w = 400, h = 400) => {
  if (!product) return `https://picsum.photos/seed/trendzz/${w}/${h}`;
  const valid = getFirstValidImage(product);
  return valid || getPicsumUrl(product, w, h);
};

export const getProductImages = (product, count = 4) => {
  if (!product) {
    return Array.from({ length: count }, (_, i) =>
      `https://picsum.photos/seed/${100 + i}/600/600`
    );
  }

  const isDeadUrl = (url) =>
    !url ||
    typeof url !== 'string' ||
    url.includes('source.unsplash.com') ||
    url.includes('via.placeholder.com') ||
    url.includes('placeholder.com') ||
    url.trim() === '';

  let images = product.images;
  if (typeof images === 'string') images = images.split(' ').filter(Boolean);
  const validImages = (Array.isArray(images) ? images : []).filter((u) => !isDeadUrl(u));

  if (validImages.length >= count) return validImages.slice(0, count);

  const category = (product?.categoryName || product?.category?.name || '').toLowerCase().trim();
  const seeds    = CATEGORY_SEEDS[category];
  const id       = String(product?._id || product?.title || 'trendzz');

  const generated = Array.from({ length: count - validImages.length }, (_, i) => {
    if (seeds) {
      const seed = seeds[(strToNum(id, seeds.length) + i) % seeds.length];
      return `https://picsum.photos/seed/${seed}-${i}/600/600`;
    }
    return `https://picsum.photos/seed/${strToNum(id + i, 800) + 100}/600/600`;
  });

  return [...validImages, ...generated];
};

export const imgError = (product) => (e) => {
  e.target.onerror = null;
  e.target.src = getPicsumUrl(product, 400, 400);
};
