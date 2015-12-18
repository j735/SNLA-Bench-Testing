# JavaScript Automated Testing Layers #

                      Code to be Tested
                              |
                              |
                          Browser/OS 
                           (local)
                              |
                              |                               ---
                          WebDriver                              |
                    (browser automation API)                     |
                              |                                  |- Selenium
                              |                                  |
                    WebDriver Client/Server                      |
        (i.e. selenium-webdriver, WebDriverIO, webdriver-sync)   |
                              |                               ---
                              |                               ---
                      Assertion Library                          |
                         (i.e. Chai)                             |
                              |                                  |- Testing Framework
                              |                                  |
                       Testing Harness                           |
       (i.e. Jasmine, Mocha, Cucumber, Intern, Nightwatch)       |
                              |                               ---
                              |
                          Test Cases
            (custom tests written by dev/QA engineer)


# Glossary

## TDD

Software development process that relies on the repetition of a very short development cycle: first the developer writes an (initially failing) automated test case that defines a desired improvement or new function, then produces the minimum amount of code to pass that test, and finally refactors the new code to acceptable standards.

## BDD

By using terminology focused on the behavioural aspects of the system rather than testing, BDD attempts to help direct developers towards a focus on the real value to be found in TDD at its most successful.  Behavior Driven Development is more about interactions with the application than just unit testing. It forces the developer to understand the responsibility of the method he is about to write.

## Assertion

An assertion is a statement that a predicate (Boolean-valued function, a true–false expression) is expected to always be true at that point in the code. If an assertion evaluates to false at run time, an assertion failure results, which typically causes the program to crash, or to throw an assertion exception.

## Testing Framework

A test automation framework is an integrated system that sets the rules of automation of a specific product. This system integrates the function libraries, test data sources, object details and various reusable modules. These components act as small building blocks which need to be assembled to represent a business process. The framework provides the basis of test automation and simplifies the automation effort.

It is responsible for: 

- defining the format in which to express expectations
- creating a mechanism to hook into or drive the application under test
- executing the tests
- reporting results

