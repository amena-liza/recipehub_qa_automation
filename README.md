# 📱 MyBL Mobile App QA Automation

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com)  
[![Node.js](https://img.shields.io/badge/node-%3E=16.0.0-brightgreen.svg)](https://nodejs.org/)  
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This project covers e2e test cases from [📋 Final Sprint Planning of MyBL QA Automation](https://docs.google.com/spreadsheets/d/1xEerAL4yycsP0ECM4NjQGbteA2TJrm2Nk8fm1-_-UN8/edit?usp=sharing)

---

## ⚙️ Installation

Use `-f` or `--force` to force install npm packages from `package.json`

```bash
npm install -f
```

---

## 📂 Configuration File Locations & Descriptions

| 📄 File Name                 | 📁 Location        | 📝 Description                                                              |
|-----------------------------|--------------------|------------------------------------------------------------------------------|
| `package.json`              | Project Root       | Contains `npm run` commands and project dependencies                         |
| `specsAndSuites.js`         | `./config`         | Contains specs files list and test suite configurations                      |
| `capabilities.js`           | `./config`         | Contains local and BrowserStack capabilities                                |
| `development.wdio.conf.js`  | `./config`         | WDIO config for running tests locally                                       |
| `browserStack.wdio.conf.js` | `./config`         | WDIO config for running tests on BrowserStack                               |
| APK Files                   | `./app/android`    | APK files for Android testing from local environment                        |
| `.env` Files                | Project Root       | Contains core configurations for multiple environments                      |

---

## 🧪 Running Test Suites on Different Environments

`.env` files available at the root:

- `.env.development`
- `.env.production`
- `.env.stage`
- `.env.test`

| 💻 Command                                             | 📖 Description                                                              |
|--------------------------------------------------------|------------------------------------------------------------------------------|
| `SUITE=login npm run browserstack-development`         | Run suite on BrowserStack using `.env.development`                          |
| `SUITE=login npm run browserstack-production`          | Run suite on BrowserStack using `.env.production`                           |
| `SUITE=login npm run browserstack-stage`               | Run suite on BrowserStack using `.env.stage`                                |
| `SUITE=login npm run browserstack-test`                | Run suite on BrowserStack using `.env.test`                                 |
| `SUITE=recipe_list npm run development`                      | Run suite locally using `.env.development`                                  |
| `SUITE=login npm run production`                       | Run suite locally using `.env.production`                                   |
| `SUITE=login npm run stage`                            | Run suite locally using `.env.stage`                                        |
| `SUITE=login npm run test`                             | Run suite locally using `.env.test`                                         |
| `npm run get-report`                                   | Open Allure test reports graphically                                        |

---

## ☁️ BrowserStack Configuration

Make sure these environment variables are in your `.env` file:

- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`
- `BROWSERSTACK_APP_PATH_ANDROID`
- `BROWSERSTACK_APP_PATH_IOS`

---

## 🌿 Branching Strategy Conventions

1. 🔁 All merges should go through **Pull Requests (PRs)**
2. 🚫 **DO NOT CHECK OUT** from the `develop` branch
3. 🌱 **Checkout from `master`** branch when starting new features
4. 📬 Merge feature branches into `develop` via PR
5. ✏️ Use descriptive branch names like `epic/feature-name` or `feature/prepaid-recharge`
6. 📓 Use meaningful commit messages: e.g., _"adds prepaid-recharge feature"_
7. 🧼 Use squash merge:
   ```bash
   git merge --squash target_branch_name
   ```

---

## 👨‍💻 Development Conventions

1. **🗂️ Naming Convention**:
   - Use `camelCase` for filenames and variables
   - Object files contain locators only using `return $(``)` format

2. **🧰 Common Click & Text Functions**:
   ```js
   const targetElement = await lmsObject.getCardActivationDate();
   const isDisplayedTargetElement = await commonActions.scrollToElement(targetElement);
   expect(isDisplayedTargetElement).to.be.true;

   const targetElementTextInUi = await targetElement.getText();
   // OR
   await targetElement.click();
   ```

3. **↔️ Common Scroll Mechanism**:
   ```js
   scrollRightHorizontallyToElement(element, container)
   ```

4. **📄 Update `.example.env`** with all new keys (use `XXXXX` for secrets)

5. **📘 Keep `README.md` updated** with strategy and key documentation

---
