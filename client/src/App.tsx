import React from 'react'
import Sketch from 'react-p5'
import io from 'socket.io-client'
// @ts-ignore
import ml5 from 'ml5'
import { Wand } from './Wand'
import P5 from 'p5'
import { Bubble } from './Bubble'

import bubbleImagePath from './images/bubble.png'

import breezeGreenImagePath from './images/watercolors/breeze_green.png'
import cloudImagePath from './images/watercolors/cloud.png'
import coolBlueImagePath from './images/watercolors/cool_blue.png'
import yellowSplashImagePath from './images/watercolors/yellow_splash.png'
import orangeTintImagePath from './images/watercolors/orange_tint.png'
import cherryRedImagePath from './images/watercolors/cherry_red.png'
import pinkHushImagePath from './images/watercolors/pink_hush.png'

import greyPersonImagePath from './images/people/grey.png'
import coolPersonImagePath from './images/people/cool.png'
import warmPersonImagePath from './images/people/warm.png'
import hotPersonImagePath from './images/people/hot.png'

const width = window.innerWidth
const height = window.innerHeight

// We use 6 Wands.
// 0, 1, 2 are used with the physical wands.
// 3, 4, 5 are used with the keyboard.
const keyToSensorIndex: any = {
  j: 3,
  k: 4,
  l: 5,
}

export default class App extends React.Component<{}> {
  sensorReadings = [0, 0, 0]
  x = 50
  y = 50
  video!: P5.Element
  poses: any[] = []
  bubbleImage!: P5.Image
  wands: Wand[] = []
  bubbles: Bubble[] = []
  waterColorGraphics!: P5.Graphics
  doneSetup = false
  waterColorImages: P5.Image[] = []
  modelLoaded = false
  people = 0

  imagesForOneOrFewer!: P5.Image[]
  imagesForTwo!: P5.Image[]
  imagesForThreeOrMore!: P5.Image[]

  peopleImages!: {
    grey: P5.Image
    cool: P5.Image
    warm: P5.Image
    hot: P5.Image
  }

  constructor(props: {}) {
    super(props)
    const socket = io('http://localhost:8888')
    socket.on('data', (data: number[]) => {
      // Each data array should have 3 elements.
      // Copy data into sensor reading slows 0, 1, 2.
      data.forEach((v: number, i: number) => (this.sensorReadings[i] = v))
    })
  }

  setup = (p5: P5, canvasParentRef: Element) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.frameRate(60)
    this.waterColorGraphics = p5.createGraphics(width, height)

    this.bubbleImage = p5.loadImage(bubbleImagePath)

    const loadImage = (path: string) => p5.loadImage(path)
    const coolImages = [
      breezeGreenImagePath,
      cloudImagePath,
      coolBlueImagePath,
    ].map(loadImage)
    const warmImages = [yellowSplashImagePath, orangeTintImagePath].map(
      loadImage,
    )
    const hotImages = [pinkHushImagePath, cherryRedImagePath].map(loadImage)
    this.imagesForOneOrFewer = coolImages
    this.imagesForTwo = [...coolImages, ...warmImages]
    this.imagesForThreeOrMore = [...coolImages, ...warmImages, ...hotImages]

    this.peopleImages = {
      grey: loadImage(greyPersonImagePath),
      cool: loadImage(coolPersonImagePath),
      warm: loadImage(warmPersonImagePath),
      hot: loadImage(hotPersonImagePath),
    }

    const positions = [0.25, 0.5, 0.75]
    // Use positions twice, two sets of 3 wands.
    this.wands = [...positions, ...positions].map(
      xFraction =>
        new Wand({
          x: width * xFraction,
          y: height * 0.5,
          p5,
          bubbleImage: this.bubbleImage,
          bubbles: this.bubbles,
        }),
    )

    // Create video element for poseNet.
    this.video = p5.createCapture(p5.VIDEO, () => {
      this.video.size(width, height)
    })

    // Create a new poseNet method with a single detection
    const poseNet = ml5.poseNet(
      this.video,
      {
        inputResolution: 193,
        multiplier: 0.5,
      },
      () => (this.modelLoaded = true),
    )

    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', (results: any) => {
      this.poses = results
    })

    // Hide the video element, and just show the canvas
    this.video.hide()

    this.doneSetup = true
  }

  // A function to draw ellipses over the detected keypoints
  drawKeyPoints = (p5: P5) => {
    p5.push()
    p5.translate(width, 0)
    p5.scale(-1.0, 1.0, 1.0)
    // Loop through all the poses detected
    for (let i = 0; i < this.poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = this.poses[i].pose
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j]
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          p5.fill(255, 0, 0)
          p5.noStroke()
          p5.ellipse(keypoint.position.x, keypoint.position.y, 10, 10)
        }
      }
    }
    p5.pop()
  }

  // A function to draw the skeletons
  drawSkeleton = (p5: P5) => {
    p5.push()
    p5.translate(width, 0)
    p5.scale(-1.0, 1.0, 1.0)
    // Loop through all the poses detected
    // Loop through all the skeletons detected
    for (let i = 0; i < this.poses.length; i++) {
      let skeleton = this.poses[i].skeleton
      // For every skeleton, loop through all body connections
      for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0]
        let partB = skeleton[j][1]
        p5.stroke(255, 0, 0)
        p5.line(
          partA.position.x,
          partA.position.y,
          partB.position.x,
          partB.position.y,
        )
      }
    }
    p5.pop()
  }

  drawEyes = (p5: P5) => {
    p5.push()
    p5.fill(255, 0, 0)
    p5.noStroke()
    this.poses.forEach(({ pose }) => {
      const eyes = [pose.leftEye, pose.rightEye]
      eyes.forEach(({ x, y }) => {
        p5.ellipse(x, y, 10, 10)
      })
    })
    p5.pop()
  }

  drawVideo = (p5: P5) => {
    p5.image(this.video, 0, 0, width, height)
  }

  drawFrameRate = (p5: P5) => {
    p5.push()
    p5.textSize(16)
    p5.textFont('Georgia')
    p5.text(Math.round(p5.frameRate()), 10, 10, 200, 100)
    p5.pop()
  }

  drawInstructions = (p5: P5) => {
    p5.push()
    p5.textSize(16)
    p5.fill(130)
    p5.textFont('Georgia')
    p5.text('Due to Covid-19 Air + Water will be demoed using keys.', 200, 100)
    p5.text('Press J, K or L to make some bubbles!', 200, 130)
    p5.text('The icons represent user count. Get others infront of the camera to get more colour sets!', 200,160)
    p5.text("If you'd like, feel free to take a screenshot and send it at georgina.yeboah@student.ocadu.ca. I'll post it to the site afterwards!", 200,180)
    p5.pop()
  }

  getImagesForPoseCount = (count: number) => {
    if (count <= 1) {
      return this.imagesForOneOrFewer
    } else if (count === 2) {
      return this.imagesForTwo
    } else {
      return this.imagesForThreeOrMore
    }
  }

  drawFaces = (p5: P5, count: number) => {
    p5.push()
    p5.imageMode(p5.CENTER)
    const xPositions = [0.4, 0.5, 0.6]
    const { grey, cool, warm, hot } = this.peopleImages
    const indexToPeopleImage = [cool, warm, hot]
    const size = 100
    xPositions.forEach((position, index) => {
      const enabled = count > index
      if (enabled) {
        p5.image(
          indexToPeopleImage[index],
          width * position,
          height * 0.8,
          size,
          size,
        )
      } else {
        p5.image(grey, width * position, height * 0.8, size, size)
      }
    })
    p5.pop()
  }

  draw = (p5: P5) => {
    p5.background(255)

    if (!this.doneSetup) {
      return
    }

    if (!this.modelLoaded) {
      p5.push()
      p5.textSize(16)
      p5.textFont('Helvetica')
      p5.textAlign(p5.CENTER)
      p5.text('Mixing Bubble Liquid...', width / 2, height / 2)
      p5.pop()
      return
    }

    this.wands.forEach((wand, i) => wand.update(this.sensorReadings[i]))
    this.bubbles.forEach(bubble => bubble.update())

    const people = this.poses.filter(({ pose }) => pose.score > 0.025).length

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i]
      if (bubble.isDead) {
        // Remove dead bubble.
        this.bubbles.splice(i, 1)
        // Get a random watercolor image and draw it.
        const waterColorImage = p5.random(this.getImagesForPoseCount(people))
        this.waterColorGraphics.push()
        this.waterColorGraphics.imageMode(p5.CENTER)
        this.waterColorGraphics.translate(bubble.x, bubble.y)
        this.waterColorGraphics.rotate(p5.random(0, 360))
        this.waterColorGraphics.image(
          waterColorImage,
          0,
          0,
          bubble.size,
          bubble.size,
        )
        this.waterColorGraphics.pop()
      }
    }

    // Fade out the watercolors slowly.
    if (p5.frameCount % 6 === 0) {
      this.waterColorGraphics.push()
      this.waterColorGraphics.blendMode(p5.ADD)
      this.waterColorGraphics.background('rgba(255,255,255,0.001)')
      this.waterColorGraphics.pop()
    }

    p5.image(this.waterColorGraphics, 0, 0)

    this.bubbles.forEach(bubble => bubble.draw())

    this.drawFaces(p5, people)

    // this.drawKeyPoints(p5)
    // this.drawSkeleton(p5)
    // this.drawEyes(p5)
    // this.drawFrameRate(p5)
    this.drawInstructions(p5)
  }

  onKeyPress = ({ key }: { key: string }) =>
    (this.sensorReadings[keyToSensorIndex[key]] = 1)

  onKeyRelease = ({ key }: { key: string }) =>
    (this.sensorReadings[keyToSensorIndex[key]] = 0)

  render() {
    return (
      <Sketch
        style={{ width, height }}
        setup={this.setup as any}
        draw={this.draw as any}
        keyPressed={this.onKeyPress as any}
        keyReleased={this.onKeyRelease as any}
      />
    )
  }
}
