import P5 from 'p5'

export class Bubble {
  x = 0
  y = 0
  size = 0
  speedX = 0
  speedY = 0
  color: P5.Color
  releasedTime = -1
  isDead = false
  lifeTime = 5000
  maxSize = 1000
  maxSpeed = 1
  p5: P5
  bubbleImage: P5.Image

  constructor({
    x,
    y,
    p5,
    bubbleImage,
  }: {
    x: number
    y: number
    p5: P5
    bubbleImage: P5.Image
  }) {
    this.x = x
    this.y = y
    this.size = 0
    this.speedX = p5.random(-this.maxSpeed, this.maxSpeed)
    this.speedY = p5.random(-this.maxSpeed, this.maxSpeed)
    this.color = p5.color(p5.random(255), p5.random(255), p5.random(255))
    this.p5 = p5
    this.bubbleImage = bubbleImage
  }

  grow(windSpeed: number) {
    this.size += windSpeed * 2
  }

  draw() {
    this.p5.push()
    this.p5.noStroke()
    this.p5.imageMode(this.p5.CENTER)
    this.p5.tint(255, 210)
    this.p5.image(this.bubbleImage, this.x, this.y, this.size, this.size)
    this.p5.pop()
  }

  release() {
    this.releasedTime = this.p5.millis()
  }

  dead() {
    this.isDead = true
  }

  update() {
    this.move()

    const isReleased = this.releasedTime !== -1
    if (isReleased && !this.isDead) {
      const timeSinceRelease = this.p5.millis() - this.releasedTime
      if (timeSinceRelease > this.lifeTime) {
        this.dead()
      }
    }

    if (this.size > this.maxSize) {
      this.dead()
    }
  }

  move() {
    this.x = this.x + this.speedX
    this.y = this.y + this.speedY
  }
}
