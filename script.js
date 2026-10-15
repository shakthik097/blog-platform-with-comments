const starterPosts = [
 {id:1,title:"The beauty of starting small",author:"Riya M.",category:"Lifestyle",date:"Oct 10, 2026",excerpt:"Big changes rarely arrive all at once. Sometimes the smallest habit becomes the beginning of something wonderful.",content:"Big changes rarely arrive all at once. Sometimes the smallest habit becomes the beginning of something wonderful.\n\nStart with five minutes. Write one paragraph. Take a short walk. Ask one question you have been avoiding. Small beginnings are not less important than big achievements; they are how most big achievements begin.",comments:[{author:"Aarav",text:"A lovely reminder to keep going."}]},
 {id:2,title:"Learning is a lifelong adventure",author:"Arun K.",category:"Learning",date:"Oct 08, 2026",excerpt:"The best learners are not the people who know everything, but the people who stay curious.",content:"The best learners are not the people who know everything, but the people who stay curious.\n\nMake room for questions. Try things you might not master immediately. Keep notes about what surprised you. Learning becomes easier when we stop treating mistakes as proof that we cannot do something and start treating them as useful feedback.",comments:[]},
 {id:3,title:"Make room for creative thinking",author:"Meera S.",category:"Creativity",date:"Oct 05, 2026",excerpt:"Creativity is less about waiting for inspiration and more about giving ideas a little space to breathe.",content:"Creativity is less about waiting for inspiration and more about giving ideas a little space to breathe.\n\nCollect interesting things you notice. Combine two ideas that do not usually sit together. Let your first draft be imperfect. A creative practice grows through attention, experimentation, and the courage to begin.",comments:[{author:"Riya M.",text:"I needed to hear this today!"}]}
];
const STORE_KEY = "inkIdeasPostsV1";
let posts = loadPosts();
let activeFilter = "All";
let openedPostId = null;
const grid = document.getElementById("postsGrid");
const searchInput = document.getElementById("searchInput");
const dialog = document.getElementById("postDialog");
function loadPosts(){try{const saved=localStorage.getItem(STORE_KEY);return saved?JSON.parse(saved):starterPosts;}catch(e){return starterPosts;}}
function savePosts(){try{localStorage.setItem(STORE_KEY,JSON.stringify(posts));}catch(e){showToast("Could not save in this browser.");}}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function artClass(category){return category==="Lifestyle"?"art-lifestyle":category==="Learning"?"art-learning":"art-creativity";}
function artSymbol(category){return category==="Lifestyle"?"✿":category==="Learning"?"⌘":"✳";}
function renderPosts(){
 const term=searchInput.value.trim().toLowerCase();
 const shown=posts.filter(p=>(activeFilter==="All"||p.category===activeFilter)&&[p.title,p.author,p.category,p.excerpt,p.content].join(" ").toLowerCase().includes(term));
 grid.innerHTML=shown.map(p=>`<article class="post-card"><div class="post-art ${artClass(p.category)}"><span class="art-label">INK & IDEAS · STORY</span><span class="art-symbol">${artSymbol(p.category)}</span></div><div class="post-body"><span class="category">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.excerpt||p.content.slice(0,125))}</p><div class="post-meta"><span>By ${escapeHTML(p.author)} · ${escapeHTML(p.date)}</span><button class="read-more" data-read="${p.id}">Read story ↗</button></div></div></article>`).join("");
 document.getElementById("postCount").textContent=`${shown.length} ${shown.length===1?"story":"stories"}`;
 document.getElementById("emptyState").hidden=shown.length>0;
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;renderPosts();}));
searchInput.addEventListener("input",renderPosts);
grid.addEventListener("click",e=>{const btn=e.target.closest("[data-read]");if(btn)openPost(Number(btn.dataset.read));});
function openPost(id){const p=posts.find(item=>item.id===id);if(!p)return;openedPostId=id;document.getElementById("dialogContent").innerHTML=`<div class="dialog-content"><span class="category">${escapeHTML(p.category)}</span><h2>${escapeHTML(p.title)}</h2><div class="post-meta"><span>By ${escapeHTML(p.author)} · ${escapeHTML(p.date)}</span></div><p>${escapeHTML(p.content)}</p><div class="comment-box"><h3>Comments (${p.comments.length})</h3><div class="comment-list">${p.comments.length?p.comments.map(c=>`<div class="comment"><b>${escapeHTML(c.author)}</b>${escapeHTML(c.text)}</div>`).join(""):'<p>No comments yet. Be the first to share a thought!</p>'}</div><form class="comment-form" id="commentForm"><input id="commentAuthor" placeholder="Your name" maxlength="50" required><input id="commentText" placeholder="Write a comment..." maxlength="400" required><button type="submit">Post</button></form></div></div>`;dialog.showModal();}
document.getElementById("closeDialog").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener("submit",e=>{if(e.target.id!=="commentForm")return;e.preventDefault();const p=posts.find(item=>item.id===openedPostId);if(!p)return;p.comments.push({author:document.getElementById("commentAuthor").value.trim(),text:document.getElementById("commentText").value.trim()});savePosts();openPost(openedPostId);showToast("Comment added!");});
document.getElementById("postForm").addEventListener("submit",e=>{e.preventDefault();const title=document.getElementById("postTitle").value.trim(),author=document.getElementById("postAuthor").value.trim(),category=document.getElementById("postCategory").value,content=document.getElementById("postContent").value.trim();if(!title||!author||!content)return;posts.unshift({id:Date.now(),title,author,category,date:new Date().toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}),excerpt:content.slice(0,140),content,comments:[]});savePosts();e.target.reset();activeFilter="All";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="All"));renderPosts();document.getElementById("latest").scrollIntoView({behavior:"smooth"});showToast("Your story has been published!");});
let toastTimer;function showToast(message){document.querySelector(".toast")?.remove();const t=document.createElement("div");t.className="toast";t.textContent=message;document.body.appendChild(t);clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.remove(),2600);}
renderPosts();
