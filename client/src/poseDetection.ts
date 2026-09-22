import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import * as posenet from '@tensorflow-models/posenet'

export const modelOptions: posenet.ModelConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: 193,
  multiplier: 0.5,
  quantBytes: 2,
}

export const detectionOptions: posenet.MultiPersonInferenceConfig = {
  flipHorizontal: false,
  maxDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 20,
}

export function mapPose(pose: posenet.Pose) {
  const parts = Object.fromEntries(pose.keypoints.map(keypoint => [
    keypoint.part,
    { x: keypoint.position.x, y: keypoint.position.y, confidence: keypoint.score },
  ]))
  return {
    pose: { ...pose, ...parts },
    skeleton: posenet.getAdjacentKeyPoints(pose.keypoints, 0.5),
  }
}

export function startPoseDetection(
  video: HTMLVideoElement,
  onPoses: (poses: ReturnType<typeof mapPose>[]) => void,
  onReady: () => void,
  onError: (error: unknown) => void,
): () => void {
  let stopped = false
  async function run() {
    let model: posenet.PoseNet | undefined
    try {
      await tf.setBackend('webgl')
      await tf.ready()
      if (stopped) return
      model = await posenet.load(modelOptions)
      if (stopped) return
      onReady()
      while (!stopped) {
        if (video.readyState >= 2 && video.videoWidth > 0) {
          const poses = await model.estimateMultiplePoses(video, detectionOptions)
          if (!stopped) onPoses(poses.map(mapPose))
        }
        await tf.nextFrame()
      }
    } catch (error) {
      if (!stopped) onError(error)
    } finally {
      model?.dispose()
    }
  }
  void run()
  return () => { stopped = true }
}
