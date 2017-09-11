FROM node:latest

ENV PATH=${PATH}:/src/node_modules/.bin

RUN curl -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -xj --strip-components=1 -C /usr/local

ADD / /src
WORKDIR /src
CMD ["bash"]