import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Weight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export function ph(name: string, weight: Weight = 'bold', size = 24): string {
  // Regular weight files have no suffix (e.g. heart.svg, not heart-regular.svg)
  const fileName = weight === 'regular' ? `${name}.svg` : `${name}-${weight}.svg`;
  const filePath = resolve(`node_modules/@phosphor-icons/core/assets/${weight}/${fileName}`);
  // Phosphor SVGs only have viewBox, no width/height — inject them directly
  return readFileSync(filePath, 'utf8')
    .replace('<svg ', `<svg width="${size}" height="${size}" `);
}
