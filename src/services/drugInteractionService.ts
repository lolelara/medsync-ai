import { PrescriptionMedication } from '../types'

export interface DrugInteraction {
  id: string
  drugA: string
  drugB: string
  severity: 'moderate' | 'major'
  messageEn: string
  messageAr: string
}

const interactionRules: DrugInteraction[] = [
  {
    id: 'warfarin-aspirin',
    drugA: 'Warfarin',
    drugB: 'Aspirin',
    severity: 'major',
    messageEn:
      'Concurrent use of Warfarin and Aspirin increases bleeding risk. Review indication for dual therapy.',
    messageAr:
      'استخدام وارفارين مع الأسبرين يزيد من خطر النزيف. راجع ضرورة العلاج المزدوج.',
  },
]

export function checkDrugInteractions(medications: PrescriptionMedication[]): DrugInteraction[] {
  const names = medications.map(m => m.name.toLowerCase())
  const results: DrugInteraction[] = []

  for (const rule of interactionRules) {
    if (names.includes(rule.drugA.toLowerCase()) && names.includes(rule.drugB.toLowerCase())) {
      results.push(rule)
    }
  }

  return results
}

export function getInteractingDrugNames(medications: PrescriptionMedication[]): string[] {
  const interactions = checkDrugInteractions(medications)
  const set = new Set<string>()

  for (const interaction of interactions) {
    set.add(interaction.drugA.toLowerCase())
    set.add(interaction.drugB.toLowerCase())
  }

  return Array.from(set)
}
