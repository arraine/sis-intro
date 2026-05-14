export const CATEGORIES = ['SFTP Syncs', 'API Syncs', 'Both'];

export const CARDS = [
  {
    id: 1,
    text: 'The district generates CSV files and pushes them to Clever',
    answer: 'SFTP Syncs',
    explanation: 'SFTP syncs require the district to create and upload five CSV files (schools, teachers, students, sections, enrollments). Clever receives the data rather than fetching it.',
  },
  {
    id: 2,
    text: 'Clever pulls data directly from the district\'s SIS',
    answer: 'API Syncs',
    explanation: 'Both the PowerSchool Plugin and Infinite Campus API syncs work by Clever querying the SIS directly — the district doesn\'t push files.',
  },
  {
    id: 3,
    text: 'A sync can be manually triggered from the Clever Dashboard at any time',
    answer: 'API Syncs',
    explanation: 'Only API syncs support a "Sync Now" button in the Clever Dashboard under Data sources > SIS sync > Settings.',
  },
  {
    id: 4,
    text: 'The sync requires five specific file types that depend on each other in a particular order',
    answer: 'SFTP Syncs',
    explanation: 'SFTP syncs rely on schools.csv, teachers.csv, students.csv, sections.csv, and enrollments.csv — and they cascade, meaning Clever can\'t process students without schools, or enrollments without sections.',
  },
  {
    id: 5,
    text: 'Syncs occur at specific scheduled intervals',
    answer: 'API Syncs',
    explanation: 'The Infinite Campus API sync runs every six hours by default. The PowerSchool Plugin runs every four hours, and SFTP syncs run when files are uploaded.',
  },
  {
    id: 6,
    text: 'The district is responsible for automating their own data exports and uploads',
    answer: 'SFTP Syncs',
    explanation: "Clever doesn't provide support for automation scripting on SFTP syncs. If a district wants automated uploads, they need to set that up on their end.",
  },
  {
    id: 7,
    text: "If the district's data changes significantly, Clever may put the sync on hold to prevent unintended data loss",
    answer: 'Both',
    explanation: "Clever's data hold protection applies to all sync types — if a sync would cause a large unexpected change, Clever pauses it and notifies the district.",
  },
  {
    id: 8,
    text: 'The sync cadence is determined by when the district sends files, not a fixed schedule',
    answer: 'SFTP Syncs',
    explanation: 'SFTP syncs trigger automatically when new files land in the Clever SFTP directory. There\'s no fixed interval — it\'s driven by when the district uploads.',
  },
  {
    id: 9,
    text: 'Changing this sync type requires contacting Clever Support and can take 2–3 weeks',
    answer: 'Both',
    explanation: 'Regardless of sync type, changing to a new sync type requires Clever Support to review the changes and most likely perform a sync conversion as well.',
  },
  {
    id: 10,
    text: 'To preserve user access over the summer, Clever recommends pausing the sync',
    answer: 'Both',
    explanation: 'Each sync behaves differently with their data at the end of the school year, but when terms end and fall schedules start being built, data could be lost from Clever if the sync is not paused.',
  },
  {
    id: 11,
    text: 'The district can supplement their primary sync by uploading additional data via SFTP',
    answer: 'API Syncs',
    explanation: 'Both the PowerSchool Plugin and Infinite Campus API sync allow districts to upload custom or supplemental data via SFTP alongside their API sync — for example, to fill in fields the API can\'t surface.',
  },
  {
    id: 12,
    text: 'A single upload should always contain all records, not just new or changed ones',
    answer: 'SFTP Syncs',
    explanation: 'SFTP files must always be complete — Clever uses the full file to determine what to add, update, or delete. Sending partial files can cause records to be incorrectly removed. Technically this is true for API syncs too, but Clever takes care of that part.',
  },
];

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
