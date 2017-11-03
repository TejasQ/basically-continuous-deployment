import React, { Component } from "react"

class App extends Component {
  render() {
    return (
      <main>
        <h1>Basically, Continuous Deployment</h1>
        <img alt="Build Status" src="https://travis-ci.org/TejasQ/basically-continuous-deployment.svg?branch=master" />
        <br />
        <div>
          <p>
            This project was created to help introduce the concept of <em>Continuous Deployment</em> to anyone
            interested.
          </p>
        </div>
        <div>
          <p>
            <em>Basically</em> how it works is:
          </p>
          <ul>
            <li>
              You <code>git push</code> to a GitHub (or something else) server.
            </li>
            <li>
              The <code>git</code> server uses a WebHook to connect with a CI/CD system.
            </li>
            <li>The CI/CD thing builds your project, and deploys it somewhere.</li>
          </ul>
        </div>
        <div>
          <p>Simple, right? This webpage actually, was built with a Continuous Deployment script!</p>
        </div>
        <div>
          <p>
            <a href="https://github.com/TejasQ/basically-continuous-deployment/blob/master/deploy.sh">
              Check out the source code
            </a>{" "}
            to understand how it works.
          </p>
        </div>
        <br />
        <h2>
          How does <em>this</em> project work?
        </h2>
        <div>
          <p>Glad you asked!</p>
        </div>
        <ul>
          <li>
            It was created with{" "}
            <code>
              <a href="https://github.com/facebookincubator/create-react-app" target="_blank">
                create-react-app
              </a>
            </code>.
          </li>
          <li>
            It uses <a href="https://travis-ci.org/">Travis CI</a> as the CI/CD thing, which starts a new build on{" "}
            <code>git push</code>.
          </li>
          <li>
            When Travis starts a new build, it executes{" "}
            <a href="https://github.com/TejasQ/basically-continuous-deployment/blob/master/deploy.sh">this script</a>.
            <ul>
              <li>
                It is instructed to use the script, with{" "}
                <a href="https://github.com/TejasQ/basically-continuous-deployment/blob/master/.travis.yml">
                  <em>this</em> script.
                </a>
              </li>
            </ul>
          </li>
          <li>
            I highly recommend reading the deploy script above. It is heavily documented for you in true{" "}
            <em>Basically</em> fashion, in order to help you understand what's actually happening.
          </li>
          <li>
            After Travis is done, everything's deployed on{" "}
            <code>
              <a href="https://github.com/TejasQ/basically-continuous-deployment/tree/gh-pages">gh-pages</a>
            </code>, and things are live.
          </li>
        </ul>
        <br />
        <h2 id="keys">What's this about keys? 🗝</h2>
        <div>
          <p>
            Basically, Travis is going to be pushing to your GitHub account. Travis needs to be able to say HEY IM TEJAS
            in order to use Tejas' GitHub: it needs my key; my SSH key.
          </p>
        </div>
        <div>
          <p>And so, I've got to:</p>
          <ul>
            <li>
              Generate some keys:
              <ul>
                <li>
                  In a terminal, type:<br />
                  <code>ssh-keygen -t rsa -b 4096 -C "hello@tej.as" # YOUR EMAIL HERE</code>
                </li>
                <li>It'll ask you where to save it. Save the key somewhere familiar.</li>
                <li>It'll ask you for a passphrase. I usually leave this blank.</li>
                <li>
                  It'll generate 2 files for you:
                  <ul>
                    <li>
                      One ending with .pub <strong>(make a note of this)</strong>.
                    </li>
                    <li>And one with the name you gave it.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Encrypt them with Travis:
              <ul>
                <li>
                  Make sure you have the{" "}
                  <a href="https://github.com/travis-ci/travis.rb" target="_blank">
                    Travis CLI
                  </a>{" "}
                  installed.
                </li>
                <li>
                  In the terminal, run:<br />
                  <code>travis encrypt-file WHATEVER_YOU_NAMED_YOUR_KEY</code>
                </li>
                <li>
                  It will then create a <code>.enc</code> file based your key's filename.
                </li>
                <li>
                  It'll also say something back to you like:<br />
                  <code>
                    openssl aes-256-cbc -K $encrypted_<span style={{ color: "#0f0", fontWeight: "bold" }}>
                      0a6446eb3ae3
                    </span>_key -iv $encrypted_0a6446eb3ae3_key -blah blah
                  </code>
                </li>
                <li>
                  Copy the portion where we have <span style={{ color: "green" }}>green</span> text above. You'll need
                  it.
                </li>
              </ul>
            </li>
            <li>
              Add them (the <em>encrypted ones!</em>) to my project:
              <ul>
                <li>At this point, you have add your .enc file to your git repo and commit it.</li>
                <li>You can throw away your key at this point.</li>
              </ul>
            </li>
            <li>
              Tell Travis how to decrypt them:
              <ul>
                <li>
                  In your{" "}
                  <a href="https://github.com/TejasQ/basically-continuous-deployment/blob/master/.travis.yml">
                    .travis.yml
                  </a>, you'll want to add an <code>ENCRYPTION_LABEL</code> with that red thing you copied above.
                </li>
                <li>
                  See{" "}
                  <a href="https://github.com/TejasQ/basically-continuous-deployment/blob/master/.travis.yml">
                    this project's .travis.yml
                  </a>{" "}
                  as an example.
                </li>
              </ul>
            </li>
            <li>
              Add the keys to my GitHub account:
              <ul>
                <li>
                  The last step is actually adding the public part of your key to your GitHub profile to say "yes, the
                  Travis thing using my key is basically me".
                </li>
                <li>
                  <a href="https://github.com/settings/keys" target="_blank">
                    Go here
                  </a>, click the green <strong>New SSH Key</strong>, and paste the contents of your .pub file in the{" "}
                  <code>key</code> field, giving it an appropriate title.
                </li>
                <li>Bam!</li>
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <p>
            Whew! Now, Travis can properly push your shiny new <code>gh-pages</code> to your GitHub project.
          </p>
        </div>
      </main>
    )
  }
}
export default App
