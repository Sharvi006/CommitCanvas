// gitLogic.js - Core Git Simulation Logic

export const initialLogs = [
  'Welcome! Try git init, git add ., git commit -m "msg", git branch, git checkout, git status, or git push.'
];

// This is a front-end Git teaching simulation; it does not execute the system Git binary.
export const processGitCommand = (cmdText, state, setState) => {
  const cmd = cmdText.trim();
  if (!cmd) return;

  const {
    isInitialized, hasStaged, commits, logs,
    branches = { main: null }, activeBranch = 'main'
  } = state;
  const {
    setIsInitialized, setHasStaged, setCommits, setLogs,
    setBranches = () => {}, setActiveBranch = () => {}
  } = setState;
  const newLogs = [...logs, `$ ${cmd}`];
  const tokens = cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const subcommand = tokens[1];
  const args = tokens.slice(2);

  const failIfUninitialized = () => {
    if (isInitialized) return false;
    newLogs.push('fatal: not a git repository (or any of the parent directories): .git');
    return true;
  };

  if (tokens[0] !== 'git') {
    newLogs.push(`Command not recognized: '${cmd}'`);
  } else if (subcommand === 'init') {
    setIsInitialized(true);
    setBranches({ main: commits.at(-1)?.id ?? null });
    setActiveBranch('main');
    newLogs.push('Initialized empty Git repository in .git/');
  } else if (subcommand === 'add') {
    if (!failIfUninitialized()) {
      setHasStaged(true);
      newLogs.push(args[0] === '.' || !args[0] ? 'Changes staged for commit.' : `Changes staged for ${args[0]}.`);
    }
  } else if (subcommand === 'commit') {
    if (!failIfUninitialized()) {
      if (!hasStaged) {
        newLogs.push("Nothing to commit, working tree clean. Run 'git add .' first.");
      } else {
        const mIndex = args.indexOf('-m');
        const message = (mIndex >= 0 ? args[mIndex + 1] : '')?.replace(/^['"]|['"]$/g, '') || 'New Commit';
        const previous = commits.find(commit => commit.id === branches[activeBranch]);
        const commit = {
          id: Math.random().toString(36).substring(2, 9),
          msg: message,
          branch: activeBranch,
          parents: previous ? [previous.id] : [],
          pushed: false
        };
        setCommits([...commits, commit]);
        setBranches({ ...branches, [activeBranch]: commit.id });
        setHasStaged(false);
        newLogs.push(`[${activeBranch} ${commit.id}] ${message}`);
      }
    }
  } else if (subcommand === 'branch') {
    if (!failIfUninitialized()) {
      const name = args[0];
      if (!name) {
        Object.entries(branches).forEach(([branch]) => newLogs.push(`${branch === activeBranch ? '* ' : '  '}${branch}`));
      } else if (branches[name] !== undefined) {
        newLogs.push(`fatal: a branch named '${name}' already exists.`);
      } else {
        setBranches({ ...branches, [name]: branches[activeBranch] ?? null });
        newLogs.push(`Branch '${name}' created.`);
      }
    }
  } else if (subcommand === 'checkout' || subcommand === 'switch') {
    if (!failIfUninitialized()) {
      const create = args[0] === '-b' || (subcommand === 'switch' && args[0] === '-c');
      const name = args[create ? 1 : 0];
      if (!name) {
        newLogs.push('fatal: branch name required.');
      } else if (create && branches[name] !== undefined) {
        newLogs.push(`fatal: a branch named '${name}' already exists.`);
      } else if (!create && branches[name] === undefined) {
        newLogs.push(`error: pathspec '${name}' did not match any branch.`);
      } else {
        if (create) setBranches({ ...branches, [name]: branches[activeBranch] ?? null });
        setActiveBranch(name);
        newLogs.push(create ? `Switched to a new branch '${name}'` : `Switched to branch '${name}'`);
      }
    }
  } else if (subcommand === 'status') {
    if (!failIfUninitialized()) {
      newLogs.push(`On branch ${activeBranch}`);
      newLogs.push(hasStaged ? 'Changes to be committed: modified: sample_file.txt' : 'nothing to commit, working tree clean');
    }
  } else if (subcommand === 'log') {
    if (!failIfUninitialized()) {
      const branchHead = branches[activeBranch];
      const branchCommits = [];
      let cursor = commits.find(commit => commit.id === branchHead);
      while (cursor && branchCommits.length < commits.length) {
        branchCommits.push(cursor);
        cursor = commits.find(commit => commit.id === cursor.parents?.[0]);
      }
      if (!branchCommits.length) newLogs.push(`fatal: your current branch '${activeBranch}' does not have any commits yet`);
      else branchCommits.forEach(commit => newLogs.push(`commit ${commit.id}\nBranch: ${activeBranch}\n    ${commit.msg}`));
    }
  } else if (subcommand === 'push') {
    if (!failIfUninitialized()) {
      if (!commits.length) newLogs.push('Everything up-to-date');
      else {
        setCommits(commits.map(commit => ({ ...commit, pushed: true })));
        newLogs.push(`Successfully pushed local commits to origin/${activeBranch}!`);
      }
    }
  } else if (subcommand === 'merge') {
    if (!failIfUninitialized()) {
      const target = args[0];
      if (!target || branches[target] === undefined) newLogs.push(`merge: ${target || '(no branch)'} - not something we can merge`);
      else if (target === activeBranch) newLogs.push('Already up to date.');
      else {
        const merge = {
          id: Math.random().toString(36).substring(2, 9),
          msg: `Merge branch '${target}' into ${activeBranch}`,
          branch: activeBranch,
          parents: [branches[activeBranch], branches[target]].filter(Boolean),
          pushed: false
        };
        setCommits([...commits, merge]);
        setBranches({ ...branches, [activeBranch]: merge.id });
        newLogs.push('Merge made by the simulated strategy.');
        newLogs.push(`[${activeBranch} ${merge.id}] ${merge.msg}`);
      }
    }
  } else if (subcommand === 'pull') {
    if (!failIfUninitialized()) newLogs.push('Already up to date. (simulated)');
  } else if (subcommand === 'clone') {
    setIsInitialized(true);
    newLogs.push('Cloning is not connected to a remote in this simulation.');
  } else if (subcommand === 'remote') {
    if (!failIfUninitialized()) newLogs.push('No remote configured in this simulation.');
  } else {
    newLogs.push(`Command not recognized: '${cmd}'`);
  }

  setLogs(newLogs);
};
