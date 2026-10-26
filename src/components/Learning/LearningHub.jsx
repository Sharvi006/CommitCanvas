import { useState } from "react";
import {
  GitBranch,
  Sprout,
  History,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Search,
  X,
  BookOpen,
  Terminal,
  LockKeyhole,
  Award,
  RotateCcw,
} from "./LearningIcons";

import "./LearningHub.css";
import "./LearningHubQuiz.css";
import "./LearningHubQuizStep.css";

const lessons = [
  {
    id: 1, tier: 1, title: "Repository Genesis",
    command: "git init", short: "Create your Git repository.",
    why: "Initializes Git in your project folder. Git creates a hidden .git directory to store repository information and history.",
    syntax: "git init", example: "git init",
    steps: [
      "Open your project folder in the terminal.",
      "Run git init.",
      "Run git status to inspect the repository.",
    ],
    tip: "Run this inside the folder you want Git to track.",
  },
  {
    id: 2, tier: 1, title: "Check Repository Status",
    command: "git status", short: "Check which files have changed.",
    why: "Displays the current branch and shows untracked, modified and staged files.",
    syntax: "git status", example: "git status",
    steps: [
      "Create or edit a file.",
      "Run git status.",
      "Check which files Git reports.",
    ],
    tip: "Use git status frequently. It does not modify your files.",
  },
  {
    id: 3, tier: 1, title: "Stage Your Changes",
    command: "git add", short: "Prepare files for a commit.",
    why: "Adds selected file changes to the staging area. Staged changes can be included in your next commit.",
    syntax: "git add <filename>",
    example: "git add README.md\ngit add .",
    steps: [
      "Make changes to a file.",
      "Run git add README.md to stage one file.",
      "Run git status to verify the staging area.",
    ],
    tip: "git add . stages changes under the current directory.",
  },
  {
    id: 4, tier: 1, title: "Save a Snapshot",
    command: "git commit", short: "Save staged changes in history.",
    why: "Creates a commit containing the staged changes. The commit message explains what you changed.",
    syntax: 'git commit -m "message"',
    example: 'git add .\ngit commit -m "Add homepage"',
    steps: [
      "Stage your changes.",
      "Run git commit with a message.",
      "Use git log to view the commit.",
    ],
    tip: "A commit saves changes locally. It does not upload them to GitHub.",
  },
  {
    id: 5, tier: 2, title: "Explore Commit History",
    command: "git log", short: "View previous commits.",
    why: "Displays repository history, including commit IDs, authors, dates and messages.",
    syntax: "git log --oneline",
    example: "git log\ngit log --oneline",
    steps: [
      "Make at least one commit.",
      "Run git log --oneline.",
      "Read the commit ID and message.",
    ],
    tip: "The --oneline option displays a compact history.",
  },
  {
    id: 6, tier: 2, title: "Create a Branch",
    command: "git branch", short: "Create a separate line of development.",
    why: "Branches let you work on features separately from your main branch.",
    syntax: "git branch <branch-name>",
    example: "git branch feature-navbar\ngit branch",
    steps: [
      "Run git branch to list branches.",
      "Create a branch with git branch feature-navbar.",
      "Switch to the new branch in the next lesson.",
    ],
    tip: "Creating a branch does not automatically switch to it.",
  },
  
{
  id: 7,
  tier: 2,
  title: "Checkout Branches",
  command: "git checkout",
  short: "Move between branches.",
  why: "Switches your working directory to another branch.",
  syntax: "git checkout <branch-name>",
  example: "git checkout -b feature-navbar",
  steps: [
    "Choose a branch name.",
    "Run git checkout -b feature-navbar.",
    "Make and commit changes on that branch.",
  ],
  tip: "The -b option creates a new branch and switches to it.",
},

  {
    id: 8, tier: 3, title: "Combine Branch Work",
    command: "git merge", short: "Integrate changes from another branch.",
    why: "Merges the changes from a specified branch into your currently checked-out branch.",
    syntax: "git merge <branch-name>",
    example: "git switch main\ngit merge feature-navbar",
    steps: [
      "Commit your feature branch changes.",
      "Switch to the branch receiving the changes.",
      "Run git merge feature-navbar.",
    ],
    tip: "If merge conflicts occur, resolve them before completing the merge.",
  },
  {
    id: 9, tier: 4, title: "Upload Your Commits",
    command: "git push", short: "Send commits to a remote repository.",
    why: "Uploads local commits to a remote repository such as GitHub.",
    syntax: "git push -u origin main",
    example: "git remote add origin <repository-url>\ngit push -u origin main",
    steps: [
      "Create a remote repository.",
      "Connect your local repository to the remote.",
      "Push your branch to the remote repository.",
    ],
    tip: "The remote must be configured, and you need permission to push.",
  },
  {
    id: 10, tier: 4, title: "Clone and Pull",
    command: "git clone / git pull",
    short: "Copy repositories and receive updates.",
    why: "git clone downloads a repository into a new local directory. git pull fetches remote updates and integrates them into your current branch.",
    syntax: "git clone <repository-url>\ngit pull",
    example: "git clone <repository-url>\ncd project\ngit pull",
    steps: [
      "Run git clone with a repository URL.",
      "Enter the cloned project folder.",
      "Run git pull when you need updates from the remote.",
    ],
    tip: "Clone is generally used for the initial copy; pull is used to update an existing clone.",
  },
];

const tiers = [
  {
    id: 1, title: "Linear Basics", levels: "Levels 1–4",
    description: "Learn repository initialization, status, staging and commits.",
    icon: Sprout, color: "mint",
  },
  {
    id: 2, title: "Branching", levels: "Levels 5–7",
    description: "Explore commit history, branches and switching.",
    icon: GitBranch, color: "blue",
  },
  {
    id: 3, title: "History & Integration", levels: "Level 8",
    description: "Learn how branches are integrated with merging.",
    icon: History, color: "purple",
  },
  {
    id: 4, title: "Advanced Workflow", levels: "Levels 9–10",
    description: "Learn remote repositories and collaboration.",
    icon: Rocket, color: "pink",
  },
];

const quizQuestions = {
  1: [
    { question: "What does git init do?",
      
      options: ["Uploads files to GitHub", 
        "Initializes a Git repository in the current folder", 
        "Creates a new branch", 
        "Deletes old commits"], 
        answer: 1 },
    { question: "Which hidden folder does Git create when a repository is initialized?", 
      options: [".github", 
        ".vscode",
         ".git", 
         ".history"], 
         answer: 2 },
    { question: "Where should you run git init?", options: ["Inside the folder you want Git to track", "Only inside Downloads", "Only on GitHub's website", "Inside the browser address bar"], answer: 0 },
    { question: "Which command can you run after git init to inspect the repository?", options: ["git push", "git status", "git clone", "git merge"], answer: 1 },
    { question: "What is the main purpose of the .git directory?", options: ["Store repository information and history", "Store only image files", "Publish the website", "Install Node.js"], answer: 0 },
  ],
  2: [
    { question: "What does git status show?", options: ["Only remote websites", "The current branch and file states", "The contents of every file", "Installed apps"], answer: 1 },
    { question: "What is an untracked file?", options: ["A file Git is not currently tracking", "A file already uploaded to GitHub", "A deleted branch", "A commit message"], answer: 0 },
    { question: "Which command is useful for checking whether a file is staged?", options: ["git init", "git status", "git clone", "git pull"], answer: 1 },
    { question: "Does git status modify your project files?", options: ["Yes, it stages every file", "Yes, it commits all files", "No, it reports repository status", "Yes, it deletes untracked files"], answer: 2 },
    { question: "When is it useful to run git status?", options: ["Only after pushing", "Frequently, to check current changes", "Only when deleting Git", "Never after editing files"], answer: 1 },
  ],
  3: [
    { question: "What does git add README.md do?", options: ["Stages changes to README.md", "Commits all changes", "Creates a remote repository", "Deletes README.md"], answer: 0 },
    { question: "What is the staging area used for?", options: ["Choosing changes for the next commit", "Hosting a website", "Storing Git passwords", "Creating screenshots"], answer: 0 },
    { question: "What does git add . generally stage?", options: ["Only the README file", "Changes under the current directory", "Only remote commits", "No files at all"], answer: 1 },
    { question: "Which command helps verify that changes have been staged?", options: ["git status", "git clone", "git switch", "git pull"], answer: 0 },
    { question: "Does git add itself create a commit?", options: ["Yes, always", "Only when online", "No, it stages changes for a later commit", "It pushes changes to GitHub"], answer: 2 },
  ],
  4: [
    { question: "What does git commit create?", options: ["A snapshot of staged changes in repository history", "A new remote website", "A folder named .github", "A new computer user"], answer: 0 },
    { question: "What is the purpose of -m in git commit -m \"Add homepage\"?", options: ["To merge branches", "To provide the commit message", "To move files", "To mark a file as untracked"], answer: 1 },
    { question: "What should generally happen before committing changes?", options: ["Stage the intended changes", "Delete the .git folder", "Clone the same project again", "Close the terminal permanently"], answer: 0 },
    { question: "Which command can show previous commits?", options: ["git status", "git add", "git log", "git init"], answer: 2 },
    { question: "Does a normal git commit automatically upload commits to GitHub?", options: ["Yes, always", "No, it saves the commit locally", "Only if the message is long", "Only if no files are staged"], answer: 1 },
  ],
  5: [
    { question: "What does git log display?", options: ["Repository commit history", "Only untracked files", "Installed extensions", "Remote repository passwords"], answer: 0 },
    { question: "Which option shows commit history in a compact format?", options: ["--short", "--quick", "--oneline", "--status"], answer: 2 },
    { question: "Which detail can appear in commit history?", options: ["Commit ID and message", "Browser bookmarks", "Wi-Fi password", "Monitor resolution"], answer: 0 },
    { question: "What should normally exist to make the history useful?", options: ["At least one commit", "A deleted .git folder", "Only untracked files", "A new CSS framework"], answer: 0 },
    { question: "Which command prints a compact commit history?", options: ["git log --oneline", "git add --oneline", "git init --oneline", "git status --commit"], answer: 0 },
  ],
  6: [
    { question: "What does a Git branch allow you to do?", options: ["Work on a separate line of development", "Automatically upload every file", "Delete repository history", "Replace the terminal"], answer: 0 },
    { question: "How do you create a branch named feature-navbar with git branch?", options: ["git branch feature-navbar", "git add feature-navbar", "git push feature-navbar", "git init feature-navbar"], answer: 0 },
    { question: "Does git branch feature-navbar automatically switch to that branch?", options: ["Yes, always", "No, it creates the branch without switching", "Only when online", "Only after deleting main"], answer: 1 },
    { question: "What does running git branch with no branch name normally do?", options: ["Lists local branches", "Commits all changes", "Downloads a repository", "Uploads all files"], answer: 0 },
    { question: "Why might you create a feature branch?", options: ["To work on a feature separately from the main branch", "To remove all commit messages", "To avoid tracking any files", "To replace Git with GitHub"], answer: 0 },
  ],
 7: [
  {
    question: "What does git checkout do?",
    options: [
      "Changes the currently checked-out branch",
      "Stages all files",
      "Shows commit history only",
      "Creates a remote repository"
    ],
    answer: 0
  },
  {
    question: "What does git checkout -b feature-navbar do?",
    options: [
      "Deletes the branch",
      "Creates the branch and switches to it",
      "Only lists branches",
      "Pushes the branch to GitHub"
    ],
    answer: 1
  },
  {
    question: "What should you choose before switching branches?",
    options: [
      "The branch you want to work on",
      "A commit message for every file",
      "A new operating system",
      "A browser tab"
    ],
    answer: 0
  },
  {
    question: "After switching to a feature branch, where can you make feature changes?",
    options: [
      "On that checked-out branch",
      "Only on GitHub's homepage",
      "Only in the .git folder",
      "Nowhere until the branch is deleted"
    ],
    answer: 0
  },
  {
    question: "Which command creates and switches to feature-navbar in one step?",
    options: [
      "git branch feature-navbar",
      "git checkout -b feature-navbar",
      "git status feature-navbar",
      "git log feature-navbar"
    ],
    answer: 1
  },
],
  8: [
    { question: "What does git merge feature-navbar do?", options: ["Integrates changes from feature-navbar into the current branch", "Switches automatically to feature-navbar", "Deletes every branch", "Uploads the project to a new website"], answer: 0 },
    { question: "Before merging, which branch should you be on?", options: ["The branch that should receive the changes", "Always the feature branch", "A branch that does not exist", "No branch at all"], answer: 0 },
    { question: "What should you generally do with feature changes before merging?", options: ["Commit the feature branch changes", "Delete the feature branch first in every case", "Run git init in another folder", "Remove all tracked files"], answer: 0 },
    { question: "Which command switches to main before merging in the example?", options: ["git add main", "git switch main", "git status main", "git clone main"], answer: 1 },
    { question: "What may need to happen if a merge conflict occurs?", options: ["Resolve the conflict before completing the merge", "Ignore it forever", "Delete the repository automatically", "Run git log until it disappears"], answer: 0 },
  ],
  9: [
    { question: "What does git push do?", options: ["Uploads local commits to a remote repository", "Creates a local commit only", "Lists untracked files", "Creates a new local file"], answer: 0 },
    { question: "In git push -u origin main, what is origin commonly used for?", options: ["The remote repository name", "The commit message", "A local file name", "A Git staging area"], answer: 0 },
    { question: "What is needed before pushing to a remote repository?", options: ["A configured remote and permission to push", "Only an empty folder", "A deleted branch", "No repository at all"], answer: 0 },
    { question: "Which command adds a remote named origin in the example?", options: ["git remote add origin <repository-url>", "git add origin main", "git init origin", "git status origin"], answer: 0 },
    { question: "If you commit changes locally, are they automatically on GitHub?", options: ["Yes, every commit is uploaded immediately", "No, pushing sends local commits to the remote", "Only if you run git status", "Only if the commit has no message"], answer: 1 },
  ],
  10: [
    { question: "What does git clone do?", options: ["Copies a remote repository into a new local directory", "Only displays file changes", "Creates a commit message", "Merges two local branches"], answer: 0 },
    { question: "What does git pull do?", options: ["Fetches remote updates and integrates them into the current branch", "Creates a new repository from scratch", "Only lists branches", "Deletes the remote repository"], answer: 0 },
    { question: "Which command is generally used for the initial copy of a repository?", options: ["git pull", "git clone", "git status", "git commit"], answer: 1 },
    { question: "After cloning a repository, what should you do before running project commands inside it?", options: ["Enter the cloned project folder", "Delete the cloned folder", "Run git init in the browser", "Remove all branches"], answer: 0 },
    { question: "What is the common difference between clone and pull?", options: ["Clone makes an initial local copy; pull updates an existing local repository", "Clone only stages files; pull commits them", "Clone deletes history; pull creates a branch", "They always do exactly the same thing"], answer: 0 },
  ],
};

const quizExplanations = {
  1: [
    "git init initializes Git tracking in the current project folder. It sets up the repository so Git can begin managing its history.",
    "The .git directory stores the repository's internal information and history; it is not the same as a GitHub website folder.",
    "Run git init inside the project folder you want Git to track, so that folder becomes the repository.",
    "git status reports the repository's current state, including branch and file changes, after initialization.",
    "The .git directory contains Git's repository data and history, rather than images, website publishing tools, or Node.js."
  ],
  2: [
    "git status shows the current branch and tells you which files are untracked, modified, or staged.",
    "An untracked file exists in the working folder but Git is not yet tracking it as part of the repository.",
    "git status helps you check whether a change is staged; the other commands have different purposes.",
    "git status only reports information about the repository. It does not stage, commit, or delete files.",
    "Checking git status regularly helps you understand your changes before staging or committing them."
  ],
  3: [
    "git add README.md stages changes to that specific file so they can be included in a later commit.",
    "The staging area lets you choose which changes should be included in the next commit.",
    "git add . generally stages changes under the current directory, rather than only one named file or remote commits.",
    "git status shows whether changes have entered the staging area.",
    "git add stages changes; a separate git commit is needed to create a commit."
  ],
  4: [
    "git commit records a snapshot of the staged changes in the repository's local history.",
    "The -m option lets you provide a commit message directly, such as Add homepage.",
    "Stage the intended changes first so the commit contains the changes you want to save.",
    "git log displays commit history, including information about earlier commits.",
    "A normal git commit saves a commit locally. git push is used to send commits to a remote repository."
  ],
  5: [
    "git log displays the repository's commit history, not the status of untracked files or installed extensions.",
    "The --oneline option formats each commit as a compact single-line entry.",
    "Commit history can include a commit ID and its message, helping you identify saved changes.",
    "At least one commit gives git log a commit entry to display.",
    "git log --oneline is the Git command for displaying compact commit history."
  ],
  6: [
    "A branch provides a separate line of development, allowing work on a feature without immediately mixing it into another branch.",
    "git branch feature-navbar creates a branch with that name.",
    "git branch feature-navbar creates the branch but leaves you on your current branch; it does not switch automatically.",
    "Running git branch without a name lists local branches.",
    "A feature branch keeps feature work separate from the main branch while it is being developed."
  ],
  7: [
    "git switch changes which branch is currently checked out, so you can work on that branch.",
    "The -c option creates the named branch and switches to it in the same command.",
    "Choose the destination branch before switching so Git knows which line of development you want to work on.",
    "After switching, new work is made in the currently checked-out branch, subject to Git's normal working-tree rules.",
    "git switch -c feature-navbar both creates feature-navbar and switches to it."
  ],
  8: [
    "git merge feature-navbar integrates that branch's changes into the branch you currently have checked out.",
    "Switch to the branch that should receive the changes before running git merge.",
    "Committing the feature changes first records the work that you intend to integrate.",
    "git switch main checks out main, making it the current branch before the example merge.",
    "A merge conflict needs to be resolved before the merge can be completed."
  ],
  9: [
    "git push sends local commits to a configured remote repository, such as a repository hosted on GitHub.",
    "origin is a commonly used name for a remote repository, not a commit message or staging area.",
    "Pushing requires a remote to be configured and sufficient permission to write to it.",
    "git remote add origin <repository-url> configures a remote named origin using the repository URL.",
    "Local commits are not automatically uploaded. git push sends them to the remote repository."
  ],
  10: [
    "git clone creates a local copy of a remote repository, usually in a new directory.",
    "git pull fetches remote updates and integrates them into the currently checked-out branch.",
    "git clone is normally used to create the initial local copy of a remote repository.",
    "Enter the cloned project directory before running commands that should operate on that project.",
    "Clone is for making the initial local copy; pull updates an existing local repository with remote changes."
  ]
};

export default function LearningHub() {
  const [selected, setSelected] = useState(null);

  const [completed, setCompleted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("commitcanvas-quiz-completed"));
      return Array.isArray(saved) ? saved.filter((id) => Number.isInteger(id) && id >= 1 && id <= 10) : [];
    } catch {
      return [];
    }
  });

  const [modalStage, setModalStage] = useState("reading");
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [query, setQuery] = useState("");

  function openLesson(lesson) {
    setSelected(lesson);
    setModalStage("reading");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setFeedbackShown(false);
    setQuizScore(null);
  }

  function changeLesson(lesson) {
    if (!lesson) return;
    setSelected(lesson);
    setModalStage("reading");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setFeedbackShown(false);
    setQuizScore(null);
  }

  function isUnlocked(id) {
    return id === 1 || completed.includes(id - 1);
  }

  const filteredLessons = lessons.filter((lesson) =>
    `${lesson.title} ${lesson.command} ${lesson.short} ${lesson.why}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function saveCompleted(id) {
    if (completed.includes(id)) return;

    const next = [...completed, id].sort((a, b) => a - b);
    setCompleted(next);

    try {
      localStorage.setItem("commitcanvas-quiz-completed", JSON.stringify(next));
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }

  function submitQuiz() {
    const questions = quizQuestions[selected.id];

    const score = questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

    setQuizScore(score);
    saveCompleted(selected.id);
    setModalStage("result");
  }

  function goToNextQuestion() {
    if (currentQuestionIndex === quizQuestions[selected.id].length - 1) {
      submitQuiz();
      return;
    }

    setCurrentQuestionIndex((current) => current + 1);
    setFeedbackShown(false);
  }

  return (
    <section className="learning-page" id="home">
      <div className="hero">
        <div className="eyebrow">
          <GitBranch size={18} />
          Git Learning Hub
        </div>

        <h1>
          Git <span>Learning Hub</span>
        </h1>

        <h2>Learn Git visually &amp; interactively</h2>

        <p>
          Master Git step by step with 4 structured tiers
          and 10 hands-on levels.
          <br />
          Build real skills, complete challenges and become confident with Git.
        </p>

        <button
          className="start-button"
          onClick={() =>
            document.getElementById("levels")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          Start Learning <ArrowRight size={20} />
        </button>
      </div>

      <div className="progress-summary">
        <div>
          <span className="summary-label">YOUR LEARNING PATH</span>
          <strong>
            {completed.length}
            <small> / 10 levels complete</small>
          </strong>
        </div>

        <div className="overall-track">
          <span style={{ width: `${completed.length * 10}%` }} />
        </div>
      </div>

      <div className="tier-grid">
        {tiers.map((tier) => {
          const Icon = tier.icon;

          const tierLessons = lessons.filter(
            (lesson) => lesson.tier === tier.id
          );

          const done = tierLessons.filter(
            (lesson) => completed.includes(lesson.id)
          ).length;

          return (
            <article
              className={`tier-card ${tier.color}`}
              key={tier.id}
            >
              <div className="tier-card-top">
                <div className="tier-icon">
                  <Icon size={32} />
                </div>

                <div>
                  <span className="tier-badge">TIER {tier.id}</span>
                  <h3>{tier.title}</h3>
                  <p className="tier-levels">{tier.levels}</p>
                </div>
              </div>

              <p className="tier-description">{tier.description}</p>

              <div className="tier-progress">
                <div className="track">
                  <span
                    style={{
                      width: `${(done / tierLessons.length) * 100}%`,
                    }}
                  />
                </div>

                <small>
                  {done} / {tierLessons.length}
                </small>
              </div>

              <button
                className="view-levels"
                onClick={() =>
                  document
                    .getElementById(`tier-${tier.id}`)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Levels <ArrowRight size={17} />
              </button>
            </article>
          );
        })}
      </div>

      <section className="levels-section" id="levels">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              <BookOpen size={15} />
              THE LEARNING PATH
            </span>

            <h2>10 levels to Git confidence</h2>

            <p>
              Open each unlocked level to read its commands and examples,
              then take the five-question quiz.
            </p>
          </div>

          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search commands..."
            />
          </label>
        </div>

        {tiers.map((tier) => {
          const group = filteredLessons.filter(
            (lesson) => lesson.tier === tier.id
          );

          if (group.length === 0) return null;

          return (
            <div
              className="lesson-group"
              id={`tier-${tier.id}`}
              key={tier.id}
            >
              <div className="group-title">
                <span className={`group-dot ${tier.color}`} />

                <h3>
                  Tier {tier.id}: {tier.title}
                </h3>

                <span>{group.length} levels</span>
              </div>

              <div className="lesson-list">
                {group.map((lesson) => (
                  <button
                    className={`lesson-row ${
                      isUnlocked(lesson.id) ? "" : "lesson-locked"
                    }`}
                    key={lesson.id}
                    disabled={!isUnlocked(lesson.id)}
                    onClick={() => openLesson(lesson)}
                  >
                    <span
                      className={
                        completed.includes(lesson.id)
                          ? "lesson-number done"
                          : "lesson-number"
                      }
                    >
                      {!isUnlocked(lesson.id) ? (
                        <LockKeyhole size={18} />
                      ) : completed.includes(lesson.id) ? (
                        <CheckCircle2 size={21} />
                      ) : (
                        String(lesson.id).padStart(2, "0")
                      )}
                    </span>

                    <span className="lesson-main">
                      <strong>{lesson.title}</strong>
                      <small>{lesson.short}</small>
                    </span>

                    <code>{lesson.command}</code>
                    <ArrowRight size={18} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {filteredLessons.length === 0 && (
          <p className="empty-state">
            No commands found. Try searching for git add, commit, branch or push.
          </p>
        )}
      </section>

      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section className="lesson-modal">
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close lesson"
            >
              <X size={21} />
            </button>

            <span className="modal-kicker">
              LEVEL {selected.id} · TIER {selected.tier}
            </span>

            {modalStage === "reading" && (
              <>
                <h2>{selected.title}</h2>

                <p className="modal-intro">{selected.why}</p>

                <h3>
                  <Terminal size={18} />
                  Command syntax
                </h3>

                <pre className="example-panel">{selected.syntax}</pre>

                <h3>Example</h3>
                <pre className="example-panel">{selected.example}</pre>

                <h3>Try it step by step</h3>

                <ol className="step-list">
                  {selected.steps.map((step, index) => (
                    <li key={index}>
                      <span>{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="tip-box">
                  <strong>Helpful tip</strong>
                  <p>{selected.tip}</p>
                </div>

                {completed.includes(selected.id) ? (
                  <div className="quiz-complete-note">
                    <CheckCircle2 size={18} />
                    Quiz completed for this level.

                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
    setCurrentQuestionIndex(0);
    setFeedbackShown(false);
                        setQuizScore(null);
                        setModalStage("quiz");
                      }}
                    >
                      Retake quiz
                    </button>
                  </div>
                ) : (
                  <button
                    className="complete-button"
                    onClick={() => setModalStage("confirm")}
                  >
                    <CheckCircle2 size={18} />
                    Mark as Completed
                  </button>
                )}
              </>
            )}

            {modalStage === "confirm" && (
              <div className="quiz-stage-panel">
                <div className="quiz-stage-icon">
                  <BookOpen size={28} />
                </div>

                <h2>Are you done reading?</h2>

                <p>
                  Make sure you have read all the commands, examples and steps
                  for <strong>{selected.title}</strong>. Next, you will answer
                  five questions based on this level.
                </p>

                <div className="quiz-stage-actions">
                  <button
                    type="button"
                    className="quiz-secondary-button"
                    onClick={() => setModalStage("reading")}
                  >
                    Not yet, keep reading
                  </button>

                  <button
                    type="button"
                    className="complete-button"
                    onClick={() => {
                      setAnswers({});
    setCurrentQuestionIndex(0);
    setFeedbackShown(false);
                      setQuizScore(null);
                      setModalStage("quiz");
                    }}
                  >
                    Yes, Start Quiz <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {modalStage === "quiz" && (
              <div className="quiz-content">
                {(() => {
                  const questions = quizQuestions[selected.id];
                  const question = questions[currentQuestionIndex];
                  const selectedAnswer = answers[currentQuestionIndex];
                  const isCorrect = selectedAnswer === question.answer;
                  const explanation = quizExplanations[selected.id][currentQuestionIndex];

                  return (
                    <>
                      <div className="quiz-heading">
                        <span className="modal-kicker">
                          LEVEL {selected.id} QUIZ
                        </span>
                        <h2>Check your understanding</h2>
                        <p>Choose an answer, submit it, and read the explanation before moving on.</p>

                        <div className="quiz-progress-label">
                          Question {currentQuestionIndex + 1} of {questions.length}
                          {" · "}
                          {Object.keys(answers).length} of {questions.length} answered
                        </div>
                        <div className="quiz-step-track">
                          <span style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
                        </div>
                      </div>

                      <fieldset className="quiz-question" key={`${selected.id}-${currentQuestionIndex}`}>
                       <div className="quiz-question-title">
  <span>{currentQuestionIndex + 1}.</span>
  <span>{question.question}</span>
</div>


                        <div className="quiz-options">
                          {question.options.map((option, optionIndex) => {
                            const isChosen = selectedAnswer === optionIndex;
                            const isAnswer = question.answer === optionIndex;
                            let optionClass = "quiz-option";
                            if (isChosen) optionClass += " selected";
                            if (feedbackShown && isAnswer) optionClass += " answer-correct";
                            if (feedbackShown && isChosen && !isAnswer) optionClass += " answer-incorrect";

                            return (
                              <label className={optionClass} key={option}>
                                <input
                                  type="radio"
                                  name={`question-${selected.id}-${currentQuestionIndex}`}
                                  checked={isChosen}
                                  disabled={feedbackShown}
                                  onChange={() =>
                                    setAnswers((current) => ({
                                      ...current,
                                      [currentQuestionIndex]: optionIndex,
                                    }))
                                  }
                                />
                                <span>{option}</span>
                                {feedbackShown && isAnswer && <CheckCircle2 size={18} />}
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      {feedbackShown && (
                        <div className={`quiz-answer-feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`}>
                          <strong>
                            {isCorrect ? "Correct answer!" : "Not quite — let's learn from it."}
                          </strong>
                          {!isCorrect && (
                            <p className="quiz-correct-answer">
                              Correct answer: <b>{question.options[question.answer]}</b>
                            </p>
                          )}
                          <p>{explanation}</p>
                        </div>
                      )}

                      {!feedbackShown ? (
                        <button
                          type="button"
                          className="complete-button quiz-submit-button"
                          disabled={selectedAnswer === undefined}
                          onClick={() => setFeedbackShown(true)}
                        >
                          Submit Answer <ArrowRight size={17} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="complete-button quiz-submit-button"
                          onClick={goToNextQuestion}
                        >
                          {currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question"}
                          <ArrowRight size={17} />
                        </button>
                      )}

                      {selectedAnswer === undefined && !feedbackShown && (
                        <p className="quiz-validation">Select one answer before submitting.</p>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {modalStage === "result" && (
              <div className="quiz-result-panel">
                <div className="quiz-result-icon">
                  {quizScore >= 3 ? (
                    <Award size={34} />
                  ) : (
                    <RotateCcw size={34} />
                  )}
                </div>

                <span className="modal-kicker">
                  LEVEL {selected.id} RESULT
                </span>

                <h2>{quizScore >= 3 ? "Well done!" : "Quiz completed"}</h2>

                <p className="quiz-score">
                  {quizScore} <span>/ 5</span>
                </p>

                <p>
                  {quizScore >= 3
                    ? "Great work! This level is complete, and the next level is now unlocked."
                    : "This level is complete and the next level is now unlocked. Review the reading and retake the quiz whenever you want to improve your score."}
                </p>

                <div className="quiz-result-actions">
                  <button
                    type="button"
                    className="quiz-secondary-button"
                    onClick={() => {
                      setAnswers({});
    setCurrentQuestionIndex(0);
    setFeedbackShown(false);
                      setQuizScore(null);
                      setModalStage("quiz");
                    }}
                  >
                    Retake quiz
                  </button>

                  <button
                    type="button"
                    className="complete-button"
                    onClick={() => setModalStage("reading")}
                  >
                    Back to reading
                  </button>

                  {selected.id < 10 && (
                    <button
                      type="button"
                      className="quiz-next-button"
                      onClick={() =>
                        changeLesson(
                          lessons.find((lesson) => lesson.id === selected.id + 1)
                        )
                      }
                    >
                      Next level <ArrowRight size={17} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button
                disabled={selected.id === 1}
                onClick={() =>
                  changeLesson(
                    lessons.find((lesson) => lesson.id === selected.id - 1)
                  )
                }
              >
                ← Previous
              </button>

              <span>{selected.id} / 10</span>

              <button
                disabled={
                  selected.id === 10 || !isUnlocked(selected.id + 1)
                }
                onClick={() =>
                  changeLesson(
                    lessons.find((lesson) => lesson.id === selected.id + 1)
                  )
                }
              >
                Next level →
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
