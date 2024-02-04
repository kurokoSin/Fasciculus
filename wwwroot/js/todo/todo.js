/* make random id */
const json_key = "q7-Fasciculus-Todo";
const id_len = 7;

let todos = [
  {"boards" : []},
  {"tasts"  : []}
];

const makeid = (length) => {
  let result           = '';
  const characters     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  let tm = (new Date()).getTime().toString();
  return tm + result;  
}

/* append */
const appendMemo = (root_ul, id, value) => {
  let item = document.createElement("li");
  item.className = "col-12 my-1";

  let t = document.createElement("input");
  t.id = (id === undefined || id === "" ) ? makeid(id_len) : id;
  t.value = (value === undefined ) ? "" : value;
  t.type = "text";
  t.className = "col-10";
  t.addEventListener( 'input', { handleEvent: saveMemo });

  let del_btn = document.createElement("button");
  del_btn.name = t.id;
  del_btn.innerHTML = "&cross;";
  del_btn.className = "col-1 btn btn-secondary mx-1";
  del_btn.addEventListener( 'click', { handleEvent: removeMemo });

  item.appendChild(t);
  item.appendChild(del_btn);
  root_ul.appendChild(item);
}

/* remove */
const removeMemo = (e) => {
  localStorage.removeItem(e.target.name);
  e.target.parentNode.style.display = "none";
}

/* save */
const saveMemo = (e) => {
  localStorage.setItem(e.target.id, e.target.value);
}

/* load */
const loadMemo = (root_ul) => {
  Object.keys(localStorage).forEach((key) => {
    appendMemo(root_ul, key, localStorage.getItem(key));
  });
}