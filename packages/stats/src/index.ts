export type ChallengeRating =
  | '0'
  | '1/8'
  | '1/4'
  | '1/2'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30';

// The SRD 5.1 "Experience Points by Challenge Rating" table (CC-BY-4.0).
const XP_BY_CHALLENGE_RATING: Record<ChallengeRating, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

export function experiencePoints(challengeRating: ChallengeRating): number {
  return XP_BY_CHALLENGE_RATING[challengeRating];
}

// The Bestiary's invented hype table: each row is the fewest buzzwords a
// talk needs to reach that Challenge Rating.
const HYPE_TABLE: readonly (readonly [
  minimumBuzzwords: number,
  challengeRating: ChallengeRating,
])[] = [
  [30, '30'],
  [20, '20'],
  [15, '15'],
  [12, '11'],
  [10, '8'],
  [8, '5'],
  [7, '4'],
  [6, '3'],
  [5, '2'],
  [4, '1'],
  [3, '1/2'],
  [2, '1/4'],
  [1, '1/8'],
];

export function hypeChallengeRating(buzzwordCount: number): ChallengeRating {
  const row = HYPE_TABLE.find(([minimumBuzzwords]) => buzzwordCount >= minimumBuzzwords);
  return row ? row[1] : '0';
}
