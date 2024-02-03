const htmlToNode = (htmlStr) => {
  if (!htmlStr || typeof htmlStr !== 'string') return;

  let nodes =  document.createRange().createContextualFragment(htmlStr);
  let tmpElm = document.createElement('div');
  tmpElm.appendChild(nodes);
  return tmpElm;
};

const parse = (text, xpath_value) => {
  let nodes = (typeof text === "string" ) ? htmlToNode(text) : text;
  // let snap_shots = document.evaluate(xpath_value, nodes, null,  XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
  // return snap_shots;
  let snap_shots = document.evaluate(xpath_value, nodes, null,  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ); 
  let result_array = new Array();
  for( let i=0; i < snap_shots.snapshotLength; i++) {
    result_array.push( snap_shots.snapshotItem(i) );
  }
  return result_array;
}
