const navs = document.querySelectorAll('.home-nav-content');

navs.forEach(nav => nav.addEventListener('mouseover',function(){
  const i = (this.parentElement).parentElement.firstElementChild;
  i.style.transform = 'scale(1.1)';
  // i.style.filter = 'blur(2px)';
  i.style.filter = 'brightness(80%)';
  i.style.transition = 'transform 6s cubic-bezier(0.25, 0.45, 0.45, 0.95)';
  // this.style.filter = 'brightness(100%)';
}))
navs.forEach(nav => nav.addEventListener('mouseleave',function(){
  const i = (this.parentElement).parentElement.firstElementChild;
  i.style.transform = 'scale(1)';
  // i.style.filter = 'blur(0px)';
  i.style.filter = 'brightness(100%)';

  i.style.transition = 'transform 6s cubic-bezier(0.25, 0.45, 0.45, 0.95)';
}))