/**
 * M3 interaction-state opacities.
 * Spec: https://m3.material.io/foundations/interaction/states/overview
 */
export const stateLayerOpacity = {
  hover: 0.08,
  focus: 0.1,
  press: 0.1,
  drag: 0.16,
} as const;

export const disabledOpacity = {
  container: 0.1,
  content: 0.38,
  outline: 0.1,
} as const;
