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
    commentBody="🎥 **End-to-End Test Recordings**\n\n$videoRecordingsLinks\n\nThese videos demonstrate the end-to-end tests for the changes in this pull request."
}

# Check if a comment with recordings already exists
function getExistingComment() {
    existingComment=$(gh pr view --repo neos/neos-ui $pullRequestNumber --json comments | jq -r ".comments[] | select( .body | contains(\"Linked recordings of the acceptance tests\"))")
}

function createComment() {
    echo "Creating new comment..."
    gh pr comment --repo neos/neos-ui $pullRequestNumber --body "$(printf "$commentBody")"
}

# If a comment with recordings exists, update the existing comment
function updateComment() {
    # Todo: The gh cli does not support editing comments yet, so we have to use the GitHub API directly
    echo "Updating existing comment..."
    comment_uri=$(echo "$existing_comment" | jq -r ".url")
    gh pr comment $comment_uri --body "$(printf "$commentBody")"
}

jobIds=$1
pullRequestNumber=$2
generateCommentBody
getExistingComment

if [ -n "$existingComment" ]; then
    # @todo: use updateComment once the gh cli supports editing comments or we use the Github API directly
    createComment
else
    createComment
fi

echo "Comment added to Pull Request #$pullRequestNumber with the latest acceptance test recordings."
