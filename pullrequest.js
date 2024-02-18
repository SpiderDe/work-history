const { Octokit } = require("@octokit/rest");
const fs = require("fs");

// Create an Octokit instance
const octokit = new Octokit({
  auth: "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",
});

// Define repository details
const owner = "SpiderDe";
const repo = "my-history";
const filePath = "D:\\my-history\\foo.txt"; // Path to the file you want to modify

// Function to modify the content of the file, commit changes, create a pull request, and merge it
async function makeFakePullRequest() {
  try {
    // Read the current content of the file
    let content = fs.readFileSync(filePath, "utf-8");

    // Modify the content (for example, add a timestamp)
    const timestamp = new Date().toISOString();
    content += `\n${timestamp} - Fake change`;

    // Write the modified content back to the file
    fs.writeFileSync(filePath, content, "utf-8");

    // Get the latest commit SHA for the file
    const { data: { sha } } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath.replace("D:/", ""),
    });

    // Commit the changes
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath.replace("D:/", ""), // Remove the drive letter to match the GitHub path format
      message: `Fake commit - ${timestamp}`,
      content: Buffer.from(content).toString("base64"),
      sha, // Provide the SHA of the latest commit for the file
    });

    // Create a pull request
    const pullRequestResponse = await octokit.pulls.create({
      owner,
      repo,
      title: `Fake Pull Request - ${timestamp}`,
      head: "pull",
      base: "master",
      body: "This is a fake pull request.",
    });

    // Merge the pull request
    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: pullRequestResponse.data.number,
      commit_title: "Merge pull request",
      commit_message: "Automatically merged",
    });

    console.log(`Fake pull request merged successfully - ${timestamp}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Define the duration (in milliseconds) for which you want to continue making fake pull requests
const duration = 1 * 60 * 60 * 1000; // 1 hour

// Function to continuously make fake pull requests for the specified duration
async function runForDuration() {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    await makeFakePullRequest();
    await delay(30 * 60 * 1000); // Delay between each fake pull request (30 minutes)
  }
}

// Function to introduce a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start the process
runForDuration();
