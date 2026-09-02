// Dedicated illustration palette for the body-figure and machine-demo line
// art. Kept independent of the page's --color-* theme tokens (rather than
// reusing them) so the diagrams stay legible and read as "real equipment"
// regardless of whether the surrounding page is light or dark.
export const C = {
  frameLight: '#aab0c4', // steel highlight edge
  frame: '#8b93a8', // steel tubing, mid tone
  frameDark: '#5b6479', // steel tubing, shadow side
  housing: '#363a4d', // dark machine body / weight-stack column
  housingLight: '#464b62',
  pad: '#2f3244', // upholstered seat/back pad
  padLight: '#484d67',
  accent: '#5b4bc7', // brand accent — moving parts, handles, highlights
  accentDeep: '#453797',
  cable: '#9aa0b5', // steel cable
  cableLight: '#d3d6e3',
  plate: '#7a8296', // weight plate, mid tone
  plateLight: '#9aa1b3',
  plateDark: '#5b6479',
  edge: '#4a4f62', // outlines / strokes on frame parts
  muscle: '#5b4bc7', // worked-muscle highlight on the body figure
  bodyLine: '#8b93a8', // stick-figure limb color
  shadow: 'rgba(26,28,39,0.14)',
};
