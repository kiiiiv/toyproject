//1.방명록 작성기능
//2. 방명록 리스트 기능
//3. 방명록 삭제 기능
const form=document.getElementById('nameList');

const containerList=document.getElementById('container-list');
const num=document.getElementById('num');
const writerInput = document.getElementById('author');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
writerInput.addEventListener('input', function(event) {
  writerInput.value = event.target.value;
});
titleInput.addEventListener('input', function(event) {
  titleInput.value = event.target.value;
});
contentInput.addEventListener('input', function(event) {
  contentInput.value = event.target.value;
});
//새 방명록 추가하기
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  let formdata = new FormData(form);
  console.log(formdata);
  let formDataJson = {};
  for (let [key, value] of formdata.entries()) {
    formDataJson[key] = value;
  }
  console.log(formDataJson);
  fetch("http://likelion-toy.kro.kr:8000/posts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  })
  .then(res => res.json())
  .then(data=>console.log(data));
  renderUsers();
});

//모든 방명록 가져오기
async function getUsers(){
  // await fetch(API요청을 받는 백엔드 주소), {API요청에 담을 정보}
  try {
    let res = await fetch("http://likelion-toy.kro.kr:8000/posts/all/");
    let toJson =  await res.json();
    console.log(toJson);
    return toJson;
  } catch (error) {
    console.log(error);
  }
}
async function renderUsers(){
  let jsonData=await getUsers();
  let users=jsonData.data;
  containerList.innerHTML='';
  {users.map((user,i)=>{
    const link=document.createElement('div');
    link.id=`user_${user.post_id}`;
    const text = document.createElement('span');
    
    text.innerHTML=`
    ${i}번째 사람
    <br>
    작성자:${user.author}
    제목:${user.title}
    내용:${user.content}
    `;
    const button = document.createElement('button');
    button.innerText='삭제';
    button.addEventListener('click',()=>{
      console.log(user.post_id);
      deleteData(user.post_id); // 해당 방명록의 ID를 전달하여 삭제 함수 호출
    });
    containerList.appendChild(link);
    link.appendChild(text);
    link.appendChild(button);
  })}
  const viewButton = document.querySelector('button[onclick="renderUsers()"]');
  viewButton.style.display = 'none';
}
async function deleteData(id){
  try{
    let response = await fetch(`http://likelion-toy.kro.kr:8000/posts/${id}`, {
    method: "DELETE",
    });
    let userDiv=document.getElementById(`user_${id}`);
    containerList.removeChild(userDiv);     
  }
  catch (error){
    console.log(error);
  }  
}



