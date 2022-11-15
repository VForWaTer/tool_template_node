FROM node:18.12.1-buster

# create the tool input structure
RUN mkdir /in
COPY ./in /in
RUN mkdir /out
RUN mkdir /src
COPY ./src /src

WORKDIR /src

# install dependencies:  js-yaml and papaparse
# in node, the dependencies are directly install into /src/
RUN npm install js-yaml
RUN npm install papaparse

# run command
CMD ["node", "run.js"]