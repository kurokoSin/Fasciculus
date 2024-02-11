const files = [
  {name: "1b1cdf12a9ecbd6ee6f525d35f4f5f8b.png" },
  {name: "2b300853782bf11171e484ab0cb67d22.png" },
  {name: "48aec53d4967bcdbaa8e3fbdfceefcf5.png" },
  {name: "578131e12edb7723e6e0bd91eded1110.png" },
  {name: "69d80849c381b5427765c19b6a0482f1.png" },
  {name: "6a072a243c30f30b1e9672b8b9faa291.png" },
  {name: "71b250b30f5cf0aee059b90f9f5bb7fc.png" },
  {name: "cbed7a608e6a7c11236a5defba62f86e.png" },
  {name: "13c7cf9a7ed0f10b5cfda67171eb94a8.png" },
  {name: "375b09b214d09ea207640f80b14aa3d8.png" },
  {name: "pinterest_01.png" }
] 

// document.addEventListener('load', () => {
document.addEventListener('DOMContentLoaded', () => {

  const list = document.querySelector('.fig-list');
  const play = document.querySelector('.fig-play');
  const play_icon = document.querySelector('.fig-icon');
  const speed = document.querySelector('.fig-speed');
  const speed_val = document.querySelector('.fig-speed-value');
  const view = document.querySelector('.fig-image');

  play.addEventListener('click', () => {
    view.classList.toggle('fig-rotate');
    play_icon.classList.toggle('bi-pause-fill');
    play_icon.classList.toggle('bi-play-fill');
  });

  speed.addEventListener('change', (e) => {
    let abs_value = 10050 - Math.abs(e.target.value) * 100;
    let direction = e.target.value > 0 ? 'rotate_loop_right' : 'rotate_loop_left';
    view.style.animationName = direction
    view.style["animation-duration"] = abs_value + 'ms';
    speed_val.innerText = abs_value;

  });

  setTimeout( () => {
    files.forEach( f => {
      let img_src = "./wwwroot/assets/rotate_figure/" + f.name;

      let frame = document.createElement('button');
      frame.classList.add('border', 'rounded-3');
      frame.style.height = "64px";
      frame.style.width = "64px";
      frame.style.backgroundPositionX = 0;
      frame.style.backgroundPositionY = 0;
      frame.style.backgroundRepeat = "no-repeat";
      frame.style.backgroundSize = '100%';
      frame.style.backgroundImage = "url('" + img_src + "')";
      frame.name = img_src;

      list.appendChild(frame);

      frame.addEventListener('click', (e) => {
        view.src = e.target.name;
      });
    });
  }, 1);
});
