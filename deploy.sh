#!/bin/bash
# The above thing is needed for bash
set -e # Exit with nonzero exit code if anything fails

# Let's tell Travis we're in production.
export NODE_ENV='production'

# So if master is pushed, update gh-pages.
SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

# A simple alias for our build command.
function doCompile {
  npm run build
}

# If someone just opened a pull request, or pushed some other branch,
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then

    # Just build and exit.
    doCompile
    exit 0
fi

# If not, store some variables.
REPO=`git config remote.origin.url`
REPO_LINK=${REPO/https:\/\/github.com\//git@github.com:}
COMMIT_HASH=`git rev-parse --verify HEAD`

# Clone this repo into a folder (on Travis) called "clone"
git clone $REPO clone

# Go into this folder
cd clone

# If we fail to check out the target branch as a new branch
# Or, if the target branch (gh-pages) already exists,
if ! git checkout -b $TARGET_BRANCH $SOURCE_BRANCH; then

  # Delete it
  git branch -D $TARGET_BRANCH

  # Create a copy of the source branch (master) named target branch (gh-pages)
  git checkout -b $TARGET_BRANCH $SOURCE_BRANCH

# End conditional
fi

# Copy over all the node modules so we don't have to `yarn install` again.
cp -a ../node_modules node_modules

# Run our compile script, inside the built folder.
# This is expected to create a `build` folder with production, compiled code.
# If your build script does something else, please account for in this file.
doCompile

# Find all files that are not:
#   - our deployment keys (keys.enc)
#   - our final compiled code (build)
#   - the .git folder (LOL)
#   - the current folder (. – also LOL)
#   - don't be recursive
#
# and then for each found file,
# delete it.
find . -maxdepth 1 ! -name keys.enc ! -name build ! -name .git ! -name . -exec rm -rf {} +

# Get the current directory.
cwd=`pwd`

# Copy the contents of the build folder into this current directory.
cp -a "${cwd}/build"/. "${cwd}"

# Now since the `build` stuff is in the root, delete build.
rm -rf build

# Close the index.html to 404.html
# On gh-pages, this allows you to use react-router and other JS routers for your site.
cp index.html 404.html # react-router woooo

# You can configure this git instance to have its own name and email!
git config user.name "Travis Kumar"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# If nothing changed,
if git diff --quiet; then
    echo "Nothing changed."

    # die.
    exit 0
fi

# Otherwise, add all files.
git add -A .

# Commit them with a message including the hash.
git commit -m "Deploy to GitHub Pages: ${COMMIT_HASH}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
# THIS STEP IS KEY! How do I get keys?!
# https://tejasq.github.io/basically-continuous-deployment/index.html#keys

# Store some variables
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}

# Use the key:
# openssl [type of encryption] -K [key] -iv [initialization vector]
# An initialization vector is basically a random number that guarantees the encrypted text is unique, that is used
# in encrypting AND decrypting something.
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in keys.enc -out key -d

# Update permissions
chmod 600 key

# Add key
eval `ssh-agent -s`
ssh-add key

# Push the new gh-pages with the -f tag, overwriting it completely.
# Basically, this guarantees that `gh-pages` is ALWAYS 1 commit ahead of master, with the latest production code.
git push -f -u $REPO_LINK $TARGET_BRANCH
exit 0

# Thank you for reading. Happy internetting! 🚀
