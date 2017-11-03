# Basically, Continuous Deployment
![Build Status](https://travis-ci.org/TejasQ/basically-continuous-deployment.svg?branch=master)

This project was created to help introduce the concept of _Continuous Deployment_ to anyone interested.

_Basically_ how it works is:

*   You `git push` to a GitHub (or something else) server.
*   The `git` server uses a WebHook to connect with a CI/CD system.
*   The CI/CD thing builds your project, and deploys it somewhere.

Simple, right? This webpage actually, was built with a Continuous Deployment script!

[Check out the source code](https://github.com/TejasQ/basically-continuous-deployment/blob/master/deploy.sh) to understand how it works.

## How does _this_ project work?

Glad you asked!

*   It was created with [`create-react-app`](https://github.com/facebookincubator/create-react-app).
*   It uses [Travis CI](https://travis-ci.org/) as the CI/CD thing, which starts a new build on `git push`.
*   When Travis starts a new build, it executes [this script](https://github.com/TejasQ/basically-continuous-deployment/blob/master/deploy.sh).
    *   It is instructed to use the script, with [_this_ script.](https://github.com/TejasQ/basically-continuous-deployment/blob/master/.travis.yml)
*   I highly recommend reading the deploy script above. It is heavily documented for you in true _Basically_ fashion, in order to help you understand what's actually happening.
*   After Travis is done, everything's deployed on [`gh-pages`](https://github.com/TejasQ/basically-continuous-deployment/tree/gh-pages), and things are live.

## What's this about keys? 🗝

Basically, Travis is going to be pushing to your GitHub account. Travis needs to be able to say HEY IM TEJAS in order to use Tejas' GitHub: it needs my key; my SSH key.

And so, I've got to:

*   Generate some keys:
    *   In a terminal, type:  
        `ssh-keygen -t rsa -b 4096 -C "hello@tej.as" # YOUR EMAIL HERE`
    *   It'll ask you where to save it. Save the key somewhere familiar.
    *   It'll ask you for a passphrase. I usually leave this blank.
    *   It'll generate 2 files for you:
        *   One ending with .pub **(make a note of this)**.
        *   And one with the name you gave it.
*   Encrypt them with Travis:
    *   Make sure you have the [Travis CLI](https://github.com/travis-ci/travis.rb)  installed.
    *   In the terminal, run:  
        `travis encrypt-file WHATEVER_YOU_NAMED_YOUR_KEY`
    *   It will then create a `.enc` file based your key's filename.
    *   It'll also say something back to you like:  
        `openssl aes-256-cbc -K $encrypted_0a6446eb3ae3_key -iv $encrypted_0a6446eb3ae3_key -blah blah`
    *   Copy the portion where we have `0a6446eb3ae3` written above. You'll need it.
*   Add them (the _encrypted ones!_) to my project:
    *   At this point, you have add your .enc file to your git repo and commit it.
    *   You can throw away your key at this point.
*   Tell Travis how to decrypt them:
    *   In your [.travis.yml](https://github.com/TejasQ/basically-continuous-deployment/blob/master/.travis.yml), you'll want to add an `ENCRYPTION_LABEL` with that red thing you copied above.
    *   See [this project's .travis.yml](https://github.com/TejasQ/basically-continuous-deployment/blob/master/.travis.yml) as an example.
*   Add the keys to my GitHub account:
    *   The last step is actually adding the public part of your key to your GitHub profile to say "yes, the Travis thing using my key is basically me".
    *   [Go here](https://github.com/settings/keys) , click the green **New SSH Key**, and paste the contents of your .pub file in the `key` field, giving it an appropriate title.
    *   Bam!


Whew! Now, Travis can properly push your shiny new `gh-pages` to your GitHub project.
