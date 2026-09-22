import { test } from 'node:test'
import assert from 'node:assert/strict'
import { partNames } from '@tensorflow-models/posenet'
import { mapPose } from '../client/src/poseDetection'

test('PoseNet results retain the ml5 shape consumed by the drawing code', () => {
  const keypoints = partNames.map((part, i) => ({
    part, score: part === 'leftShoulder' ? 0.4 : 0.9,
    position: { x: i * 10, y: i * 20 },
  }))
  const result = mapPose({ score: 0.8, keypoints })
  assert.equal(result.pose.score, 0.8)
  assert.deepEqual(result.pose.keypoints, keypoints)
  assert.deepEqual(result.pose.leftEye, { x: 10, y: 20, confidence: 0.9 })
  assert.deepEqual(result.pose.rightEye, { x: 20, y: 40, confidence: 0.9 })
  assert.ok(result.skeleton.length > 0)
  assert.ok(result.skeleton.every(pair => pair.every(point => point.score >= 0.5)))
})
