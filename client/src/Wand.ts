import P5 from 'p5'
import { Bubble } from './Bubble'

export class Wand {
  // Global bubbles.
  bubbles: Bubble[]
  // Keep track of if a bubble is being blown.
  blowingBubblePrevious = false
  // If the windSpeed is greater than this
  // we consider the bubble as being blown.
  blowingThreshold = 0.2
  // The bubble being blown.
  bubble: Bubble | undefined
  // x position.
  x = 0
  // y position.
  y = 0
  // Speed of blowing.
  windSpeed = 0
  // P5 instance.
  p5: P5
  // The bubble image.
  bubbleImage: P5.Image

  constructor({
    x,
    y,
    p5,
    bubbles,
    bubbleImage,
  }: {
    x: number
    y: number
    p5: P5
    bubbles: Bubble[]
    bubbleImage: P5.Image
  }) {
    this.x = x
    this.y = y
    this.bubbles = bubbles
    this.p5 = p5
    this.bubbleImage = bubbleImage
  }

  update(windSpeed: number) {
    this.windSpeed = windSpeed

    // True if the user is blowing right now.
    const blowingBubble = windSpeed > this.blowingThreshold

    // Transition from not blowing to blowing.
    const startedBlowing = !this.blowingBubblePrevious && blowingBubble
    if (startedBlowing) {
      this.bubble = new Bubble({
        x: this.x,
        y: this.y,
        p5: this.p5,
        bubbleImage: this.bubbleImage,
      })
      this.bubbles.push(this.bubble)
    }

    // Transition from blowing to not blowing.
    const stoppedBlowing = this.blowingBubblePrevious && !blowingBubble
    if (stoppedBlowing) {
      if (this.bubble != null) {
        this.bubble.release()
      }
    }

    // If we're blowing a bubble.
    if (blowingBubble) {
      if (this.bubble != null) {
        this.bubble.grow(windSpeed)
      }
    }

    // Save as previous.
    this.blowingBubblePrevious = blowingBubble
  }
}
