/**
 * AI-assisted complaint classifier.
 * Analyses description text using keyword matching and returns
 * suggested category, department, priority, and a short summary.
 */

const rules = [
  {
    keywords: ['fan', 'ac', 'air condition', 'cool', 'hvac', 'ventilat', 'hot', 'heat', 'warm air'],
    categoryId: 'cat-8', categoryName: 'HVAC / Cooling',
    departmentId: 'dept-8', departmentName: 'HVAC & Cooling',
  },
  {
    keywords: ['light', 'bulb', 'tube', 'flicker', 'electric', 'power', 'socket', 'wire', 'short circuit', 'switch', 'fuse', 'voltage', 'current', 'trip'],
    categoryId: 'cat-1', categoryName: 'Electrical',
    departmentId: 'dept-1', departmentName: 'Electrical Maintenance',
  },
  {
    keywords: ['leak', 'pipe', 'water', 'tap', 'toilet', 'flush', 'drain', 'sewage', 'plumb', 'overflow', 'clog', 'blockage'],
    categoryId: 'cat-3', categoryName: 'Plumbing',
    departmentId: 'dept-3', departmentName: 'Plumbing & Sanitation',
  },
  {
    keywords: ['wifi', 'internet', 'network', 'projector', 'computer', 'laptop', 'printer', 'router', 'signal', 'server', 'software', 'system down', 'screen'],
    categoryId: 'cat-4', categoryName: 'IT & Network',
    departmentId: 'dept-4', departmentName: 'IT & Network',
  },
  {
    keywords: ['clean', 'dirty', 'smell', 'odor', 'waste', 'garbage', 'hygiene', 'toilet dirty', 'pest', 'rat', 'cockroach', 'insect', 'sweep', 'mop'],
    categoryId: 'cat-5', categoryName: 'Housekeeping',
    departmentId: 'dept-5', departmentName: 'Housekeeping & Sanitation',
  },
  {
    keywords: ['crack', 'wall', 'ceiling', 'floor', 'roof', 'structural', 'broken window', 'door', 'paint', 'plaster', 'concrete', 'building'],
    categoryId: 'cat-2', categoryName: 'Civil / Structural',
    departmentId: 'dept-2', departmentName: 'Civil & Structural',
  },
  {
    keywords: ['chair', 'bench', 'table', 'desk', 'furniture', 'cupboard', 'shelf', 'locker', 'cabinet', 'notice board', 'board'],
    categoryId: 'cat-7', categoryName: 'Furniture',
    departmentId: 'dept-7', departmentName: 'Carpentry & Furniture',
  },
  {
    keywords: ['security', 'cctv', 'camera', 'lock', 'key', 'access', 'theft', 'break in', 'suspicious', 'trespass'],
    categoryId: 'cat-6', categoryName: 'Security',
    departmentId: 'dept-6', departmentName: 'Security',
  },
];

const priorityRules = [
  {
    level: 'critical',
    keywords: ['danger', 'emergency', 'injur', 'accident', 'fire', 'structural', 'collapse', 'unsafe', 'electric shock', 'flood', 'gas leak', 'critical'],
  },
  {
    level: 'high',
    keywords: ['urgent', 'immediate', 'broken', 'not working', 'serious', 'major', 'severe', 'safety', 'hazard', 'many students', 'entire', 'whole class', 'disrupting'],
  },
  {
    level: 'medium',
    keywords: ['uncomfortable', 'inconvenient', 'difficult', 'issue', 'problem', 'faulty', 'malfunction', 'needs repair', 'not function'],
  },
];

function scoreText(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => (lower.includes(kw) ? score + 1 : score), 0);
}

function generateSummary(text) {
  // Extract a short meaningful summary from the description
  const sentences = text.split(/[.!?]/);
  const first = sentences[0]?.trim() || text;
  if (first.length <= 80) return first;
  // Try to shorten: take first 8 words
  const words = first.split(' ');
  return words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : '');
}

export function classifyComplaint(description) {
  if (!description || description.trim().length < 5) {
    return null;
  }

  // Score each category rule
  let bestCategory = null;
  let bestScore = 0;
  for (const rule of rules) {
    const score = scoreText(description, rule.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule;
    }
  }

  // Score priority
  let priority = 'low';
  for (const pr of priorityRules) {
    const score = scoreText(description, pr.keywords);
    if (score > 0) {
      priority = pr.level;
      break; // priorityRules ordered highest → lowest
    }
  }

  // Fallback to 'medium' if description is moderate length
  if (priority === 'low' && description.trim().split(' ').length > 15) {
    priority = 'medium';
  }

  const category = bestCategory || {
    categoryId: 'cat-9', categoryName: 'Other',
    departmentId: 'dept-1', departmentName: 'Electrical Maintenance',
  };

  return {
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    departmentId: category.departmentId,
    departmentName: category.departmentName,
    priority,
    summary: generateSummary(description),
    confidence: bestScore > 0 ? Math.min(Math.round((bestScore / 3) * 100), 95) : 40,
  };
}
