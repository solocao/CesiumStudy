export default function () {
  createMenu();
  let radios = document.querySelectorAll('input[name="menu"]');
  let contents = document.querySelectorAll('.menu_second>div');
  let tabs = document.querySelectorAll('.menu_second>div>div');
  tabs.forEach(tab => {
    let img = tab.querySelector('img')
    if (img) {
      tab.onmouseover = () => {
        img.src = require(`@/assets/btnIcons/${img.getAttribute('data-usrc')}`).default
      }
      tab.onmouseout = () => {
        img.src = require(`@/assets/btnIcons/${img.getAttribute('data-src')}`).default
      }
    }
  })
  radios.forEach(radio => {
    let label = document.querySelector(`label[for='${radio.id}']`)
    if (radio.checked) {
      label.className = "checked"
    }
    radio.onclick = (e) => {
      contents.forEach((c, i) => {
        if ((i + 1) == e.target.value) {
          c.style.display = 'flex'
        } else {
          c.style.display = 'none'
        }
      })
      radios.forEach(r => {
        let label = document.querySelector(`label[for='${r.id}']`)
        if (r.checked) {
          label.className = "checked"
        } else {
          label.className = "unchecked"
        }
      })
    }
  })
}


function createMenu() {
  let menuConf = require('./button.json');
  let menu = document.querySelector(".menu");
  let input = '', mf = '', ms = '';
  menuConf.forEach((item, index) => {
    input += `<input type="radio" name="menu" value="${index + 1}" id="m${index + 1}" ${index == 0 ? 'checked' : ''}>`;
    mf += `<label for="m${index + 1}">${item.tabName}</label>`;
    let btns = ''
    item.btns.forEach(btn => {
      btns += `<div id="${btn.id}">
                ${btn.src ? `<img width="30" data-src="${btn.src}" data-usrc="${btn.activesrc}" height="30" src="${require(`../assets/btnIcons/${btn.src}`).default}"/>` : ''}
                ${btn.name}
              </div>`;
    });
    ms += `<div>${btns}</div>`;
  })
  menu.innerHTML = input + `<div class='menu_first'>${mf}</div>` + `<div class="menu_second">${ms}</div>`
}