The COVID API is a supporting backend server to remove the load of fetching, parsing, and calculating COVID19 data. It outputs new shaped data into JSON files and ftps them to a static server.

~~It is run in docker to take advantage of a [Docker container proxy + Letsencrypt SSL](https://github.com/evertramos/docker-compose-letsencrypt-nginx-proxy-companion) on a VM.~~ Now that the static server is remote, SSL isn't needed. Still run using docker-compose as a regular node app using [forever](https://www.npmjs.com/package/forever).


### Dev Notes

In production, functions that parse, write, and ftp files are run every 15 minutes by a NodeJS [cron](https://www.npmjs.com/package/cron) library. Obviously this should be disabled during dev.

My hi-tech solution. In `./src/index.js`:
```js
job.start()  # <--- comment jobs out
job2.start()
// generateUS_CA_County() # <--- uncomment functions
// generateUS_CA_County_NoTime()
```
[TODO] Conditional check based on NODE_ENV , mebs.

Then run `yarn app dev` for immediate satisfaciton. 

Then remember to re/un-comment everything before submitting PR. :innocent: 

### Production notes
To launch container, from repo root dir:
```sh
git pull origin master
yarn imageVer
# set docker image tag (not actually needed... but anyways...)

sudo docker-compose -f docker-compose.covidapi.yml up -d --build

# check logs
sudo docker-compose -f docker-compose.covidapi.yml logs -f
# Ideally, nothing show up for 15 minutes, then outputs something like
# `null { error: null, data: '' }` This is feedback from ftps/lftp

```

In production logs, I see `Fatal error: max-retries exceeded` which usually means wrong credentials, however updated files are still arriving ¯\_(ツ)_/¯ 

## Notes

- lftp: lftp is the underlying library for ftp connections to the static server. [node-FTPS](https://github.com/Atinux/node-ftps) is a nodejs wrapper library for lftp used within COVID-API, but requires lftp to be installed within the system — so added to both VM and container.
  - Issue: _Host key verification failed_ - [Solution](https://www.wizlab.it/code/lftp-fix-fatal-error-host-key-verification-failed.html) SSH into remote server to get RSA key.
- [TODO]forever: switch to [forever-monitor](https://github.com/foreversd/forever-monitor)

An .env file is needed with:

```sh
FTP_HOST=yourftphost.com
FTP_USERNAME=user
FTP_PASSWORD=pass
FTP_PORT=22
FTP_DIR=path/to/remote/resource/targert
```

`Forever` command: 
```sh
forever [start|stop|restart|list|logs] dist/index.js
```
