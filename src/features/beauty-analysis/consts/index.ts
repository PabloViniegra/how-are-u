// Beauty analysis feature constants
export const SCORE_RANGES = {
  EXCELLENT: { min: 8, max: 10, label: "Excelente", color: "green" },
  GOOD: { min: 6, max: 8, label: "Bueno", color: "blue" },
  AVERAGE: { min: 4, max: 6, label: "Promedio", color: "yellow" },
  POOR: { min: 0, max: 4, label: "Mejorable", color: "red" },
} as const;

export const BEAUTY_FEATURES = {
  FACIAL_SYMMETRY: "facial_symmetry",
  SKIN_QUALITY: "skin_quality",
  FACIAL_PROPORTIONS: "facial_proportions",
  EYE_FEATURES: "eye_features",
  NOSE_SHAPE: "nose_shape",
  LIP_SHAPE: "lip_shape",
  JAWLINE: "jawline",
  CHEEKBONES: "cheekbones",
} as const;

export const FEATURE_LABELS = {
  [BEAUTY_FEATURES.FACIAL_SYMMETRY]: "Simetría Facial",
  [BEAUTY_FEATURES.SKIN_QUALITY]: "Calidad de Piel",
  [BEAUTY_FEATURES.FACIAL_PROPORTIONS]: "Proporciones Faciales",
  [BEAUTY_FEATURES.EYE_FEATURES]: "Características de Ojos",
  [BEAUTY_FEATURES.NOSE_SHAPE]: "Forma de Nariz",
  [BEAUTY_FEATURES.LIP_SHAPE]: "Forma de Labios",
  [BEAUTY_FEATURES.JAWLINE]: "Línea de Mandíbula",
  [BEAUTY_FEATURES.CHEEKBONES]: "Pómulos",
} as const;

export const DETAILED_SCORE_LABELS = {
  attractiveness: "Atractivo",
  youthfulness: "Juventud",
  health_appearance: "Apariencia Saludable",
  confidence_level: "Nivel de Confianza",
  approachability: "Accesibilidad",
} as const;

export const IMAGE_QUALITY_LABELS = {
  poor: "Deficiente",
  fair: "Regular",
  good: "Buena",
  excellent: "Excelente",
} as const;

export const ANALYSIS_STATUS = {
  DENIED: "denied",
  IMPROVABLE: "improvable",
  FEASIBLE: "feasible",
} as const;

export const STATUS_LABELS = {
  [ANALYSIS_STATUS.DENIED]: "Imagen no válida",
  [ANALYSIS_STATUS.IMPROVABLE]: "Calidad insuficiente",
  [ANALYSIS_STATUS.FEASIBLE]: "Análisis exitoso",
} as const;

// Comprehensive translation map for all possible API fields
export const FIELD_TRANSLATIONS: Record<string, string> = {
  // Beauty features (detailed_scores)
  facial_symmetry: "Simetría Facial",
  skin_quality: "Calidad de Piel",
  facial_proportions: "Proporciones Faciales",
  eye_features: "Características de Ojos",
  nose_shape: "Forma de Nariz",
  lip_shape: "Forma de Labios",
  jawline: "Línea de Mandíbula",
  cheekbones: "Pómulos",

  // Additional scores
  attractiveness: "Atractivo",
  youthfulness: "Juventud",
  health_appearance: "Apariencia Saludable",
  confidence_level: "Nivel de Confianza",
  approachability: "Accesibilidad",

  // Comprehensive facial features and combinations
  facial_features: "Características Faciales",
  features_harmony: "Armonía de Características",
  eye_appeal: "Atractivo de Ojos",
  lip_aesthetics: "Estética de Labios",
  cheekbone_prominence: "Prominencia de Pómulos",
  nose_aesthetics: "Estética de Nariz",
  jaw_definition: "Definición de Mandíbula",
  jawline_definition: "Definición de Mandíbula",
  facial_balance: "Equilibrio Facial",
  skin_texture: "Textura de Piel",
  complexion_quality: "Calidad del Cutis",
  facial_structure: "Estructura Facial",
  bone_structure: "Estructura Ósea",
  face_geometry: "Geometría Facial",
  facial_ratios: "Proporciones Faciales",
  golden_ratio: "Proporción Áurea",
  symmetry_score: "Puntuación de Simetría",
  harmony_index: "Índice de Armonía",
  beauty_index: "Índice de Belleza",
  aesthetic_score: "Puntuación Estética",
  visual_appeal: "Atractivo Visual",
  facial_appeal: "Atractivo Facial",
  facial_composition: "Composición Facial",
  nose_harmony: "Armonía de la Nariz",
  eye_harmony: "Armonía de los Ojos",
  lip_harmony: "Armonía de los Labios",
  cheek_harmony: "Armonía de las Mejillas",

  // Eye-related terms
  eye_symmetry: "Simetría de Ojos",
  eye_shape: "Forma de Ojos",
  eye_size: "Tamaño de Ojos",
  eye_spacing: "Separación de Ojos",
  eye_color: "Color de Ojos",
  eyebrow_shape: "Forma de Cejas",
  eyelash_length: "Longitud de Pestañas",

  // Lip-related terms
  lip_fullness: "Volumen de Labios",
  lip_symmetry: "Simetría de Labios",
  lip_ratio: "Proporción de Labios",
  lip_definition: "Definición de Labios",

  // Nose-related terms
  nose_symmetry: "Simetría de Nariz",
  nose_size: "Tamaño de Nariz",
  nose_width: "Ancho de Nariz",
  nose_length: "Longitud de Nariz",
  nose_tip: "Punta de Nariz",

  // Skin-related terms
  skin_smoothness: "Suavidad de Piel",
  skin_tone_evenness: "Uniformidad de Tono",
  skin_clarity: "Claridad de Piel",
  skin_health: "Salud de Piel",
  complexion: "Cutis",

  // Other possible fields
  overall_attractiveness: "Atractivo General",
  beauty_score: "Puntuación de Belleza",
  face_shape: "Forma del Rostro",
  skin_tone: "Tono de Piel",
  hair_quality: "Calidad del Cabello",
  expression: "Expresión",
  makeup_quality: "Calidad del Maquillaje",
  lighting_quality: "Calidad de Iluminación",
  image_clarity: "Claridad de Imagen",
  pose_quality: "Calidad de Pose",
  age_appearance: "Apariencia de Edad",
  gender_appearance: "Apariencia de Género",
  ethnicity_blend: "Mezcla Étnica",
  distinctiveness: "Singularidad",
  memorability: "Memorabilidad",
  trustworthiness: "Confiabilidad",
  dominance: "Dominancia",
  competence: "Competencia",
  likability: "Simpatía",
  intelligence_appearance: "Apariencia Inteligente",
  emotional_stability: "Estabilidad Emocional",
  extraversion: "Extraversión",
  agreeableness: "Amabilidad",
  conscientiousness: "Responsabilidad",
  openness: "Apertura",
  neuroticism: "Neuroticismo",

  // Image quality metrics
  resolution: "Resolución",
  lighting: "Iluminación",
  clarity: "Claridad",
  angle: "Ángulo",
  focus: "Enfoque",
  exposure: "Exposición",
  contrast: "Contraste",
  saturation: "Saturación",
  noise_level: "Nivel de Ruido",
  blur_level: "Nivel de Desenfoque",

  // Fallback for common patterns
  quality: "Calidad",
  level: "Nivel",
  score: "Puntuación",
  rating: "Calificación",
  index: "Índice",
  measure: "Medida",
  value: "Valor",
} as const;

// Function to get translated field name
export const getFieldTranslation = (fieldKey: string): string => {
  // Normalize the key
  const normalizedKey = fieldKey.toLowerCase().trim();

  // Direct translation first (most important)
  if (FIELD_TRANSLATIONS[normalizedKey]) {
    return FIELD_TRANSLATIONS[normalizedKey];
  }

  // Extended word-by-word translation dictionary
  const wordTranslations: Record<string, string> = {
    // Body parts and features (nouns)
    facial: "Facial",
    skin: "Piel",
    eye: "Ojo",
    eyes: "Ojos",
    nose: "Nariz",
    lip: "Labio",
    lips: "Labios",
    face: "Rostro",
    jaw: "Mandíbula",
    jawline: "Mandíbula",
    cheek: "Mejilla",
    cheekbone: "Pómulo",
    cheekbones: "Pómulos",
    eyebrow: "Ceja",
    eyebrows: "Cejas",
    eyelash: "Pestaña",
    eyelashes: "Pestañas",
    forehead: "Frente",
    chin: "Barbilla",
    mouth: "Boca",

    // Qualities and characteristics (abstract concepts)
    beauty: "Belleza",
    attractive: "Atractivo",
    attractiveness: "Atractivo",
    appeal: "Atractivo",
    aesthetic: "Estético",
    aesthetics: "Estética",
    harmony: "Armonía",
    balance: "Equilibrio",
    symmetry: "Simetría",
    proportion: "Proporción",
    proportions: "Proporciones",
    structure: "Estructura",
    geometry: "Geometría",
    ratio: "Proporción",
    ratios: "Proporciones",
    definition: "Definición",
    prominence: "Prominencia",
    fullness: "Volumen",
    clarity: "Claridad",
    smoothness: "Suavidad",
    texture: "Textura",
    tone: "Tono",
    evenness: "Uniformidad",
    composition: "Composición",

    // Measurements and descriptors
    shape: "Forma",
    size: "Tamaño",
    width: "Ancho",
    length: "Longitud",
    height: "Altura",
    depth: "Profundidad",
    spacing: "Separación",
    distance: "Distancia",
    color: "Color",
    tip: "Punta",

    // Quality descriptors (adjectives)
    quality: "Calidad",
    health: "Salud",
    youthful: "Juvenil",
    youthfulness: "Juventud",
    mature: "Maduro",
    fresh: "Fresco",
    vibrant: "Vibrante",
    clear: "Claro",
    smooth: "Suave",
    rough: "Áspero",
    even: "Uniforme",
    uneven: "Desigual",

    // Scores and measurements
    score: "Puntuación",
    rating: "Calificación",
    level: "Nivel",
    index: "Índice",
    measure: "Medida",
    value: "Valor",
    point: "Punto",
    points: "Puntos",
    grade: "Grado",
    rank: "Rango",

    // Modifiers
    overall: "General",
    total: "Total",
    average: "Promedio",
    mean: "Media",
    high: "Alto",
    low: "Bajo",
    good: "Bueno",
    bad: "Malo",
    excellent: "Excelente",
    poor: "Deficiente",
    best: "Mejor",
    worst: "Peor",

    // Image and technical terms
    image: "Imagen",
    photo: "Foto",
    picture: "Imagen",
    resolution: "Resolución",
    lighting: "Iluminación",
    angle: "Ángulo",
    focus: "Enfoque",
    exposure: "Exposición",
    contrast: "Contraste",
    saturation: "Saturación",
    brightness: "Brillo",
    sharpness: "Nitidez",
    blur: "Desenfoque",
    noise: "Ruido",

    // Other terms
    appearance: "Apariencia",
    look: "Aspecto",
    features: "Características",
    traits: "Rasgos",
    expression: "Expresión",
    pose: "Pose",
    position: "Posición",
    view: "Vista",
    profile: "Perfil",
    front: "Frontal",
    side: "Lateral",
  };

  // Define which words are typically nouns (body parts, concrete things)
  const nouns = new Set([
    "piel", "ojo", "ojos", "nariz", "labio", "labios", "rostro", "mandíbula",
    "mejilla", "pómulo", "pómulos", "ceja", "cejas", "pestaña", "pestañas",
    "frente", "barbilla", "boca", "forma", "tamaño", "color", "punta",
    "imagen", "foto", "resolución", "ángulo", "enfoque", "exposición",
    "contraste", "saturación", "brillo", "nitidez", "desenfoque", "ruido"
  ]);

  // Handle snake_case and camelCase by splitting
  const words = normalizedKey
    .split(/[_\s-]|(?=[A-Z])/)
    .filter((word) => word.length > 0);

  const translatedWords = words.map((word) => {
    const lowerWord = word.toLowerCase();
    if (wordTranslations[lowerWord]) {
      return wordTranslations[lowerWord];
    }

    // If we can't translate it, capitalize the first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Apply Spanish grammar rules for word order
  if (translatedWords.length === 2) {
    const [firstTranslated, secondTranslated] = translatedWords;
    const first = firstTranslated?.toLowerCase() ?? '';
    const second = secondTranslated?.toLowerCase() ?? '';

    // If first word is a noun and second is a quality/descriptor
    // Change "Nariz Armonía" to "Armonía de la Nariz"
    if (nouns.has(first) && !nouns.has(second)) {
      const article = getSpanishArticle(first);
      return `${secondTranslated} de ${article} ${firstTranslated}`;
    }

    // If first word is an adjective/descriptor and second is a noun
    // Keep "Facial Composition" as "Composición Facial"
    if (!nouns.has(first) && nouns.has(second)) {
      return `${secondTranslated} ${firstTranslated}`;
    }
  }

  return translatedWords.join(" ");
};

// Helper function to get the appropriate Spanish article
const getSpanishArticle = (noun: string): string => {
  const feminineNouns = new Set([
    "piel", "nariz", "mandíbula", "mejilla", "ceja", "pestaña", "frente",
    "barbilla", "boca", "forma", "imagen", "foto", "resolución", "exposición",
    "nitidez"
  ]);

  return feminineNouns.has(noun.toLowerCase()) ? "la" : "el";
};