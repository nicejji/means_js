export type Point = number[];
export type Point3D = [number, number, number];

export type InitFunction = (points: Point[], clusters: number) => Point[];

export type MeansState = {
  meta: {
    iteration: number,
    step: "labels" | "centers" | "init",
  }
  data: {
    centers: Point[]
    labels: number[]
  }
};

export const seed3DPoints = (count: number, propBound: number): Point3D[] => {
  const generated: Point3D[] = [];
  for (let i = 0; i < count; i++) {
    generated.push([Math.random() * propBound, Math.random() * propBound, Math.random() * propBound])
  }
  return generated;
}

export const plusPlusInit: InitFunction = (points, clusters) => {
  const randomPoint = points[Math.floor(Math.random() * points.length)];
  const centers = [randomPoint]
  for (let cId = 0; cId < clusters - 1; cId++) {
    let maxDistance = -Infinity
    let maxDistanceIndex = 0
    for (let i = 0; i < points.length; i++) {
      let minCenter = Infinity
      for (let j = 0; j < centers.length; j++) {
        let sum = 0
        for (let k = 0; k < points[0].length; k++) {
          sum += (points[i][k] - centers[j][k]) ** 2
        }
        if (sum < minCenter) {
          minCenter = sum
        }
      }
      if (minCenter > maxDistance) {
        maxDistance = minCenter
        maxDistanceIndex = i
      }
    }
    centers.push(points[maxDistanceIndex])
  }
  return centers;
}

export const firstPointsInit: InitFunction = (points, clusters) =>
  points.slice(0, clusters);

const updateLabels = (labels: number[], points: Point[], centers: Point[]) => {
  for (let i = 0; i < points.length; i++) {
    let minCenter = Infinity;
    let minIndex = 0;
    for (let j = 0; j < centers.length; j++) {
      let sum = 0;
      for (let k = 0; k < points[0].length; k++) {
        sum += Math.abs(points[i][k] - centers[j][k])
      }
      if (sum < minCenter) {
        minCenter = sum;
        minIndex = j;
      }
    }
    labels[i] = minIndex
  }
}

const updateCenters = (centers: Point[], points: Point[], labels: number[]) => {
  for (let i = 0; i < centers.length; i++) {
    const centroid = new Array(points[0].length).fill(0);
    let found = 0;
    for (let j = 0; j < points.length; j++) {
      if (labels[j] === i) {
        found += 1;
        for (let k = 0; k < points[0].length; k++) {
          centroid[k] += points[j][k]
        }
      }
    }
    centers[i] = centroid.map(x => x / found);
  }
}

const isCentersEqual = (centers: Point[], prevCenters: Point[]) => {
  for (let i = 0; i < centers.length; i++) {
    for (let j = 0; j < centers[0].length; j++) {
      if (centers[i][j] !== prevCenters[i][j]) {
        return false;
      }
    }
  }
  return true;
}

export const kmeans = (points: Point[], clusters: number, initFunction: InitFunction) => {
  let iteration = 0;
  const centers = initFunction(points, clusters);
  const labels = new Array(points.length).fill(0);
  const result: MeansState[] = [{ meta: { step: "init", iteration }, data: { centers: centers.slice(), labels: [] } }];

  while (true) {
    iteration += 1;
    const prevCenters = centers.slice();
    updateLabels(labels, points, centers);
    const labelsCopy = labels.slice()
    result.push({ meta: { step: "labels", iteration }, data: { centers: prevCenters, labels: labelsCopy } })
    updateCenters(centers, points, labels);
    result.push({ meta: { step: "centers", iteration }, data: { centers: centers.slice(), labels: labelsCopy } })
    if (isCentersEqual(centers, prevCenters)) return result;
  }
}
