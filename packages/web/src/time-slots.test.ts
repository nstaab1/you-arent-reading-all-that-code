import { describe, expect, it } from 'vitest';
import { testCreature } from './test-creature';
import { timeSlots } from './time-slots';

describe('timeSlots', () => {
  it("orders the day's time slots by start time, each holding its talks in feed order", () => {
    const vibeCoder = testCreature('vibe-coder', '11:00');
    const oracle = testCreature('oracle', '09:00');
    const promptGoblin = testCreature('prompt-goblin', '11:00');
    const latecomer = testCreature('latecomer', '14:30');

    expect(timeSlots([vibeCoder, latecomer, oracle, promptGoblin])).toEqual([
      { timeSlot: '09:00', creatures: [oracle] },
      { timeSlot: '11:00', creatures: [vibeCoder, promptGoblin] },
      { timeSlot: '14:30', creatures: [latecomer] },
    ]);
  });
});
