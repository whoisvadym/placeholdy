<h1 align="center">🖼️ Placeholdy</h1>
<h3 align="center">An open-source dockerized placeholder image service for local development.</h3>
<p align="center">
  <a href="https://hub.docker.com/r/pewstiepoll/placeholdy">
    <img alt="docker pull pewstiepoll/placeholdy" src="https://img.shields.io/docker/pulls/pewstiepoll/placeholdy.svg">
  </a>
</p>

## Installation

_(Docker must be installed)_

- Pull: `docker pull pewstiepoll/placeholdy`
- Run: `docker run pewstiepoll/placeholdy -dit -p 3000:3000`

## Usage

- Make sure the docker container is up and running.
  - You should see `Placeholdy server is running on port` when accessing `localhost:3000`.
- Generate the image by accessing the url:
  - `localhost:3000/image/300x300`
  - `localhost:3000/image/300x300/dedede`
