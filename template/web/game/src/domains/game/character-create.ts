export type CharacterInput = {
  type: "click";
  worldX: number;
  worldZ: number;
};

export type GameCharacter = {
  x: number;
  z: number;
  clickCount: number;
  inputMode: "click";
  load_character: () => void;
  input_character: (input: CharacterInput) => void;
};

export function create_game_character(): GameCharacter {
  return {
    x: 0,
    z: 0,
    clickCount: 0,
    inputMode: "click",
    load_character() {
      this.x = 0;
      this.z = 0;
      this.clickCount = 0;
    },
    input_character(input: CharacterInput) {
      if (input.type !== "click") {
        return;
      }
      this.x = input.worldX;
      this.z = input.worldZ;
      this.clickCount += 1;
    }
  };
}
