workFlow = [
  { x: 123, y: 443, outcomes: ["then"] },
  { x: 100, y: 50, outcomes: ["then"] },
  { x: 200, y: 50, outcomes: ["then"] },
  { x: 500, y: 600, outcomes: ["then"] },
  { x: 450, y: 500, outcomes: ["then"] },
  { x: 500, y: 750, outcomes: ["then"] },
  { x: 350, y: 250, outcomes: ["then"] },
];

connections = [
  { source: "id_0", target: "id_1", outcome: "" },
  { source: "id_2", target: "id_3", outcome: "then" },
  { source: "id_4", target: "id_5", outcome: "" },
];

const instanceOptions = {
  DragOptions: { cursor: "pointer", zIndex: 2000 },
  ConnectionOverlays: [
    [
      "Arrow",
      {
        location: 1,
        visible: true,
        width: 11,
        length: 11,
      },
    ],
    [
      "Label",
      {
        location: 0.5,
        id: "label",
      },
    ],
  ],
  Container: document.body,
};

loadData = () => {
  const storage = localStorage.getItem("flow");
  if (storage) {
    console.log(storage);
    const data = JSON.parse(storage);
    workFlow = data.workFlow || [];
    connections = data.connections || [];
  }
};

const instance = jsPlumb.getInstance(instanceOptions);

setupDragDrop = (element, index) => {
  let dragStart = null;
  let hasDragged = false;
  instance.draggable(element, {
    containment: "true",
    start: (params) => {
      dragStart = { left: params.e.screenX, top: params.e.screenY };
    },
    stop: async (params) => {
      hasDragged =
        dragStart.left !== params.e.screenX ||
        dragStart.top !== params.e.screenY;

      if (!hasDragged) return;
      element.left = params.pos[0];
      element.top = params.pos[1];
      workFlow[index].x = params.pos[0];
      workFlow[index].y = params.pos[1];
    },
  });
};

setupTargets = (element) => {
  instance.makeTarget(element, {
    dropOptions: { hoverClass: "hover" },
    anchor: "Continuous",
    endpoint: ["Blank", { radius: 4 }],
  });
};

setupOutcomes = (element, index) => {
  const { outcomes } = workFlow[index];
  for (let outcome of outcomes) {
    const sourceEndpointOptions = getSourceEndpointOptions(
      "id_" + index,
      "outcome",
      false
    );
    const endpointOptions = {
      connectorOverlays: [
        ["Label", { label: outcome, cssClass: "connection-label" }],
      ],
    };
    const potin = instance.addEndpoint(
      element,
      endpointOptions,
      sourceEndpointOptions
    );
  }
};

connectionCreated = (info) => {
  const { sourceId, targetId } = info;

  if (sourceId && targetId) {
    connections.push({
      source: sourceId.replace("wf-activity-", ""),
      target: targetId.replace("wf-activity-", ""),
    });
  }
};

connectionDetached = (info) => {
  const { sourceId, targetId } = info;
  const newWorkflow = connections.fill(
    (line) =>
      `wf-activity-${line.source}` !== sourceId &&
      `wf-activity-${line.source}` !== sourceId
  );
  workFlow = [...newWorkflow];
  console.log(workFlow.length);
};

createActivityElement = (activity, index) => {
  const activityDom = document.createElement("div");
  activityDom.setAttribute("id", `wf-activity-id_${index}`);
  activityDom.className = "block";
  activityDom.style.top = activity.y + "px";
  activityDom.style.left = activity.x + "px";
  activityDom.innerHTML = index;
  return activityDom;
};

renderActivity = (activity, index) => {
  const activityDom = createActivityElement(activity, index);
  document.body.appendChild(activityDom);
  setupDragDrop(activityDom, index);
  setupTargets(activityDom);
  setupOutcomes(activityDom, index);
  instance.revalidate(activityDom);
};

renderConnections = () => {
  for (let connection of connections) {
    const sourceEndpointId = `activity-${connection.source}-outcome`;
    const sourceEndpoint = instance.getEndpoint(sourceEndpointId);
    const destinationElementId = `wf-activity-${connection.target}`;

    instance.connect({
      source: sourceEndpoint,
      target: destinationElementId,
    });
  }
};

render = () => {
  instance.reset();
  instance.bind("connection", connectionCreated);
  instance.bind("connectionDetached", connectionDetached);
  instance.batch(() => {
    workFlow.forEach(renderActivity);
    renderConnections();
  });
  instance.repaintEverything();
};

main = () => {
  loadData();
  render();
};

main();
