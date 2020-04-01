# Land of Here PSA: COVID 19 Monorepo
![PSA: C19 Semaphore CI](https://studiobear.semaphoreci.com/badges/psa-covid19/branches/master.svg) ![Discord](https://img.shields.io/discord/691848117066137631?labelColor=5cafcf&label=Discord%20Chat&style=social&logo=discord)

This is a monorepo for the _Land of Here_ **PSA: COVID-19** web app and api. Have a look around!

Main packages location in the `./apps` dir:

- **covid**: The main PSA: COVID-19 webapp built using Svelte and a in-development design specification library [designspek](https://github.com/Studiobear/designspek)
- **covid-api**: Using "API" loosely, this NodeJS app pulls COVID-19 data form multiple sources and parses it into specific json files for use with the PSA app. The json files are built and ftp'd to a static file server on a cron schedule (every 15 min currently).

Note: This repo is developed in *nix environments (Linux, BSD, Mac OSX). 

For questions and support, join the [Land of Here Discord Chat](https://discord.gg/HkN8UAr)

---

## Contributing
Contributions are most welcome! Please first read the CODE OF CONDUCT and then CONTRIBUTING for more details.

## License

[MIT](LICENSE)

<p align="right">
<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"/>
</a>
</p>
