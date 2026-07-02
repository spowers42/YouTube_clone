# Neetcode Full Stack Development Course Experience

## Introduction

I am going through the Neetcode full stack development course to fill in some missing full stack skills and to get more
comfortable with typescript and node.js.  Overall I will follow the course closely, with some changes and extensions that I feel
are important or interesting.  This document is intended to capture that journey, my learnings, what I am doing differently, and 
also to document the project extensions that I explore.  

Each course section will have its own section here which will capture notes and modifications.  Any major extensions, for example
a transcrition service, will have their own sections. 

### Goals
* increase comfort with node.js
* improve front end ts/js development skills
* explore transformers.js (I am already familiar with transformers in python)

This project is primarily about improving my baseline typescript skills, and as such I will be avoiding the use of AI as a code assist.
The only exception is that I have configured a code review agent, [greptile](https://www.greptile.com/), for the project. Hopefully this will help enhance the learning even more, especially as I branch out into enhancements that are not in the course.

## Phase 1: Video Processing Service

### Processing files locally

The initial project setup, serving a hello world page, and then moving onto actually processing the local video file is pretty straight forward and well explained in the course.  Because of this I decided to add in two additional endpoints at this time, instead of waiting until later.  The first is an endpoint that gets a frame from 10 seconds into the video that is scaled down to 360p that can later be use as a thumbnail in the web page.  The second endpoint extracts the audio from the video.  This is intended as the input for a transcription service, which I will write later on, after more of the course is completed.

One thing of note is that the library fluent-ffmpeg is archived at this point and no longer in active development.  I don't think this will be a big issue right now for this project, but it would be better to use something that is actively maintained.  However for simplicity with following the course I am sticking with it for the moment.  Possible improvement is to find a new library to replace it with.

In testing I also noted a couple of edge cases, first being if the video doesn't have any audio then this causes a 500 error.  Likewise if the video is shorter that 10 seconds there will be a similar error.  Also the best thumbnail might be found a bit earlier, so this requires some exploration.  In the interest of moving forward in the course I have noted the issues as tickets and will address them later.  Overall getting an end to end version running seems better than dealing with edge cases.

Here is a full breakdown of changes from the course:
* use nodemon to run the local server, since it restarts on file change
* setup eslint for linting
* endpoint rename
* audio extraction endpoint
* thumbnail extraction endpoint

Improvements to make:
* noted edgecases
* manual checking of input file name and output file name.   This should really use a schema validator instead.

### Adding local docker

This is pretty straight forward.  I use podman on my workstation, so I have Containerfile instead of Dockerfile, even though either would work.  I also don't use the short name, since my podman configuration tries to resolve it externally instead of locally, so I reference the build step stage number in the `--from` statement.  

This also seemed a good time to add a simple health endpoint so that it is quick and easy to check that things are running.  This can be helpful for debugging as the whole system gets built out.

A couple of updates to make the containerfile more production ready are:
* running as appuser instead of root for increased security
* using npm ci instead of npm install
 