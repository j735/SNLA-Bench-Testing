# Requirements

- Frictionless: Is this the easiest way to implement testing in a project?  Is this the best way for both large and small projects?
- Create a default testing infrastructure which provides enough default structure to expedite test set up, but flexible enough not to unduly burden the developer
- As seamlessly as possible (provide all potential plugins and extensions), provide a very easy set up for the various testing environments (device/OS/browser platforms) which might be required on a project
- Keep core testing framework code separate from custom written tests and scripts to facilitate easier updating
- All necessary testing configuration data should be located in one file
- Create a glossary of terms, i.e.
    - assertion library
    - end-to-end vs. functional testing
    - test runner
    - testing interface vs. framework
    - web driver (Leadfoot: used with Selenium)
- Consider any repercussions to build process


## Default site

- package.json
- tests
    - extensions
        - [extension file] (any extensions/plugins needed for functional/end-to-end testing in various browsers)
        - selenium-server-standalone-[version].jar (for local functional/end-to-end testing)
        - selenium.sh (custom bash script to spin up Selenium standalone server)
    - functional
        - index.js | [component name].js (in larger projects, functional tests should probably be broken out into separate component scripts)
    - unit
        - [module].js
    - intern.js (configuration file)


# Goals

## Stage 1

- Set up basic functional/end-to-end testing infrastructure in a very simple demo project (i.e. Sape carousel) using a flexible testing framework, such as Intern
- Explore various supported testing interfaces and create at least one template to use in demo project
    

## Stage 2

- Implement unit testing with new testing infrastructure by either refactoring existing project or starting new one


# Notes

[http://wiki.dandascalescu.com/howtos/from_zero_to_automated_web_app_testing_best_practices]
BDD is the next step after TDD, created with the goal of giving more structure to tests. If we aim for reducing the paradox of choice, then this is an easy one: BDD wins for making your app testing more future-proof and easier to collaborate across the organization. If your app is very small, you may not benefit much from BDD, but it's a useful skill to pick up.

## Selenium vs. CasperJS, ZombieJS, SlimerJS and other headless browsers

The short answer is that Selenium is the slowest, but it uses ("drives") a real browser. If you want to ensure cross-browser compatibility, Selenium is the best choice. If you want to run tests fast, headless browsers are better. However, they may lack "real browser" features such as precise drag-and-drop or using Flash (if you use ZeroClipboard, this may be important, until they drop Flash support altogether), and they may use different JavaScript engines (e.g. PhantomJS uses QtWebKit and there are no plans to move away from it).

For web applications developed in JavaScript, it makes sense to use a JavaScript Selenium WebDriver client, even though Selenium development has been traditionally done in Java. There are (at least) three categories of Node.JS libraries for using Selenium:

- the original selenium-webdriver,
- those that simplify its syntax (e.g. WebdriverIO) or make it synchronous (webdriver-sync), and
- WebDriver clients that include a testing framework (e.g. Nightwatch, Intern).


