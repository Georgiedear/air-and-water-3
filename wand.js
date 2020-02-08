class Wand {
    // Bubble bubble;

    constructor(x, y) {
    // Keep track of if a bubble is being blown.
     this.blowingBubblePrevious = false;
  
    // If the windSpeed is greater than this
    // we consider the bubble as being blown.
    this.blowingThreshold = 0.1;
  
    // The bubble being blown.
  
    this.x;
    this.y;
    this.windSpeed;
    }

  
     update( windSpeed) {
      this.windSpeed = windSpeed;
  
      // True if the user is blowing right now.
       this.blowingBubble = this.windSpeed > this.blowingThreshold;
  
      // Transition from not blowing to blowing.
       this.startedBlowing = !this.blowingBubblePrevious && this.blowingBubble;
      if (this.startedBlowing) {
        bubble = new Bubble(x, y);
        bubbles.add(bubble);
      }
  
      // Transition from blowing to not blowing.
       this.stoppedBlowing = this.blowingBubblePrevious && !this.blowingBubble;
      if (this.stoppedBlowing) {
        if (bubble != null) {
          bubble.release();
        }
      }
  
      // If we're blowing a bubble.
      if (this.blowingBubble) {
        if (bubble != null) {
          bubble.grow(windSpeed);
        }
      }
  
      // Save as previous.
      this.blowingBubblePrevious = this.blowingBubble;
    }
}