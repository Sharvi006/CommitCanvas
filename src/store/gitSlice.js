import { createSlice } from '@reduxjs/toolkit';

const generateHash = () =>
  Math.random().toString(36).substring(2, 9).padStart(7, '0');

const initialState = {
  commits: [],
  branches: {
    main: { name: 'main', headCommitId: null },
  },
  activeBranch: 'main',
  headCommitId: null,
  stagingArea: [],
  workingDirectory: ['README.md'],
  terminalLogs: [],
  initialized: false,
};

const gitSlice = createSlice({
  name: 'git',
  initialState,
  reducers: {
    loadLevelState(state, action) {
      const seed = action.payload;
      state.commits = seed.commits ?? [];
      state.branches = seed.branches ?? { main: { name: 'main', headCommitId: null } };
      state.activeBranch = seed.activeBranch ?? 'main';
      state.headCommitId = seed.headCommitId ?? null;
      state.stagingArea = seed.stagingArea ?? [];
      state.workingDirectory = seed.workingDirectory ?? ['README.md'];
      state.terminalLogs = [];
      state.initialized = seed.initialized ?? false;
    },

    gitInit(state) {
      if (state.initialized) {
        state.terminalLogs.push({ type: 'output', text: 'Reinitialized existing Git repository in .git/' });
        return;
      }
      state.initialized = true;
      state.branches = { main: { name: 'main', headCommitId: null } };
      state.activeBranch = 'main';
      state.headCommitId = null;
      state.commits = [];
      state.stagingArea = [];
      state.terminalLogs.push({ type: 'output', text: 'Initialized empty Git repository in .git/' });
    },

    gitAdd(state, action) {
      const target = action.payload;
      if (target === '.' || target === '-A') {
        const toStage = state.workingDirectory.filter(f => !state.stagingArea.includes(f));
        state.stagingArea.push(...toStage);
        state.workingDirectory = [];
        state.terminalLogs.push({ type: 'output', text: `Staged all changes (${toStage.length} file${toStage.length !== 1 ? 's' : ''})` });
      } else {
        if (state.workingDirectory.includes(target)) {
          state.workingDirectory = state.workingDirectory.filter(f => f !== target);
          if (!state.stagingArea.includes(target)) {
            state.stagingArea.push(target);
          }
          state.terminalLogs.push({ type: 'output', text: `Staged: ${target}` });
        } else if (state.stagingArea.includes(target)) {
          state.terminalLogs.push({ type: 'output', text: `'${target}' already staged.` });
        } else {
          state.terminalLogs.push({ type: 'error', text: `pathspec '${target}' did not match any files` });
        }
      }
    },

    gitCommit(state, action) {
      const message = action.payload;
      if (!state.initialized) {
        state.terminalLogs.push({ type: 'error', text: 'Not a git repository. Run git init first.' });
        return;
      }
      if (state.stagingArea.length === 0) {
        state.terminalLogs.push({ type: 'error', text: 'nothing to commit, working tree clean' });
        return;
      }
      if (!message || !message.trim()) {
        state.terminalLogs.push({ type: 'error', text: "error: switch 'm' requires a value" });
        return;
      }

      const hash = generateHash();
      const parentIds = state.headCommitId ? [state.headCommitId] : [];
      const newCommit = {
        id: hash,
        hash,
        message: message.trim(),
        parents: parentIds,
        branch: state.activeBranch,
        author: 'You',
        timestamp: Date.now(),
      };

      state.commits.push(newCommit);
      state.branches[state.activeBranch].headCommitId = hash;
      state.headCommitId = hash;
      state.stagingArea = [];
      state.terminalLogs.push({ type: 'output', text: `[${state.activeBranch} ${hash}] ${message.trim()}` });
      state.terminalLogs.push({ type: 'output', text: `1 file changed (simulated)` });
    },

    gitBranch(state, action) {
      const branchName = action.payload;
      if (!branchName) {
        const branchList = Object.keys(state.branches)
          .map(b => (b === state.activeBranch ? `* ${b}` : `  ${b}`))
          .join('\n');
        state.terminalLogs.push({ type: 'output', text: branchList });
        return;
      }
      if (state.branches[branchName]) {
        state.terminalLogs.push({ type: 'error', text: `A branch named '${branchName}' already exists.` });
        return;
      }
      state.branches[branchName] = { name: branchName, headCommitId: state.headCommitId };
      state.terminalLogs.push({ type: 'output', text: `Branch '${branchName}' created at ${state.headCommitId || 'HEAD'}` });
    },

    gitCheckout(state, action) {
      const payload = action.payload;
      const createNew = payload.startsWith('-b ');
      const target = createNew ? payload.slice(3).trim() : payload.trim();

      if (createNew) {
        if (state.branches[target]) {
          state.terminalLogs.push({ type: 'error', text: `A branch named '${target}' already exists.` });
          return;
        }
        state.branches[target] = { name: target, headCommitId: state.headCommitId };
        state.activeBranch = target;
        state.terminalLogs.push({ type: 'output', text: `Switched to a new branch '${target}'` });
        return;
      }

      if (state.branches[target]) {
        state.activeBranch = target;
        state.headCommitId = state.branches[target].headCommitId;
        state.terminalLogs.push({ type: 'output', text: `Switched to branch '${target}'` });
        return;
      }

      const commitMatch = state.commits.find(c => c.hash === target || c.id === target);
      if (commitMatch) {
        state.headCommitId = commitMatch.id;
        state.activeBranch = '(HEAD detached)';
        state.terminalLogs.push({ type: 'output', text: `HEAD is now at ${target}` });
        return;
      }

      state.terminalLogs.push({ type: 'error', text: `error: pathspec '${target}' did not match any file(s) known to git` });
    },

    gitMerge(state, action) {
      const targetBranch = action.payload;
      if (!state.branches[targetBranch]) {
        state.terminalLogs.push({ type: 'error', text: `merge: ${targetBranch} - not something we can merge` });
        return;
      }
      if (targetBranch === state.activeBranch) {
        state.terminalLogs.push({ type: 'output', text: 'Already up to date.' });
        return;
      }

      const targetHeadId = state.branches[targetBranch].headCommitId;
      if (!targetHeadId) {
        state.terminalLogs.push({ type: 'output', text: 'Already up to date.' });
        return;
      }

      const getAncestors = (commitId, commits) => {
        const ancestors = new Set();
        const queue = [commitId];
        while (queue.length) {
          const id = queue.shift();
          if (!id || ancestors.has(id)) continue;
          ancestors.add(id);
          const commit = commits.find(c => c.id === id);
          if (commit) commit.parents.forEach(p => queue.push(p));
        }
        return ancestors;
      };

      const targetAncestors = getAncestors(targetHeadId, state.commits);
      const isFastForward = !state.headCommitId || targetAncestors.has(state.headCommitId);

      if (isFastForward) {
        state.headCommitId = targetHeadId;
        state.branches[state.activeBranch].headCommitId = targetHeadId;
        state.terminalLogs.push({ type: 'output', text: `Fast-forward\n Updating to ${targetHeadId}` });
      } else {
        const mergeHash = generateHash();
        const mergeCommit = {
          id: mergeHash,
          hash: mergeHash,
          message: `Merge branch '${targetBranch}' into ${state.activeBranch}`,
          parents: [state.headCommitId, targetHeadId],
          branch: state.activeBranch,
          author: 'You',
          timestamp: Date.now(),
        };
        state.commits.push(mergeCommit);
        state.headCommitId = mergeHash;
        state.branches[state.activeBranch].headCommitId = mergeHash;
        state.terminalLogs.push({ type: 'output', text: `Merge made by the 'ort' strategy.\nMerge commit ${mergeHash}` });
      }
    },

    gitStatus(state) {
      const lines = [];
      lines.push(`On branch ${state.activeBranch}`);
      if (state.stagingArea.length > 0) {
        lines.push('\nChanges to be committed:');
        state.stagingArea.forEach(f => lines.push(`  new file:   ${f}`));
      }
      if (state.workingDirectory.length > 0) {
        lines.push('\nChanges not staged for commit:');
        state.workingDirectory.forEach(f => lines.push(`  modified:   ${f}`));
      }
      if (state.stagingArea.length === 0 && state.workingDirectory.length === 0) {
        lines.push('nothing to commit, working tree clean');
      }
      state.terminalLogs.push({ type: 'output', text: lines.join('\n') });
    },

    gitLog(state) {
      if (state.commits.length === 0) {
        state.terminalLogs.push({ type: 'output', text: 'fatal: your current branch has no commits yet' });
        return;
      }
      const lines = state.commits
        .slice()
        .reverse()
        .slice(0, 8)
        .map(c => `commit ${c.hash}\nAuthor: ${c.author}\n\n    ${c.message}`)
        .join('\n\n');
      state.terminalLogs.push({ type: 'output', text: lines });
    },

    gitReset(state, action) {
      const flag = action.payload?.flag ?? '--mixed';
      const target = action.payload?.target ?? 'HEAD~1';

      if (state.commits.length === 0) {
        state.terminalLogs.push({ type: 'error', text: 'fatal: Failed to resolve HEAD as a valid ref.' });
        return;
      }

      let targetCommitId = null;
      if (target === 'HEAD~1') {
        const currentCommit = state.commits.find(c => c.id === state.headCommitId);
        if (currentCommit && currentCommit.parents.length > 0) {
          targetCommitId = currentCommit.parents[0];
        }
      } else if (target === 'HEAD') {
        targetCommitId = state.headCommitId;
      } else {
        const match = state.commits.find(c => c.hash === target || c.id === target);
        if (match) targetCommitId = match.id;
      }

      const removedCommits = [];
      if (targetCommitId !== state.headCommitId) {
        const keepSet = new Set();
        let cur = targetCommitId;
        const visited = new Set();
        while (cur && !visited.has(cur)) {
          visited.add(cur);
          keepSet.add(cur);
          const c = state.commits.find(cc => cc.id === cur);
          if (c) cur = c.parents[0] ?? null;
          else break;
        }
        state.commits.forEach(c => { if (!keepSet.has(c.id)) removedCommits.push(c); });
        state.commits = state.commits.filter(c => keepSet.has(c.id));
      }

      state.headCommitId = targetCommitId;
      if (state.branches[state.activeBranch]) {
        state.branches[state.activeBranch].headCommitId = targetCommitId;
      }

      if (flag === '--soft') {
        state.terminalLogs.push({ type: 'output', text: `HEAD is now at ${targetCommitId ?? 'initial'} (soft reset)` });
      } else if (flag === '--hard') {
        state.stagingArea = [];
        state.workingDirectory = [];
        state.terminalLogs.push({ type: 'output', text: `HEAD is now at ${targetCommitId ?? 'initial'}` });
      } else {
        state.terminalLogs.push({ type: 'output', text: `Unstaged changes after reset` });
      }
    },

    addTerminalLog(state, action) {
      state.terminalLogs.push(action.payload);
    },

    clearTerminalLogs(state) {
      state.terminalLogs = [];
    },

    resetRepo(state) {
      return {
        ...initialState,
        branches: { main: { name: 'main', headCommitId: null } },
      };
    },

    addWorkingFile(state, action) {
      const file = action.payload;
      if (!state.workingDirectory.includes(file)) {
        state.workingDirectory.push(file);
      }
      state.terminalLogs.push({ type: 'output', text: `Created file: ${file}` });
    },
  },
});

export const {
  loadLevelState,
  gitInit,
  gitAdd,
  gitCommit,
  gitBranch,
  gitCheckout,
  gitMerge,
  gitStatus,
  gitLog,
  gitReset,
  addTerminalLog,
  clearTerminalLogs,
  resetRepo,
  addWorkingFile,
} = gitSlice.actions;

export default gitSlice.reducer;
