class ToggleLike{constructor(t){this.toggler=t,this.toggleLike()}toggleLike(){$(this.toggler).click((function(t){t.preventDefault();let e=this;$.ajax({type:"POST",url:$(e).attr("href")}).done((function(t){let l=parseInt($(e).attr("data-likes"));console.log(l),1==t.data.deleted?l-=1:l+=1,$(e).attr("data-likes",l),$(e).html(l+" Likes")})).fail((function(t){console.log("error in completing likes result")}))}))}}