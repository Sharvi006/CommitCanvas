import React, { useState, useEffect } from "react";
import "./Play.css";
import { initialLogs, processGitCommand } from "../../utils/gitLogic";

export default function Play({
  commandToExecute,
  onStateChange
}) {

  // =========================
  // GIT STATES
  // =========================

  const [isInitialized, setIsInitialized] = useState(false);
  const [hasStaged, setHasStaged] = useState(false);
  const [commits, setCommits] = useState([]);
  const [logs, setLogs] = useState(initialLogs);

  // =========================
  // LEARN / COMMAND EXPLANATION
  // =========================

  const [commandInfo, setCommandInfo] = useState({
    command: "",
    title: "Command Insights",
    shortDescription:
      "Run a Git command in the terminal to see how Git changes internally.",
    whatHappens: [],
    visualization: [],
    result: ""
  });

  // =========================
  // COMMAND EXPLANATION DATA
  // =========================

  const getCommandInfo = (cmd) => {

    const command = cmd.toLowerCase().trim();

    // -------------------------
    // GIT INIT
    // -------------------------

    if (command === "git init") {
      return {
        command: cmd,
        title: "git init",
        shortDescription:
          "Initializes a new Git repository inside your current project.",
        whatHappens: [
          "Git creates a hidden .git folder.",
          "The project is now tracked by Git.",
          "No commit is created yet.",
          "Your files are still in the Working Directory."
        ],
        visualization: [
          {
            icon: "📁",
            title: "Working Directory",
            text: "Your project files are here."
          },
          {
            icon: "⚙️",
            title: ".git created",
            text: "Git creates the internal repository structure."
          },
          {
            icon: "🌿",
            title: "Repository Ready",
            text: "Your project is now a Git repository."
          }
        ],
        result:
          "Repository initialized successfully. Next step: git add ."
      };
    }

    // -------------------------
    // GIT ADD
    // -------------------------

    if (
      command === "git add ." ||
      command.startsWith("git add ")
    ) {
      return {
        command: cmd,
        title: "git add",
        shortDescription:
          "Moves your selected changes from the Working Directory into the Staging Area.",
        whatHappens: [
          "Git checks the files you want to include.",
          "Selected changes are placed in the Staging Area.",
          "Nothing is committed yet.",
          "The changes are now ready for git commit."
        ],
        visualization: [
          {
            icon: "📁",
            title: "Working Directory",
            text: "Files contain your latest changes."
          },
          {
            icon: "➡️",
            title: "git add",
            text: "You select which changes should be included."
          },
          {
            icon: "📦",
            title: "Staging Area",
            text: "Changes are now staged and ready to commit."
          }
        ],
        result:
          "Changes are staged. Next step: git commit -m \"your message\""
      };
    }

    // -------------------------
    // GIT COMMIT
    // -------------------------

    if (command.startsWith("git commit")) {
      return {
        command: cmd,
        title: "git commit",
        shortDescription:
          "Creates a permanent snapshot of the staged changes in the Local Repository.",
        whatHappens: [
          "Git takes everything currently in the Staging Area.",
          "Git creates a new commit object.",
          "The commit receives a unique hash.",
          "HEAD moves to the newly created commit."
        ],
        visualization: [
          {
            icon: "📁",
            title: "Working Directory",
            text: "Your project files contain changes."
          },
          {
            icon: "📦",
            title: "Staging Area",
            text: "The selected changes are waiting to be committed."
          },
          {
            icon: "💾",
            title: "Local Repository",
            text: "Git creates a permanent commit snapshot."
          },
          {
            icon: "🔵",
            title: "Commit Node",
            text: "A new node appears in the Git graph."
          }
        ],
        result:
          "A new commit node has been created in the Local Repository."
      };
    }

    // -------------------------
    // GIT PUSH
    // -------------------------

    if (command === "git push" || command.startsWith("git push ")) {
      return {
        command: cmd,
        title: "git push",
        shortDescription:
          "Sends your local commits to the configured remote repository.",
        whatHappens: [
          "Git checks your local commits.",
          "Commits that are not on the remote are selected.",
          "Git transfers those commits to the remote repository.",
          "Your remote branch becomes synchronized."
        ],
        visualization: [
          {
            icon: "💾",
            title: "Local Repository",
            text: "Your commit already exists locally."
          },
          {
            icon: "🚀",
            title: "git push",
            text: "Git sends local commits to the remote."
          },
          {
            icon: "☁️",
            title: "Remote Repository",
            text: "The remote branch now contains your commit."
          }
        ],
        result:
          "Your local commits are pushed to the remote repository."
      };
    }

    // -------------------------
    // GIT CHECKOUT -B
    // -------------------------

    if (
      command.startsWith("git checkout -b") ||
      command.startsWith("git switch -c")
    ) {
      const branchName =
        command.split(" ").slice(3).join(" ") || "feature";

      return {
        command: cmd,
        title: "Create New Branch",
        shortDescription:
          "Creates a new branch and immediately switches HEAD to that branch.",
        whatHappens: [
          `Git creates a new branch called "${branchName}".`,
          "The new branch starts from the current commit.",
          "HEAD moves to the new branch.",
          "Future commits will be created on this branch."
        ],
        visualization: [
          {
            icon: "🌿",
            title: "Current Branch",
            text: "You start from your current branch."
          },
          {
            icon: "🔀",
            title: "New Branch",
            text: `A new "${branchName}" branch is created.`
          },
          {
            icon: "👉",
            title: "HEAD",
            text: "HEAD now points to the new branch."
          }
        ],
        result:
          `Switched to new branch "${branchName}".`
      };
    }

    // -------------------------
    // GIT CHECKOUT
    // -------------------------

    if (command.startsWith("git checkout")) {
      return {
        command: cmd,
        title: "git checkout",
        shortDescription:
          "Switches your working state to another existing branch or commit.",
        whatHappens: [
          "Git identifies the branch or commit you requested.",
          "HEAD moves to that branch or commit.",
          "Your Working Directory is updated.",
          "Future commits will continue from the selected branch."
        ],
        visualization: [
          {
            icon: "🌿",
            title: "Branches",
            text: "Git has multiple possible branches."
          },
          {
            icon: "👉",
            title: "HEAD moves",
            text: "HEAD points to the selected branch."
          },
          {
            icon: "📁",
            title: "Working Directory",
            text: "Your files update to match that branch."
          }
        ],
        result:
          "You switched to another branch or commit."
      };
    }

    // -------------------------
    // GIT STATUS
    // -------------------------

    if (command === "git status") {
      return {
        command: cmd,
        title: "git status",
        shortDescription:
          "Shows the current state of your Working Directory and Staging Area.",
        whatHappens: [
          "Git checks which files have changed.",
          "Git checks which files are staged.",
          "Git checks which files are untracked.",
          "No files are modified by this command."
        ],
        visualization: [
          {
            icon: "📁",
            title: "Working Directory",
            text: "Git checks your current file changes."
          },
          {
            icon: "📦",
            title: "Staging Area",
            text: "Git checks which changes are staged."
          },
          {
            icon: "🔍",
            title: "Status Report",
            text: "Git reports the current repository state."
          }
        ],
        result:
          "Repository status displayed. This command only checks the state."
      };
    }

    // -------------------------
    // GIT LOG
    // -------------------------

    if (command === "git log" || command.startsWith("git log ")) {
      return {
        command: cmd,
        title: "git log",
        shortDescription:
          "Displays the history of commits in your repository.",
        whatHappens: [
          "Git reads the commit history.",
          "Each commit has a unique hash.",
          "You can see commit messages and history.",
          "This command does not create a new commit."
        ],
        visualization: [
          {
            icon: "🔵",
            title: "Commit Nodes",
            text: "Git reads the nodes already present in your graph."
          },
          {
            icon: "📜",
            title: "History",
            text: "Commits are displayed from newest to oldest."
          },
          {
            icon: "🔎",
            title: "Inspection",
            text: "You are viewing history, not changing it."
          }
        ],
        result:
          "Commit history displayed."
      };
    }

    // -------------------------
    // GIT BRANCH
    // -------------------------

    if (command === "git branch" || command.startsWith("git branch ")) {
      return {
        command: cmd,
        title: "git branch",
        shortDescription:
          "Displays or manages branches in your Git repository.",
        whatHappens: [
          "Git checks the branches available in the repository.",
          "The current branch is identified.",
          "A branch is simply a movable pointer to a commit.",
          "Creating a branch does not copy all your files."
        ],
        visualization: [
          {
            icon: "🌿",
            title: "Branch",
            text: "A branch points to a commit."
          },
          {
            icon: "🔵",
            title: "Commit",
            text: "The branch reference points at a commit node."
          },
          {
            icon: "👉",
            title: "HEAD",
            text: "HEAD tells Git which branch you are currently using."
          }
        ],
        result:
          "Branch information displayed."
      };
    }

    // -------------------------
    // GIT MERGE
    // -------------------------

    if (command.startsWith("git merge")) {
      return {
        command: cmd,
        title: "git merge",
        shortDescription:
          "Combines the history of another branch into your current branch.",
        whatHappens: [
          "Git looks at the current branch.",
          "Git compares the histories of both branches.",
          "Git combines the changes.",
          "Depending on the history, Git may create a merge commit."
        ],
        visualization: [
          {
            icon: "🌿",
            title: "Branch A",
            text: "Your current branch continues its history."
          },
          {
            icon: "🌿",
            title: "Branch B",
            text: "Another branch contains separate changes."
          },
          {
            icon: "🔀",
            title: "Merge",
            text: "The two histories are combined."
          },
          {
            icon: "🔵",
            title: "Result",
            text: "The graph can show a merge point."
          }
        ],
        result:
          "The selected branch is being combined with the current branch."
      };
    }

    // -------------------------
    // GIT PULL
    // -------------------------

    if (command === "git pull" || command.startsWith("git pull ")) {
      return {
        command: cmd,
        title: "git pull",
        shortDescription:
          "Downloads changes from the remote repository and integrates them into your current branch.",
        whatHappens: [
          "Git contacts the remote repository.",
          "New remote commits are downloaded.",
          "Git integrates those changes into your current branch.",
          "Your local project becomes more up to date."
        ],
        visualization: [
          {
            icon: "☁️",
            title: "Remote",
            text: "New commits may exist on the remote."
          },
          {
            icon: "⬇️",
            title: "git pull",
            text: "Git brings remote changes to your machine."
          },
          {
            icon: "💾",
            title: "Local Repository",
            text: "Your local history receives the new changes."
          },
          {
            icon: "📁",
            title: "Working Directory",
            text: "Your files are updated."
          }
        ],
        result:
          "Remote changes have been brought into your local repository."
      };
    }

    // -------------------------
    // GIT CLONE
    // -------------------------

    if (command.startsWith("git clone")) {
      return {
        command: cmd,
        title: "git clone",
        shortDescription:
          "Creates a local copy of an existing remote Git repository.",
        whatHappens: [
          "Git connects to the remote repository.",
          "The repository history is downloaded.",
          "A local Git repository is created.",
          "The project files are checked out."
        ],
        visualization: [
          {
            icon: "☁️",
            title: "Remote Repository",
            text: "The original repository exists remotely."
          },
          {
            icon: "⬇️",
            title: "Clone",
            text: "Git downloads the repository."
          },
          {
            icon: "💾",
            title: "Local Repository",
            text: "A complete local Git history is created."
          },
          {
            icon: "📁",
            title: "Working Directory",
            text: "The project files are available locally."
          }
        ],
        result:
          "Remote repository copied to your local machine."
      };
    }

    // -------------------------
    // GIT REMOTE
    // -------------------------

    if (command.startsWith("git remote")) {
      return {
        command: cmd,
        title: "git remote",
        shortDescription:
          "Manages the connection between your local repository and a remote repository.",
        whatHappens: [
          "Git checks the configured remote repositories.",
          "A remote usually has a name such as origin.",
          "The remote stores the URL of another Git repository.",
          "Commands like git push and git pull use this connection."
        ],
        visualization: [
          {
            icon: "💾",
            title: "Local Repository",
            text: "Your commits exist locally."
          },
          {
            icon: "🔗",
            title: "Remote Connection",
            text: "Git stores a connection to the remote."
          },
          {
            icon: "☁️",
            title: "Remote",
            text: "The remote repository can receive or send commits."
          }
        ],
        result:
          "Remote repository connection information displayed."
      };
    }

    // -------------------------
    // UNKNOWN COMMAND
    // -------------------------

    return {
      command: cmd,
      title: "Git Command",
      shortDescription:
        "This command was executed, but a detailed visual explanation is not configured yet.",
      whatHappens: [
        "Git receives the command.",
        "Git checks the current repository state.",
        "Git performs the requested operation.",
        "The repository state may change depending on the command."
      ],
      visualization: [
        {
          icon: "⌨️",
          title: "Command",
          text: "Your command was entered into the terminal."
        },
        {
          icon: "⚙️",
          title: "Git",
          text: "Git processes the command."
        },
        {
          icon: "📊",
          title: "Repository State",
          text: "The visualizer reflects any supported state changes."
        }
      ],
      result:
        "Command executed. More detailed visualization can be added for this command."
    };
  };

  // =========================
  // SEND STATE TO APP
  // =========================

  useEffect(() => {

    if (onStateChange) {

      onStateChange({
        isInitialized,
        hasStaged,
        commits,
        logs,
        commandInfo
      });

    }

  }, [
    isInitialized,
    hasStaged,
    commits,
    logs,
    commandInfo,
    onStateChange
  ]);

  // =========================
  // COMMAND HANDLER
  // =========================

  const handleCommand = (cmd) => {

    // First create explanation for Learn tab
    const explanation = getCommandInfo(cmd);

    setCommandInfo(explanation);

    // Then execute the actual Git simulation
    processGitCommand(
      cmd,
      {
        isInitialized,
        hasStaged,
        commits,
        logs
      },
      {
        setIsInitialized,
        setHasStaged,
        setCommits,
        setLogs
      }
    );
  };

  // =========================
  // RECEIVE COMMAND FROM APP
  // =========================

  useEffect(() => {

    if (commandToExecute) {
      handleCommand(commandToExecute);
    }

  }, [commandToExecute]);

  // =========================
  // UI
  // =========================

  return (

    <div className="play-container">

      {/* =========================================
          1. GIT COMMIT VISUALIZER
      ========================================= */}

      <div className="playground-full">

        <div className="playground-title">

          <h2>
            Git Commit Nodes Visualizer
          </h2>

        </div>

        <div className="tree-container">

          {/* BEFORE git init */}

          {!isInitialized ? (

            <div className="message">

              Type{" "}

              <b className="highlight-cmd">
                git init
              </b>

              {" "}in the input bar to initialize
              repository visualizer

            </div>

          ) : commits.length === 0 ? (

            /* AFTER git init */

            <div className="message">

              Run{" "}

              <b className="highlight-cmd">
                git add .
              </b>

              {" "}then{" "}

              <b className="highlight-cmd">
                git commit -m "msg"
              </b>

              {" "}to spawn nodes!

            </div>

          ) : (

            /* COMMIT NODES */

            <div className="dots-row">

              {commits.map((commit, index) => (

                <div
                  key={commit.id}
                  className="dot-wrapper"
                >

                  {/* NODE */}

                  <div
                    className={`neon-dot ${
                      commit.pushed
                        ? "pushed"
                        : ""
                    }`}
                  >

                    <div className="inner-light"></div>

                  </div>

                  {/* COMMIT INFO */}

                  <div className="dot-text">

                    <span className="hash">
                      #{commit.id}
                    </span>

                    <span
                      className="msg"
                      title={commit.msg}
                    >
                      {commit.msg}
                    </span>

                  </div>

                  {/* CONNECTION LINE */}

                  {index < commits.length - 1 && (

                    <div
                      className={`glow-line ${
                        commit.pushed
                          ? "pushed"
                          : ""
                      }`}
                    ></div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* =========================================
          2. TERMINAL OUTPUT
      ========================================= */}

      <div className="bottom-layout">

        <div className="terminal-card">

          {/* TERMINAL HEADER */}

          <div className="terminal-header">

            <div className="window-buttons">

              <span className="btn red"></span>

              <span className="btn yellow"></span>

              <span className="btn green"></span>

            </div>

            <span className="title">
              bash — git output terminal
            </span>

          </div>

          {/* TERMINAL LOGS */}

          <div className="terminal-logs">

            {logs.map((log, index) => (

              <div
                key={index}
                className="log-line"
              >

                {log.startsWith("$") ? (

                  <span className="cmd-prompt">
                    {log}
                  </span>

                ) : (

                  log

                )}

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );
}