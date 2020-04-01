# Contributing to PSA: COVID-19 👏
Contribution is most welcome, but admittedly, it may be a slow start at first. This app started as a tech exploration inspired by the questionable information dissemenation of the COVID-19 virus.

From a techical prespective, this app also uses an exploratory use of Svelte and in-development design spec/theme library [**designspek**](https://github.com/Studiobear/designspek). However, this app is in [production](https://covid19.landofhere.com), rapidly evolving and, despite constant refactoring, somewhat messy.

- Best place to start is creating an [issue](https://github.com/landofhere/psa-covid19/issues/new/choose) for bug/feature request.
- Questions and support are handled in the [Land of Here Discord Chat](https://discord.gg/HkN8UAr)

## Getting Started

1. Clone repo:
```sh
git clone https://github.com/landofhere/psa-covid19.git
```

2. Install deps:
```sh
lerna bootstrap

yarn fix-packages 
# This command on install shouldn't do much except make sure everything is setup ok
```

3. Create env files in the app directories. There should be .env.sample files... This project is being developed with personal resources, so keeping that in mind, just ask and I'll help get you set up. 

4. Run the main webapp locally:
```sh
yarn workspace covid dev
```

5. If .env is setup correctly, then app should run at [http://localhost:3000](http://localhost:3000)

### ShareLib: git Submodules

Re:  covid-api (apps/covid-api)

This repo uses [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to pull in data from the John Hopkins University [CSSE COVID-19](https://github.com/CSSEGISandData/COVID-19) and the [New York Times covid-19-data](https://github.com/nytimes/covid-19-data) repos.

To init and update the submodules:
```
yarn submod:update
```

### Docker + Docker-Compose
Re:  covid-api (apps/covid-api)

## Procedures

**To be expanded...**

- Linting/formatting: Handled by hooks
- Git Flow:
		- commit using `yarn commit`
    - Use branches for PR's into develop. Prefix with `feat/`, `refactor/`, `fix/`, etc. Same options as seen in yarn commmit. 
		- All PRs should pass Semaphore CI. A staging build is created when merged into `develop` branch.
- Testing: Jest and Cypress setup... should be using, but... :sweat_smile: 



