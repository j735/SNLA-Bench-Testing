# Overview #

This repo is the result of an internal work project.  I was tasked with coming up with a generic testing structure for use across client projects.  I used SapientNitroLA's carousel as a basic, sample project to apply testing to.  

Since I was applying testing to a pre-existing project, I focused solely on functional testing since a proper unit testing implementation demands a TDD/BDD approach.  As such, I ended up focusing on Intern and Nightwatch since they are the most developed functional testing frameworks currently available.

I used the Page Object pattern for both sets of tests since it is a good way to abstract away the DOM tree structure from the tests themselves.  The actual tests exist in the following folder: *[project root]/tests/functional/[framework]/index.js*.  The Page Object files are in *[project root]/tests/support/pages/[framework]/IndexPage.js*.


# Usage #

I implemented the same set of tests in Intern and Nightwatch:

1. Load site: dynamic DOM wrapper elements should init
2. First set of two tiles should be visible
3. Click next button: second set of two tiles should be visible
4. Click fourth pagination link: fourth set of two tiles should be visible
5. Click next button: third set of two tiles should be visible
6. Update carousel to be 3-up, click first pagination link: first set of three tiles should be visible

The commands to initiate the tests reside in the scripts node of package.json and are run from the command line with the following commands: *npm run intern* or *npm run nightwatch*.


# Intern vs. Nightwatch #

| Intern                                  | Nightwatch                                          |
|---------------------------------------- |---------------------------------------------------- |
| Supports unit tests                     | Manages starting/stopping of selenium server\*      |
| Supports different assertion libraries  | Cleaner console messaging during tests              |
| Robust Promises interface               | Much simpler synchronous interface                  |
| Good documentation                      | Better Page Object model                            |
| AMD support                             | Supports chaining of custom methods out-of-the-box  |
| Unit test support                       |                                                     |

\* *In my opinion, this single feature is sufficient to justify use of Nightwatch over Intern*


# Automated Testing Layers #

                      Code to be Tested
                              |
                              |
                    OS/Browser Platform
                              |
                              |                               ----
                          WebDriver                              |
                              |                                  |- Selenium
                              |                                  |
                    WebDriver Server/Client                      |
                              |                               ----
                              |                               ----
                      Assertion Library                          |
                              |                                  |- Testing Framework
                              |                                  |
                       Testing Harness                           |
                              |                               ----
                              |
                          Test Cases


# Glossary #

## Code to be Tested ##

This layer is the development code which is the subject of testing.  In the case of this repo, the carousel JS code in the library folder is what is being tested.

## OS/Browser Platform ##

This is the operating system/browser combination which the code above is being tested on.

## WebDriver ##

WebDriver is the browser automation API which enables the programmatic control of a modern browser.

## WebDriver Server/Client ##

This layer interacts with the WebDriver API and generally provides a unified interface with interacting with various browsers.

## Assertion Library ##

This layer is responsible for the logical assertions which constitute a test.

## Testing Harness ##

This layer is essentially the testing framework being used; so, in this case, it would be Intern and Nightwatch.

## Test Case ##

Actual test which can be written by a developer or a QA engineer.


