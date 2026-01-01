export const applySoftCap = (bonus: number, softCap = 0.3, excessFactor = 0.5): number => {
  if (bonus <= softCap) return bonus
  return softCap + (bonus - softCap) * excessFactor
}

export const skillCurve = (skill: number, k = 50): number => {
  return 1 - Math.exp(-skill / k)
}

export const applySkillCurve = (gearBonus: number, skill: number, minScale = 0.4): number => {
  return gearBonus * (minScale + (1 - minScale) * skillCurve(skill))
}
