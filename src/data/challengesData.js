/**
 * challengesData.js
 * Defines 4 progressive Git challenges with seed states and validator functions.
 */

export const challenges = [
  {
    id: 'lvl-1',
    level: 1,
    tier: 'Tier 1: Linear Basics',
    title: 'Initial Snapshot',
    emoji: '🌱',
    objective: 'Stage the pending changes and create your first commit on branch main.',
    goal: 'Make at least 1 commit on the main branch.',
    allowedCommands: ['git add', 'git commit -m'],
    hint: 'First run `git add .` to stage all changes, then `git commit -m "your message"` to save a snapshot.',
    /** Seed state injected when this level starts */
    seedState: {
      initialized: true,
      commits: [],
      branches: { main: { name: 'main', headCommitId: null } },
      activeBranch: 'main',
      headCommitId: null,
      stagingArea: [],
      workingDirectory: ['README.md', 'index.js'],
    },
    /** Validator runs against redux git state */
    validate: (state) =>
      state.commits.length >= 1 && state.activeBranch === 'main',
  },

  {
    id: 'lvl-2',
    level: 2,
    tier: 'Tier 2: Parallel History',
    title: 'Branch Isolation',
    emoji: '🌿',
    objective: "Create a new branch called 'feature', switch to it, and make a commit on it.",
    goal: "Have branch 'feature' active with at least 1 commit.",
    allowedCommands: ['git branch', 'git checkout', 'git add', 'git commit -m'],
    hint: "Run `git branch feature` to create it, then `git checkout feature` (or `git checkout -b feature`), add a file change and commit.",
    seedState: (() => {
      const hash = 'abc1234';
      return {
        initialized: true,
        commits: [
          { id: hash, hash, message: 'Initial commit', parents: [], branch: 'main', author: 'You', timestamp: Date.now() - 60000 },
        ],
        branches: { main: { name: 'main', headCommitId: hash } },
        activeBranch: 'main',
        headCommitId: hash,
        stagingArea: [],
        workingDirectory: ['app.js'],
      };
    })(),
    validate: (state) =>
      !!state.branches['feature'] &&
      state.activeBranch === 'feature' &&
      state.commits.some(c => c.branch === 'feature'),
  },

  {
    id: 'lvl-3',
    level: 3,
    tier: 'Tier 2: Parallel History',
    title: 'Divergent Timeline',
    emoji: '⚡',
    objective: "Make a commit on 'feature', then switch back to 'main' and make a commit there too — creating a fork in history.",
    goal: "Both 'feature' and 'main' must have commits, with different HEAD pointers.",
    allowedCommands: ['git checkout', 'git add', 'git commit -m'],
    hint: "Make a commit on feature (e.g. git commit -m \"feature work\"), then `git checkout main`, add a file, and commit again.",
    seedState: (() => {
      const h1 = 'def5678';
      const h2 = 'feat001';
      return {
        initialized: true,
        commits: [
          { id: h1, hash: h1, message: 'Initial commit', parents: [], branch: 'main', author: 'You', timestamp: Date.now() - 120000 },
          { id: h2, hash: h2, message: 'Feature start', parents: [h1], branch: 'feature', author: 'You', timestamp: Date.now() - 60000 },
        ],
        branches: {
          main: { name: 'main', headCommitId: h1 },
          feature: { name: 'feature', headCommitId: h2 },
        },
        activeBranch: 'feature',
        headCommitId: h2,
        stagingArea: [],
        workingDirectory: ['feature.js', 'main-update.js'],
      };
    })(),
    validate: (state) =>
      !!state.branches['feature'] &&
      !!state.branches['main'] &&
      state.branches['feature'].headCommitId !== state.branches['main'].headCommitId &&
      state.commits.some(c => c.branch === 'feature') &&
      state.commits.some(c => c.branch === 'main' && state.branches['main'].headCommitId === c.id),
  },

  {
    id: 'lvl-4',
    level: 4,
    tier: 'Tier 3: Merging & Topology',
    title: 'The 3-Way Merge',
    emoji: '🔀',
    objective: "Switch to 'main' and merge the 'feature' branch, producing a merge commit with 2 parents.",
    goal: 'A merge commit with 2 parents must exist on main.',
    allowedCommands: ['git checkout', 'git merge'],
    hint: "Run `git checkout main` then `git merge feature`. Since both branches diverged, Git will create a merge commit.",
    seedState: (() => {
      const h1 = 'ghi9999';
      const hFeat = 'jkl1111';
      const hMain = 'mno2222';
      return {
        initialized: true,
        commits: [
          { id: h1, hash: h1, message: 'Base commit', parents: [], branch: 'main', author: 'You', timestamp: Date.now() - 180000 },
          { id: hFeat, hash: hFeat, message: 'Feature work', parents: [h1], branch: 'feature', author: 'You', timestamp: Date.now() - 90000 },
          { id: hMain, hash: hMain, message: 'Main progress', parents: [h1], branch: 'main', author: 'You', timestamp: Date.now() - 60000 },
        ],
        branches: {
          main: { name: 'main', headCommitId: hMain },
          feature: { name: 'feature', headCommitId: hFeat },
        },
        activeBranch: 'feature',
        headCommitId: hFeat,
        stagingArea: [],
        workingDirectory: [],
      };
    })(),
    validate: (state) =>
      state.activeBranch === 'main' &&
      state.commits.some(c => Array.isArray(c.parents) && c.parents.length === 2),
  },
];

export const getChallengeById = (id) => challenges.find(c => c.id === id);
export const getNextChallengeId = (id) => {
  const idx = challenges.findIndex(c => c.id === id);
  return idx >= 0 && idx < challenges.length - 1 ? challenges[idx + 1].id : null;
};
