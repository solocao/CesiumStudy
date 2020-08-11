export default function () {
  let radios = document.querySelectorAll('input[name="menu"]');
  radios.forEach(radio => {
    let label=document.querySelector(`label[for='${radio.id}']`)
    if (radio.checked) {
      label.className = "checked"
    }
    radio.onclick = (e) => {
      radios.forEach(r=>{
        let label=document.querySelector(`label[for='${r.id}']`)
        if(r.checked){
          label.className="checked"
        }else{
          label.className="unchecked"
        }
      })
    }
  })
}