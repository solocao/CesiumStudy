export default function () {
  let radios = document.querySelectorAll('input[name="menu"]');
  let contents=document.querySelectorAll('.menu_second>div');
  console.log(contents);
  radios.forEach(radio => {
    let label=document.querySelector(`label[for='${radio.id}']`)
    if (radio.checked) {
      label.className = "checked"
    }
    radio.onclick = (e) => {
      contents.forEach((c,i)=>{
        console.log(i,e.target.value);
        if((i+1)==e.target.value){
          c.style.display='flex'
        }else{
          c.style.display='none'
        }
      })
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