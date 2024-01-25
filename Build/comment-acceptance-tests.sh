#!/bin/bash

# Check if the required parameters are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <JobID> <PullRequestNumber>"
    exit 1
fi

# If no comment with recordings exists, create a new comment
# create a function names createNewComment with the comment body as parameter

function generateCommentBody() {
    # Split the JobID string into an array
    IFS=' ' read -ra jobIdArray <<< "$jobIds"

    # Iterate over each JobID in the array
    for i in ${!jobIdArray[@]}; do
        iterator=$(($i+1))
        jobId="${jobIdArray[$i]}"
        link="[Recording $iterator](https://app.saucelabs.com/rest/v1/jobs/$jobId/video.mp4)"
        videoRecordingsLinks+="\n* $link"
    done

    # Construct the comment with the latest acceptance test recordings
    # Construct the comment with the latest acceptance test recordings
        if [ -n "$videoRecordingsLinks" ]; then
            commentBody="🎥 **End-to-End Test Recordings**\n\n$videoRecordingsLinks\n\nThese videos demonstrate the end-to-end tests for the changes in this pull request."
        else
            # empty comment body to prevent a comment without recordings
            commentBody=""
        fi
}

# Check if a comment with recordings already exists
function getExistingComment() {
    echo "Checking if a comment with recordings already exists..."
    echo "Pull Request Number: $pullRequestNumber"
    existingComment=$(gh pr view --repo neos/neos-ui $pullRequestNumber --json comments | jq -r ".comments[] | select( .body | contains(\"End-to-End Test Recordings\"))")
}

function createComment() {
    echo "Creating new comment..."
    gh pr comment --repo neos/neos-ui $pullRequestNumber --body "$(printf "$commentBody")"
}

# If a comment with recordings exists, update the existing comment
function updateComment() {
    # Note: The gh cli does not support editing comments yet, so we have to use the GitHub API directly
    echo "Updating existing comment..."
    commentUri=$(echo "$existingComment" | jq -r ".url")
    commentId=$(echo "$commentUri" | awk -F'#issuecomment-' '{print $2}')
    curl -s -H "Authorization: token $GH_TOKEN" \
            -X PATCH -d "{\"body\":\"$(printf "$commentBody")\"}" \
            "https://api.github.com/repos/neos/neos-ui/issues/comments/$commentId"
}

jobIds=$1
pullRequestNumber=$2
generateCommentBody
getExistingComment

echo "Existing comment: $existingComment"
if [ -n "$existingComment" ]; then
    echo "Updating existing comment..."
    updateComment
else
    createComment
fi

echo "Comment added to Pull Request #$pullRequestNumber with the latest acceptance test recordings."
