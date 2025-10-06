const root = {};
const TYPES = ['string', 'number', 'boolean', 'object', 'array'];

function createEl(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// 型判定ユーティリティ
function getType(val) {
  if (Array.isArray(val)) return 'array';
  if (val === null) return 'string'; // nullはstringとして扱いここでは簡略化
  return typeof val;
}

// 項目追加（objectならkey:value, arrayなら要素追加）
function addItem(container, targetType) {
  if (targetType === 'object') {
    let baseKey = 'key' + (Object.keys(container).length + 1);
    while (container.hasOwnProperty(baseKey)) {
      baseKey += '_';
    }
    container[baseKey] = '';
  } else if (targetType === 'array') {
    container.push('');
  }
  renderEditor();
}

// キーの重複チェック
function keyDuplicateCheck(obj, key, oldKey) {
  if (key === '') {
    alert('キーは空にできません');
    return false;
  }
  if (key !== oldKey && obj.hasOwnProperty(key)) {
    alert('キーが重複しています');
    return false;
  }
  return true;
}

/**  指定された要素の深さを探る */
function getDepthFrom(node, root = document.body) {
  let _depth = 0;
  let _cur = node;
  while( _cur && _cur !== root) {
    _cur = _cur.parentElement;
    if (_cur.className.indexOf('item-row') ){
      _depth++;
    }
  }
  return _cur === root ? _depth : -1;
}
/** item-row を見つけ入れ子の深さの情報を付与する */
function collectItemRowDepths() {
  const _rows = document.getElementsByClassName('item-row');
  return Array.from(_rows).map( el => ({
    el,
    depth: getDepthFrom(el, document.getElementById('editor-root'))
  }));
}
/**  入れ子の階層ごとに背景色をつける */
function renderBgColor() {
  const _rows = collectItemRowDepths();
  Array.from(_rows).forEach( _row => {
    _row.el.classList.add("bg" + _row.depth % 4);
  });
}


// 入れ子・配列の再帰レンダリング
function renderObject(container, obj) {
  container.innerHTML = '';
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const val = obj[key];
    const valType = getType(val);

    const row = createEl('div', 'item-row');

    // key input (objectのみ)
    if (Array.isArray(obj)) {
      // 配列ならインデックス表示（非編集）
      const idxSpan = createEl('span');
      idxSpan.textContent = key;
      idxSpan.style.width = '28px';
      idxSpan.style.display = 'inline-block';
      idxSpan.style.marginRight = '10px';
      row.appendChild(idxSpan);
    } else {
      const keyInput = createEl('input', 'key-input');
      keyInput.value = key;
      keyInput.type = 'text';
      keyInput.onchange = () => {
        if (!keyDuplicateCheck(obj, keyInput.value, key)) {
          keyInput.value = key;
          return;
        }
        obj[keyInput.value] = obj[key];
        delete obj[key];
        renderEditor();
      };
      row.appendChild(keyInput);
    }

    // type select
    const typeSelect = createEl('select', 'type-select');
    TYPES.forEach(t => {
      const option = createEl('option');
      option.value = t;
      option.textContent = t;
      if (t === valType) option.selected = true;
      typeSelect.appendChild(option);
    });
    typeSelect.onchange = () => {
      switch(typeSelect.value) {
        case 'string': obj[key] = ''; break;
        case 'number': obj[key] = 0; break;
        case 'boolean': obj[key] = false; break;
        case 'object': obj[key] = {}; break;
        case 'array': obj[key] = []; break;
      }
      renderEditor();
    };
    row.appendChild(typeSelect);

    // value input or recursive container
    if (valType === 'string' || valType === 'number') {
      const valInput = createEl('input', 'value-input');
      valInput.type = valType === 'number' ? 'number' : 'text';
      valInput.value = val;
      valInput.onchange = () => {
        obj[key] = valType === 'number' ? Number(valInput.value) : valInput.value;
        renderEditor();
      };
      row.appendChild(valInput);
    } else if (valType === 'boolean') {
      const boolSelect = createEl('select', 'value-input');
      ['true', 'false'].forEach(v => {
        const option = createEl('option');
        option.value = v;
        option.textContent = v;
        if (String(val) === v) option.selected = true;
        boolSelect.appendChild(option);
      });
      boolSelect.onchange = () => {
        obj[key] = boolSelect.value === 'true';
        renderEditor();
      };
      row.appendChild(boolSelect);
    } else if (valType === 'object') {
      const subContainer = createEl('div', 'object-container');
      renderObject(subContainer, val);
      row.appendChild(subContainer);
      const addBtn = createEl('button');
      addBtn.textContent = '項目追加';
      addBtn.onclick = () => {
        addItem(val, 'object');
      };
      row.appendChild(addBtn);
    } else if (valType === 'array') {
      const subContainer = createEl('div', 'array-container');
      renderArray(subContainer, val);
      row.appendChild(subContainer);
      const addBtn = createEl('button');
      addBtn.textContent = '要素追加';
      addBtn.onclick = () => {
        addItem(val, 'array');
      };
      row.appendChild(addBtn);
    }

    // 削除ボタン（配列はspliceで）
    const delBtn = createEl('button');
    delBtn.textContent = '削除';
    delBtn.onclick = () => {
      if (Array.isArray(obj)) {
        obj.splice(key, 1);
      } else {
        delete obj[key];
      }
      renderEditor();
    };
    row.appendChild(delBtn);

    container.appendChild(row);
  }
}

// 配列用レンダリング（送られた配列と同じDOM親が対象）
function renderArray(container, arr) {
  container.innerHTML = '';
  arr.forEach((item, index) => {
    const row = createEl('div', 'item-row');

    const idxSpan = createEl('span');
    idxSpan.textContent = index;
    idxSpan.style.width = '28px';
    idxSpan.style.display = 'inline-block';
    idxSpan.style.marginRight = '10px';
    row.appendChild(idxSpan);

    const valType = getType(item);

    // type select
    const typeSelect = createEl('select', 'type-select');
    TYPES.forEach(t => {
      const option = createEl('option');
      option.value = t;
      option.textContent = t;
      if (t === valType) option.selected = true;
      typeSelect.appendChild(option);
    });
    typeSelect.onchange = () => {
      switch(typeSelect.value) {
        case 'string': arr[index] = ''; break;
        case 'number': arr[index] = 0; break;
        case 'boolean': arr[index] = false; break;
        case 'object': arr[index] = {}; break;
        case 'array': arr[index] = []; break;
      }
      renderEditor();
    };
    row.appendChild(typeSelect);

    if (valType === 'string' || valType === 'number') {
      const valInput = createEl('input', 'value-input');
      valInput.type = valType === 'number' ? 'number' : 'text';
      valInput.value = item;
      valInput.onchange = () => {
        arr[index] = valType === 'number' ? Number(valInput.value) : valInput.value;
        renderEditor();
      };
      row.appendChild(valInput);
    } else if (valType === 'boolean') {
      const boolSelect = createEl('select', 'value-input');
      ['true', 'false'].forEach(v => {
        const option = createEl('option');
        option.value = v;
        option.textContent = v;
        if (String(item) === v) option.selected = true;
        boolSelect.appendChild(option);
      });
      boolSelect.onchange = () => {
        arr[index] = boolSelect.value === 'true';
        renderEditor();
      };
      row.appendChild(boolSelect);
    } else if (valType === 'object') {
      const subContainer = createEl('div', 'object-container');
      renderObject(subContainer, item);
      row.appendChild(subContainer);
      const addBtn = createEl('button');
      addBtn.textContent = '項目追加';
      addBtn.onclick = () => {
        addItem(item, 'object');
      };
      row.appendChild(addBtn);
    } else if (valType === 'array') {
      const subContainer = createEl('div', 'array-container');
      renderArray(subContainer, item);
      row.appendChild(subContainer);
      const addBtn = createEl('button');
      addBtn.textContent = '要素追加';
      addBtn.onclick = () => {
        addItem(item, 'array');
      };
      row.appendChild(addBtn);
    }

    const delBtn = createEl('button');
    delBtn.textContent = '削除';
    delBtn.onclick = () => {
      arr.splice(index, 1);
      renderEditor();
    };
    row.appendChild(delBtn);

    container.appendChild(row);
  });
}

function renderEditor() {
  const editor = document.getElementById('editor-root');
  renderObject(editor, root);
  renderBgColor();
  document.getElementById('json-output').value = JSON.stringify(root, null, 2);
}

// DOM 読み込み完了時のイベント
document.addEventListener("DOMContentLoaded", () => {
  renderEditor();
});