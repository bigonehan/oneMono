export type CharacterPosition = {
  x: number;
  z: number;
};

export type CharacterMoveInput = {
  worldX: number;
  worldZ: number;
};

export function apply_character_movement(
  position: CharacterPosition,
  input: CharacterMoveInput
): CharacterPosition {
  return {
    x: input.worldX,
    z: input.worldZ
  };
}
