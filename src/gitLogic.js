// gitLogic.js

export const initialLogs = [
  "Welcome! Type commands in the CLI input bar: git init, git add ., git commit -m \"msg\", git push"
];

export const processGitCommand = (cmdText, state, setState) => {
  const cmd = cmdText.trim();
  if (!cmd) return;

  const { isInitialized, hasStaged, commits, logs } = state;
  const { setIsInitialized, setHasStaged, setCommits, setLogs } = setState;

  let newLogs = [...logs, `$ ${cmd}`];

  if (cmd === "git init") {
    setIsInitialized(true);
    newLogs.push("Initialized empty Git repository in .git/");
  } 
  else if (cmd === "git add .") {
    if (!isInitialized) {
      newLogs.push("fatal: not a git repository (or any of the parent directories): .git");
    } else {
      setHasStaged(true);
      newLogs.push("Changes staged for commit.");
    }
  } 
  else if (cmd.startsWith("git commit")) {
    if (!isInitialized) {
      newLogs.push("fatal: not a git repository");
    } else if (!hasStaged) {
      newLogs.push("Nothing to commit, working tree clean. Run 'git add .' first.");
    } else {
      const msgMatch = cmd.split("-m")[1];
      const msg = msgMatch ? msgMatch.replace(/["']/g, "").trim() : "New Commit";
      const newCommit = {
        id: Math.random().toString(36).substring(2, 7),
        msg: msg || "Commit node",
        pushed: false
      };
      setCommits([...commits, newCommit]);
      setHasStaged(false);
      newLogs.push(`[main ${newCommit.id}] ${msg}`);
    }
  } 
  else if (cmd === "git push") {
    if (!isInitialized) {
      newLogs.push("fatal: not a git repository");
    } else if (commits.length === 0) {
      newLogs.push("Everything up-to-date");
    } else {
      setCommits(commits.map((c) => ({ ...c, pushed: true })));
      newLogs.push("Successfully pushed local commits to origin/main!");
    }
  } 
  else {
    newLogs.push(`Command not recognized: '${cmd}'`);
  }

  setLogs(newLogs);
};