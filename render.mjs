// Rebuilds README.md from stevenpisani.com/profile.json, so the site is the one place this
// profile is written (its _config.yml and _data/profile.yml). Run: node render.mjs
import { writeFileSync } from 'node:fs';

const res = await fetch(process.env.PROFILE_URL || 'https://stevenpisani.com/profile.json');
if (!res.ok) throw new Error(`profile.json: HTTP ${res.status}`);
const p = await res.json();

// shields.io badge: a dash in the label is doubled, a space becomes an underscore
const badge = ([name, color, logo]) =>
  `![${name}](https://img.shields.io/badge/${encodeURIComponent(name.replace(/-/g, '--').replace(/ /g, '_'))}-${color}?style=flat${logo ? `&logo=${logo}&logoColor=white` : ''})`;
const link = (tool, url) => `[${badge(tool)}](${url})`;
const [title, ...rest] = p.headline.split(' building ');

const readme = `# Hey, I'm ${p.name.split(' ')[0]} 👋

**${title}**${rest.length ? ` building ${rest.join(' building ')}` : ''}

${p.business}

---

### 🔧 What I Do

${p.what}

**Recent focus:**
${p.focus.map((f) => `- ${f}`).join('\n')}

---

### 🛠️ Tech Stack

${p.stack.map((s) => `**${s.group}**\n\n${s.tools.map(badge).join('\n')}`).join('\n\n')}

---

### ✍️ Latest writing

${p.posts.map((x) => `- [${x.title}](${x.url}) <sub>${x.date}</sub>`).join('\n')}

### 🧪 From the lab

${p.lab.map((x) => `- ${x.emoji} [${x.title}](${x.url})`).join('\n')}

---

### 📫 Let's Connect

${link(['LinkedIn', '0A66C2', 'linkedin'], p.links.linkedin)}
${link(['Twitter', '1DA1F2', 'twitter'], p.links.twitter)}
${link(['Website', '000000', 'About.me'], p.links.website)}

---

<sub>${p.signoff}</sub>

<!-- Generated from ${p.url}/profile.json by render.mjs. Edit the site, not this file. -->
`;
writeFileSync(new URL('README.md', import.meta.url), readme);
console.log('README.md rebuilt');
