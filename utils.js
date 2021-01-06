window.getSourceEndpointOptions = (activityId, outcome, executed) => {
  const fill = "#7da7f2";
  const stroke = fill;
  const connectorFill = executed ? "#6faa44" : "#999999";

  return {
    type: "Dot",
    anchor: "Continuous",
    paintStyle: {
      stroke: stroke,
      fill: fill,
      strokeWidth: 2,
    },
    isSource: true,
    connector: [
      "Flowchart",
      { stub: [40, 60], gap: 0, cornerRadius: 5, alwaysRespectStubs: true },
    ],
    connectorStyle: {
      strokeWidth: 2,
      stroke: connectorFill,
    },
    connectorHoverStyle: {
      strokeWidth: 2,
      stroke: connectorFill,
    },
    connectorOverlays: [
      ["Label", { location: [3, -1.5], cssClass: "endpointSourceLabel" }],
    ],
    hoverPaintStyle: {
      fill: stroke,
      stroke: fill,
    },
    dragOptions: {},
    uuid: `activity-${activityId}-outcome`,
    parameters: {
      outcome,
    },
    scope: null,
    reattachConnections: true,
    maxConnections: 1,
  };
};
