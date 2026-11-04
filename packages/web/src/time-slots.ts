import type { Creature } from './feed';

export interface TimeSlotGroup {
  timeSlot: string;
  creatures: Creature[];
}

/** The day's time slots in time order, each holding its talks in feed order. */
export function timeSlots(creatures: readonly Creature[]): TimeSlotGroup[] {
  const bySlot = new Map<string, Creature[]>();
  for (const creature of creatures) {
    bySlot.set(creature.timeSlot, [...(bySlot.get(creature.timeSlot) ?? []), creature]);
  }
  return [...bySlot]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([timeSlot, slotCreatures]) => ({ timeSlot, creatures: slotCreatures }));
}
