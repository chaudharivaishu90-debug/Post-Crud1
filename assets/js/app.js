var cl=console.log;
const Base_url="https://xhrcrud-default-rtdb.firebaseio.com";
const Post_url=`${Base_url}/Posts.json`


const City=document.getElementById("City");
const form=document.getElementById("form");
const Description=document.getElementById("Description");
const Image=document.getElementById("Image")
const AddBtn=document.getElementById("AddBtn")
const updateBtn=document.getElementById("updateBtn")
const albumdata=document.getElementById("albumdata");
const spinner=document.getElementById("spinner");



// / localstorage
state={
    PostArr:[],
    Edit_Id:null,
}
// / Snakbar
function Snakbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500,
    
    })
}

// spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}

// Templatinh


function Templating(array){
    let result=``;
    array.forEach(ele => {
        result+=`<div class="col-md-4 mb-4"id="${ele.id}">
            <div class="card h-100">
                <div class="card-header text-center bg-dark text-white">${ele.City}</div>
                <div class="card-body">
                    <p class="m-0">${ele.Description}</p>
                    <img src="${ele.Image}" alt="pune">
                
                </div>
                <div class="card-footer d-flex justify-content-between ">
                    
                    <button onclick="OnEdit(this)" type="button" class="btn btn-sm btn-primary">Edit</button>
                <button onclick="Onremove(this)"  type="button" class="btn btn-sm btn-danger" >Delete</button>
            
                </div>
            </div> 
            </div>  `
        
    });
    albumdata.innerHTML=result;
}


// Read
function Showcard(){
    Handlespinner();
    fetch(Post_url,{
        method:"GET",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
        }
})
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`);
            
        }
        return res.json();

    })
    .then(data=>{
        state.PostArr=[];
        for(const key in data){
            data[key].id=key
            state.PostArr.unshift(data[key])
        }
        Templating(state.PostArr)
    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Handlespinner();

    })

}
Showcard()




// create
function CreatePost(eve){
    Handlespinner();
    eve.preventDefault();
    let obj={
        City:City.value,
        Image:Image.value,
        Description:Description.value
    }
    fetch(Post_url,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
             "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
        }

    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`)
        }
        return res.json();

    })
    .then(data=>{
        obj.id = data.name;
        state.PostArr.unshift(obj);

        let div= document.createElement("div");
        div.id=data.name;
        div.className ="col-md-4 mb-4"
        div.innerHTML=` <div class="card h-100">
                <div class="card-header text-center bg-dark text-white">${obj.City}</div>
                <div class="card-body">
                    <p class="m-0">${obj.Description}</p>
                    <img src="${obj.Image}" alt="pune">
                
                </div>
                <div class="card-footer d-flex justify-content-between ">
                    
                    <button onclick="OnEdit(this)" type="button" class="btn btn-sm btn-primary">Edit</button>
                <button onclick="Onremove(this)" type="button" class="btn btn-sm btn-danger" >Delete</button>
            
                </div>
           
        `
        albumdata.prepend(div)
        Snakbar("Post created","success")
        form.reset();


    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Handlespinner();

    })

}

// edit

function OnEdit(eve){
    let Edit_id=eve.closest(".col-md-4").id;
    state.Edit_Id=Edit_id
    let Edit_obj=state.PostArr.find(t=>t.id===Edit_id)
    City.value=Edit_obj.City;
    Description.value=Edit_obj.Description;
    Image.value=Edit_obj.Image;
    AddBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none")
}

// update
function UpdatePosts(ele){
    Handlespinner();
    let Update_id=state.Edit_Id
    Upobj={
         City:City.value,
        Image:Image.value,
        Description:Description.value,
        id:Update_id
    
    }
let Updtae_url=`${Base_url}/Posts/${Update_id}.json`
fetch(Updtae_url,{
    method:"PATCH",
    body:JSON.stringify(Upobj),
    headers:{
        "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
    }
})
.then(res=>{
    if(!res.ok){
        throw new Error(`HTTP ERROR:${res.status}`);
        
    }
    return res.json();

})
.then(data=>{
    let index= state.PostArr.findIndex(t=>t.id===Update_id);
    state.PostArr[index]=data;
        state.PostArr[index].id = Update_id;

    let div=document.getElementById(Update_id)
    div.querySelector(".card-header").innerHTML = data.City;
div.querySelector("p").innerHTML = data.Description;
div.querySelector("img").src = data.Image;AddBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none")
            Snakbar("Post Update Sucsessfully!!","success")
            form.reset();



})
.catch(err=>{
    cl(err)

})
.finally(()=>{
    Handlespinner();
})

}





// delete
function Onremove(eve){
  let Remove_id=  eve.closest(".col-md-4").id
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    Handlespinner();
    let Remove_url=`${Base_url}/Posts/${Remove_id}.json`
    fetch(Remove_url,{
        method:"DELETE",
        body:null,
        headers:{
             "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }

    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`)
        }
        return res.json();

    })
    .then(data=>{
        let index=state.PostArr.findIndex(t=>t.id===Remove_id)
        state.PostArr.splice(index,1);
        eve.closest(".col-md-4").remove();
                Snakbar(`Post Removed id:${Remove_id}`,"success")


    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Handlespinner();
    })
  }
});
}

form.addEventListener("submit",CreatePost);
updateBtn.addEventListener("click",UpdatePosts);