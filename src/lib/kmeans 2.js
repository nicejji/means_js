export default function * KMeans (points, clusterCount, plusPlusInit) {
  const pointsCount = points.length
  const propsCount = points[0].length
  let centers
  if (plusPlusInit) {
    // KMeans++ initialization
    centers = []
    centers.push(points[Math.floor(Math.random() * pointsCount)])
    for (let cId = 0; cId < clusterCount - 1; cId++) {
      let maxDistance = -Infinity
      let maxDistanceIndex = 0
      for (let i = 0; i < pointsCount; i++) {
        let minCenter = Infinity
        for (let j = 0; j < centers.length; j++) {
          let sum = 0
          for (let k = 0; k < propsCount; k++) {
            sum += (points[i][k] - centers[j][k]) ** 2
          }
          if (sum ** 0.5 < minCenter) {
            minCenter = sum ** 0.5
          }
        }
        if (minCenter > maxDistance) {
          maxDistance = minCenter
          maxDistanceIndex = i
        }
      }
      centers.push(points[maxDistanceIndex])
    }
  } else {
    // First k-points as centers
    centers = points.slice(0, clusterCount)
  }

  yield [centers.slice(), []]

  const labels = new Array(pointsCount).fill(0)
  while (true) {
    const prevCenters = centers.slice()
    // update labels
    //
    for (let i = 0; i < pointsCount; i++) {
      let minCenter = Infinity
      let minIndex = 0
      for (let j = 0; j < clusterCount; j++) {
        let sum = 0
        for (let k = 0; k < propsCount; k++) {
          sum += (points[i][k] - centers[j][k]) ** 2
        }
        if (sum ** 0.5 < minCenter) {
          minCenter = sum ** 0.5
          minIndex = j
        }
      }
      labels[i] = minIndex
    }

    yield [centers.slice(), labels.slice()]

    // update centers
    //
    for (let i = 0; i < clusterCount; i++) {
      const centroid = new Array(propsCount).fill(0)
      let found = 0
      for (let j = 0; j < pointsCount; j++) {
        if (labels[j] === i) {
          found += 1
          for (let k = 0; k < propsCount; k++) {
            centroid[k] += points[j][k]
          }
        }
      }
      centers[i] = centroid.map((x) => x / found)
    }

    yield [centers.slice(), labels.slice()]

    // compare centers
    //
    let equally = true
    for (let i = 0; i < clusterCount; i++) {
      for (let j = 0; j < propsCount; j++) {
        if (centers[i][j] !== prevCenters[i][j]) {
          equally = false
          break
        }
      }
      if (!equally) { break }
    }
    if (equally) {
      break
    }
  }
}
