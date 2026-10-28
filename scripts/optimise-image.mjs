// Converts a photo into web-ready WebP files at one or more widths.
//
// Usage:
//   node scripts/optimise-image.mjs <input> <output-base> [--widths 1600,800] [--crop left,top,width,height]
//
// Example:
//   node scripts/optimise-image.mjs ~/Downloads/clinic.jpg public/images/installations/clinic-1 --widths 1600,800
// writes public/images/installations/clinic-1-1600.webp and clinic-1-800.webp and prints their sizes.
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import sharp from 'sharp'

const [input, outputBase, ...flags] = process.argv.slice(2)
if (!input || !outputBase) {
  console.error('Usage: node scripts/optimise-image.mjs <input> <output-base> [--widths 1600,800] [--crop l,t,w,h]')
  process.exit(1)
}

const flag = (name) => {
  const index = flags.indexOf(name)
  return index >= 0 ? flags[index + 1] : undefined
}
const widths = (flag('--widths') ?? '1600,800').split(',').map(Number)
const crop = flag('--crop')?.split(',').map(Number)

await mkdir(dirname(outputBase), { recursive: true })
const source = sharp(input).rotate()
const meta = await source.metadata()
const base = crop ? source.extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] }) : source
const baseBuffer = await base.toBuffer()
const baseWidth = crop ? crop[2] : meta.width

for (const width of widths) {
  const target = Math.min(width, baseWidth)
  const file = `${outputBase}-${width}.webp`
  const info = await sharp(baseBuffer).resize({ width: target }).webp({ quality: 82 }).toFile(file)
  console.log(`${file}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
