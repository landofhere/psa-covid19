The COVID API is a supporting backend server to remove the load of fetching, parsing, and calculating COVID19 data. It outputs new shaped data into JSON files and ftps them to a static server.

~~It is run in docker to take advantage of a [Docker container proxy + Letsencrypt SSL](https://github.com/evertramos/docker-compose-letsencrypt-nginx-proxy-companion) on a VM.~~ Now that the static server is remote, SSL isn't needed. It's just run as a regular node app using [forever](https://www.npmjs.com/package/forever).

```sh
forever [start|stop|restart|list|logs] dist/index.js
```

## Notes

- lftp: lftp is the underlying library for ftp connections to the static server. FTPS is a nodejs wrapper library used within COVID-API, but requires lftp to be installed within the system — so added to both VM and container.
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
