import { aiPersonas } from '../models/personas';

describe('aiPersonas', () => {
  it.each(Object.entries(aiPersonas))("persona '%s' instruction list properly configured", (key, value) => {
    expect(value.instructions).toBeTruthy();
    expect(value.name).toBeTruthy();
    expect(value.description).toBeTruthy();
    for (let instruction of value.instructions) {
      expect(instruction.move).toBeTruthy();
      expect(instruction.move.fn).toBeTruthy();
      expect(instruction.move.moveName).toBeTruthy();
    }
  });
});
