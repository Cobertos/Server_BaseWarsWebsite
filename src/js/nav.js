$(()=>{
  $("nav li").on("click", (e)=>{
    let jEl = $(e.target);
    $("nav li").each((idx, li)=>{
      let jLi = $(li);
      jLi.toggleClass("navActive", jLi[0] === jEl[0]);
    });
    
    let navClass = jEl.attr("data-navClass");
    $("main > article").removeClass("navActive");
    $("." + navClass).addClass("navActive");
  });
});