/** Content for the About page. Facts only: see siteConfig.registration for registration details. */

export interface CompanyPoint {
  id: 'range' | 'aura' | 'service' | 'planning'
  title: string
  body: string
}

export const companyIntro: string[] = [
  'Corepoint Healthcare is a dental equipment supplier based on Ashram Road, Ahmedabad, with a warehouse at Bareja. Since 2020 we have supplied dental chairs, imaging equipment and clinic essentials to dental practices.',
  'Our own Aura series of dental chairs, from the Aura-200 to the flagship Aura-500, sits alongside scalers, X-ray, sterilisation and clinic equipment, so a practice can equip a surgery from one supplier. That is what we mean by one stop dental solution.',
]

export const companyPoints: CompanyPoint[] = [
  {
    id: 'aura',
    title: 'The Aura series',
    body: 'Four Aura dental chairs under the Corepoint Healthcare name, from the feature-packed Aura-200 to the Aura-500 with trolley or over-arm delivery.',
  },
  {
    id: 'range',
    title: 'A full equipment range',
    body: 'Imaging, clinical instruments, sterilisation and clinic equipment, including X-ray, OPG and CBCT, scanners, scalers, compressors and autoclaves.',
  },
  {
    id: 'planning',
    title: 'Clinic set-up',
    body: 'Site planning for new and growing clinics, and supply of the equipment you need as one package.',
  },
  {
    id: 'service',
    title: 'Repair and service',
    body: 'Repair and servicing of dental chairs and RVG sensors, so equipment keeps working after it is installed.',
  },
]
